import currency from 'currency.js'

// currency.js  计算百分比
// 方法：add, subtract, multiply, distribute


const objAddPercent = (obj) => {
  for (let k in obj) {
    const percent = obj[k] * 100 / obj.total
      obj[k + 'Percent'] = currency(percent, {precision: 2}).value + '%'
  }
  return obj
}

export default objAddPercent


