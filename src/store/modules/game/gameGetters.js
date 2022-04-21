export default {
    getYTeeterByX: (state) => (x) => {
        let delta = (x - state.teeterTotterCoords.leftX) / (state.teeterTotterCoords.rightX - x)
        return (state.teeterTotterCoords.leftY + delta * state.teeterTotterCoords.rightY) / (1 + delta)
    },
    getFallingItem: (state) => {
        return state.fallingItem
    },
    getFellItems: (state) => {
        return state.fellItems
    },
};