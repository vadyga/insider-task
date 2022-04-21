<template>
  <div :class="figure"
       :style="`top: ${y}px; left:${x}px; width: ${weight*10}px; height: ${weight*10}px; transform: rotate(${angle}deg)`">
    <span class="weight">
      {{ weight }}
    </span>
  </div>
</template>

<script>

export default {
  name: "Figure",
  props: {
    angle: {
      default: 0
    },
    x: {},
    y: {},
    weight: {},
    figure: {},
  },

}
</script>

<style scoped>
.rectangle {
  width: 100px;
  height: 100px;
  background-color: #555555;
  position: absolute;
  display: flex;
}

.weight {
  margin: auto;
  color: white;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background-color: #555555;
  transition: all linear 40ms;
  display: flex;
}

.triangle {
  position: absolute;
  overflow: hidden;
  clip-path: polygon(100% 100%, 50% 0, 0 100%);
  background-color: #555555;
}

.triangle .weight {
  position: absolute;
  bottom: 0;
}

/*.triangle:before{*/
/*  content: '';*/
/*  position: absolute;*/
/*  top: 0;*/
/*  display: block;*/
/*  width: 100%;*/
/*  height: 100%;*/
/*  background-color: #555555;*/
/*  transform: translate(0, 75%) rotate(45deg) scale(2);*/
/*}*/
</style>