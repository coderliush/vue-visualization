import * as types from './mutation-types'
const mutations = {
  [types.SET_TIME](state, time) {
    state.params.time = time
  },
}

export default mutations

