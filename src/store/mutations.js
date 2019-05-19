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
  [types.SET_ORG](state, org) {
    state.numLength.org = org
  },
  [types.SET_DISTRICT](state, district) {
    state.numLength.district = district
  },
  [types.SET_DEVICE](state, obj) {  // 设备类型
    state.params.devicetype = obj.id
    if (obj.name === '全部') {obj.name = '设备属性'}
    state.text.deviceList.splice(0, 1, obj.name)
  },
  [types.SET_HARD_VERSION](state, val) { // 固体版本
    state.params.hardversion = val
    if (val) {state.text.deviceList.splice(1, 1, val)} else {state.text.deviceList.splice(1, 1)}
  },
  [types.SET_ADDRESS](state, address) {
    state.text.business.address = address
  },
  [types.SET_ORG_LIST](state, list) {
    state.text.business.orgList = list.slice().length === 0 ? ['运营区域'] :  list.slice()  // 不修改 list, list.slice() 返回一个新数组
  },
  [types.SET_DISTRICT_LIST](state, list) {
    state.text.business.districtList = list.slice().length === 0 ? ['行政区域'] : list.slice()
  },
  [types.SET_ACTIVE](state, str) {
    state.text.business.active = str
  },
  [types.SET_LIFE](state, list) {
    state.text.lifeList = list.slice()
  },
}

export default mutations

