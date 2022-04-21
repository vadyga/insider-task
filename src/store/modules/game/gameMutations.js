export default {
    setFellItem: (state, payload) => {
        state.fellItems.push(payload)
    },
    setTeeterCoords: (state, payload) => {
        state.teeterTotterCoords = payload
    },
    setPause: (state, payload) => {
        state.isPaused = payload
    },
    setLose: (state, payload) => {
        state.isLost = payload
        state.isPaused = true
    },
    restart: (state) => {
        state.fellItems = []
        state.isLost = false
        state.isPaused = false
        state.teeterTotterCoords.leftX = null
        state.teeterTotterCoords.rightX = null
        state.teeterTotterCoords.leftY = null
        state.teeterTotterCoords.rightY = null
    }
};