import * as types from './mutation-types'
const mutations = {
  [types.GET_MOUSE_EVENT](state, e) {
    state.position = e
  },
  [types.TOOLTIP_PARAMS](state, params) {
    state.tooltipParams = params
  },
  [types.TOOLTIP_CONTEXT](state, res) {
    state.tooltipContext = res
  },
  [types.GET_TOOLTIP_TYPE](state, type) {
    state.tooltipType = type
  },
}

export default mutations

