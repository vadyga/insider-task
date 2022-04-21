<template>
  <div>
    <h1 v-if="isLost">You lose!</h1>
    <div class="game" :class="{'shutter':isLost}">
      <TeeterTotter/>
      <div class="falling-item">
        <Figure :figure="fallingItem.figure" :y="fallingItem.y" :x="fallingItem.x" :weight="fallingItem.weight"/>
      </div>
    </div>
    <button v-if="!isLost" @click="setPause(!isPaused)">
      {{ isPaused ? 'play' : 'pause' }}
    </button>
    <button v-if="isLost" @click="restart">
      restart
    </button>
  </div>
</template>

<script>
import TeeterTotter from "./TeeterTotter";
import Figure from "./Figure";
import {mapGetters, mapActions, mapState} from "vuex"

export default {
  data() {
    return {
      fallingItem: {
        x: 0,
        y: 0,
        velocity: 0,
        weight: Math.floor(Math.random() * 9) + 1,
        figure: 'rectangle',
        width: '',
        height: ''
      },
      acceleration: 0.05,
      isLeftPressed: false,
      isRightPressed: false
    }
  },
  components: {
    TeeterTotter, Figure
  },
  methods: {
    ...mapActions('game', ['setLeftKey', 'setRightKey', 'fell', 'setPause', 'restart']),
    keyDownHandler(e) {
      if (e.code === "ArrowRight") {
        this.isRightPressed = true
      } else if (e.code === 'ArrowLeft') {
        this.isLeftPressed = true
      }
    },
    keyUpHandler(e) {
      if (e.code === "ArrowRight") {
        this.isRightPressed = false
      } else if (e.code === 'ArrowLeft') {
        this.isLeftPressed = false
      }
    },
    updateFallingItem() {
      this.fell({
        x: this.fallingItem.x,
        height: this.fallingItem.weight * 10,
        weight: this.fallingItem.weight,
        figure: this.fallingItem.figure
      })
      this.fallingItem.x = 0
      this.fallingItem.y = 0
      this.fallingItem.weight = Math.floor(Math.random() * 9) + 1
      this.fallingItem.velocity = 0
      this.fallingItem.figure = this.getRandomFigure()
    },
    getRandomFigure() {
      let figureNumber = Math.floor(Math.random() * 3)
      switch (figureNumber) {
        case 0:
          return 'rectangle'
        case 1:
          return 'circle'
        case 2:
          return 'triangle'
        default:
          return ''
      }
    },
    fallingHandler() {
      if (!this.isPaused || this.isLost) {
        if (this.fallingItem.y + this.fallingItem.weight * 20 < this.getYTeeterByX(this.fallingItem.x)) {
          this.fallingItem.y += this.fallingItem.velocity
          this.fallingItem.velocity += this.acceleration
          if (this.isLeftPressed) {
            this.fallingItem.x -= 5
          } else if (this.isRightPressed) {
            this.fallingItem.x += 5
          }
        } else {
          this.updateFallingItem()
        }
      }
      window.requestAnimationFrame(this.fallingHandler)
    },
  },
  computed: {
    ...mapGetters('game', ['getFallingItem', 'getFellItems', 'getYTeeterByX']),
    ...mapState('game', ['isPaused', 'isLost'])
  },
  mounted() {
    document.addEventListener("keydown", this.keyDownHandler, false);
    document.addEventListener("keyup", this.keyUpHandler, false);
    this.fallingHandler()
  }
}
</script>

<style scoped lang="scss">
.game {
  width: 600px;
  height: 600px;
  position: relative;
  overflow: hidden;
  background-color: #eceaea;
  margin: auto;
}

.shutter {
  transition: transform ease-in-out 2s;
  transform: scale(0) rotate(360deg);
}
</style>
