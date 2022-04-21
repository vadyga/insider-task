<template>
  <TeeterTotterGame/>
</template>

<script>
import TeeterTotterGame from "./components/TeeterTotterGame";

export default {
  name: 'App',
  components: {
    TeeterTotterGame
  },
  data() {
    return {}
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
