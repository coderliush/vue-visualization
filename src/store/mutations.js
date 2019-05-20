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
    if (obj.name === '全部') { state.text.deviceList = [] } else { state.text.deviceList.splice(0, 1, obj.name) }
  },
  [types.SET_HARD_VERSION](state, val) { // 固体版本
    state.params.hardversion = val
    if (!val) return
    if (val === '全部') { state.text.deviceList.splice(1, 1) } else { state.text.deviceList.splice(1, 1, val) }
  },
  [types.SET_ADDRESS](state, address) {
    state.text.business.address = address
  },
  [types.SET_ORG_LIST](state, list) {
    state.text.business.orgList = list.slice().length === 0 ? ['运营本部'] :  list.slice()  // 不修改 list, list.slice() 返回一个新数组
  },
  [types.SET_DISTRICT_LIST](state, list) {
    state.text.business.districtList = list.slice().length === 0 ? ['行政本部'] : list.slice()
  },
  [types.SET_ACTIVE](state, str) {
    state.text.business.active = str
  },
  [types.SET_LIFE](state, list) {
    state.text.lifeList = list.slice()
  },
  [types.SET_INSTALL](state, value) {
    state.lifeParams.isInstall = value
  },
  [types.SET_ACCEPT](state, value) {
    state.lifeParams.isAccept = value
  },
  [types.SET_REPAIR](state, value) {
    state.lifeParams.isRepair = value
  },
  [types.SET_CANCEL](state, value) {
    state.lifeParams.isCancel = value
  },
}

export default mutations

