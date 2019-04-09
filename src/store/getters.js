export const ratio = state => state.ratio

export const params = state => state.params

export const deviceNumLength = state => state.deviceNumLength

export const querytime = state => {
  let date = state.params.querytime
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
