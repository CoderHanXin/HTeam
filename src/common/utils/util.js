'use strict'

export function setTitle(title) {
  if (title) {
    title = title + ' - HTeam'
  } else {
    title = 'HTeam'
  }
  window.document.title = title
}

export function inOf(arr, targetArr) {
  let res = true
  arr.forEach(item => {
    if (targetArr.indexOf(item) < 0) {
      res = false
    }
  })
  return res
}

export function oneOf(ele, targetArr) {
  return targetArr.indexOf(ele) >= 0
}
