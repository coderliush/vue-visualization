import * as types from './mutation-types'
const mutations = {
  [types.SET_TIME](state, time) {
    state.params.time = time
  },
  [types.SET_RATIO](state, ratio) {
    state.ratio = ratio
  },
}

export default mutations

