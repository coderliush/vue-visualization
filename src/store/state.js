import moment from "moment"
let defaultTime = moment(new Date()).add(1,'d').startOf('day')._d

const state = {
  ratio: null,
  numLength: {
    org: {},       // 地图运营
    district: {}   // 地图行政区
  },
  params: {
    id: 801,
    type: 1,
    devicetype: 0,   // 设备类型
    hardversion: '', //  固体版本
    querytime: defaultTime,
  },
  text: {         // 选择的描述   
    business: {
      active: 'org',       // 默认运营
      orgList: [],       // 选择的运营区域,
      districtList: [],   // 选择的行政区区域
      address: ''        // 输入框的值
    }, 
    deviceList: ['设备属性'],      // 选择的设备属性
    lifeList: ['生命状态']        // 选择的生命状态
  }
}

export default state