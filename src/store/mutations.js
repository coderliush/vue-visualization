import * as types from './mutation-types'
const mutations = {
  [types.SET_TIME](state, time) {
    state.params.time = time
  },
  [types.SET_RATIO](state, ratio) {
    state.ratio = ratio
  },
  [types.SET_NODE_DATA](state, nodaData) {
    state.params.nodaData = nodaData
  },
}

export default mutations

