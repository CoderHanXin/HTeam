'use strict'

export function setTitle(title) {
  if (title) {
    title = title + ' - HTeam'
  } else {
    title = 'HTeam'
  }
  window.document.title = title
}
