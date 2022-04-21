import getters from "./gameGetters";
import actions from "./gameActions";
import mutations from "./gameMutations";

const state = {
    isPaused: false,
    isLost: false,
    fellItems: [],
    teeterTotterCoords: {
       leftX: null,
       rightX: null,
       leftY: null,
       rightY: null,
    },
};

export default {
  state,
  getters,
  actions,
  mutations,
};