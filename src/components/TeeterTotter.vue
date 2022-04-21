<template>
  <div>
    <div class="base"></div>
    <div class="teeterTooter" :style="`transform: rotate(${rotate}deg)`" ref="teeter">
      <div class="fell-item" v-for="(item, idx) in getFellItems" :key="idx">
        <Figure :figure="item.figure" :y="-1*item.weight*10" :x="item.x" :weight="item.weight"/>
      </div>
    </div>
    <div class="status-bar">
      <div>
        Total weight: {{leftWeight}}
      </div>
      <div>
        Total weight: {{rightWeight}}
      </div>
    </div>
  </div>
</template>

<script>
import Figure from "./Figure";
import {mapActions, mapGetters, mapState} from 'vuex';

const MAX_ALLOWED_WEIGHT = 20
const MAX_ALLOWED_ANGLE = 30
export default {
  name: "TeeterTotter",
  data() {
    return {
      leftForce: 0,
      rightForce: 0,
      speed: 0,
      velocity: 0.001,
      rotate: 0,
      leftWeight: 0,
      rightWeight: 0
    }
  },
  components: {
    Figure
  },
  computed: {
    ...mapGetters('game', ['getFellItems', 'getYTeeterByX']),
    ...mapState('game', ['isPaused', 'isLost'])
  },
  methods: {
    ...mapActions('game', ['setTeeterCoords', 'setUpdatedFellItems', 'setPause', 'setLose', 'fell']),
    setCoords() {
      let teeterCoords = this.$refs.teeter.getBoundingClientRect()
      let coords = {}
      coords.leftX = teeterCoords.left
      coords.rightX = teeterCoords.right
      if (this.rotate > 0) {
        coords.leftY = teeterCoords.top
        coords.rightY = teeterCoords.bottom
      } else {
        coords.leftY = teeterCoords.bottom
        coords.rightY = teeterCoords.top
      }
      this.setTeeterCoords(coords)
    },
    render() {
      if (!this.isPaused) {
        this.leftForce = 0
        this.rightForce = 0
        this.leftWeight = 0
        this.rightWeight = 0
        this.getFellItems.forEach(item => {
          if (item.x > this.$refs.teeter.offsetWidth / 2) {
            this.rightForce += item.weight * (item.x - this.$refs.teeter.offsetWidth / 2)
            this.rightWeight += item.weight
          } else {
            this.leftForce += item.weight * (this.$refs.teeter.offsetWidth / 2 - item.x)
            this.leftWeight += item.weight
          }
        })
        if (this.leftForce > this.rightForce) {
          this.rotate -= Math.abs(this.speed)
          this.speed -= this.velocity
        } else if (this.leftForce < this.rightForce) {
          this.rotate += Math.abs(this.speed)
          this.speed += this.velocity
        }
        if (Math.abs(this.rotate) >= MAX_ALLOWED_ANGLE || Math.abs(this.leftWeight - this.rightWeight) >= MAX_ALLOWED_WEIGHT) {
          this.setLose(true)
        }
        this.setCoords()
      }
      window.requestAnimationFrame(this.render)
    },
    placeRandomFigures() {
      let randomWeight = Math.floor(Math.random() * 18) + 1
      let placedWeight = 0
      while (placedWeight < randomWeight) {
        let weight = Math.floor(Math.random() * 9) + 1
        if (placedWeight + weight >= 20) {
          weight = randomWeight - placedWeight
        }
        placedWeight += weight
        this.fell({
          x: Math.floor(Math.random() * 249) + this.$refs.teeter.offsetWidth / 2,
          height: weight * 10,
          weight: weight,
          figure: this.getRandomFigure()
        })
      }
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
  },
  mounted() {
    this.render()
    this.placeRandomFigures()
    console.log(this.$refs.teeter.offsetWidth / 2)
  },
  watch: {
    'isLost' : {
      handler(newVal){
        if(newVal === false) {
          this.rotate = 0
          this.speed = 0
          this.setCoords()
          this.placeRandomFigures()
        }
      }
    }
  }
}
</script>

<style scoped>
.base {
  content: '';
  position: absolute;
  margin-left: auto;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, 0%);
  bottom: 0;
  border: 150px solid transparent;
  border-bottom: 150px solid green;
}

.teeterTooter {
  position: absolute;
  bottom: 150px;
  height: 5px;
  width: 100%;
  background-color: black;
}

.status-bar{
  display: flex;
  justify-content: space-between;
  padding: 10px;
}
</style>