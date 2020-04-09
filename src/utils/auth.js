import Cookies from 'js-cookie'
const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(v) {
  return Cookies.set(TokenKey, v)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
