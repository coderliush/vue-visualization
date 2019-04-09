import * as types from './mutation-types'
const mutations = {
  [types.SET_TIME](state, time) {
    state.params.querytime = time
  },
  [types.SET_RATIO](state, ratio) {
    state.ratio = ratio
  },
  [types.SET_NODE_DATA](state, nodeData) {
    state.params.id = nodeData.id
    state.params.type = nodeData.type
  },
  [types.SET_NUM_INDEX](state, deviceNumLength) {
    state.deviceNumLength = deviceNumLength
  },
  [types.SET_DEVICE_TYPE](state, value) {
    state.params.devicetype = value
  },
  [types.SET_HARD_VERSION](state, value) {
    state.params.hardversion = value
  },
}

export default mutations

