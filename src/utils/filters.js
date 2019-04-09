const filters = {
  splitNum(num) {
    if(num===null) return '暂无';
      let str = (num || 0).toString()
      if (str.indexOf('.') === -1) {
        return str.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      } else {
        return str.substring(0, str.indexOf('.')).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + str.substring(str.indexOf('.'))
      }
  }
}

export default filters