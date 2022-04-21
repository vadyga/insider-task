export default {
    fell: (ctx, payload) => {
        ctx.commit('setFellItem', payload)
    },
    setTeeterCoords: (ctx, payload) => {
        ctx.commit('setTeeterCoords', payload)
    },
    setPause: (state, payload) => {
        state.commit('setPause', payload)
    },
    setLose: (state, payload) => {
        state.commit('setLose', payload)
    },
    restart: (state) => {
        state.commit('restart')
    }
};