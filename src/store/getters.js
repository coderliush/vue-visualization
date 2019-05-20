import moment from 'moment'

export const ratio = state => state.ratio

export const params = state => state.params

export const lifeParams = state => state.lifeParams

export const numLength = state => state.numLength

export const querytime = state => {
  let date = state.params.querytime
  date = moment(date).subtract(1,'d').startOf('day')._d
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export const text = state => state.text

