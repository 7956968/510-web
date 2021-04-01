import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

/**
 * 获取当前用户的信息对象的字符串形式
 * 如果需要获取某属性xx的值, 写法为JSON.parse(getUser()).xx
 * @return {*} 字符串形式的用户信息
 */
export function getUser() {
  return Cookies.get("Admin-Token")
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
