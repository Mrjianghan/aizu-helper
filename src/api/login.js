import request from '@/router/axios'
import qs from 'qs'


export const loginByUsername = (data) => {
    return request({
        url: '/enterprise/saas/user/login',
        method: 'post',
        data:qs.stringify(data)
    })
}


export function mobileLogin(mobile, code) {
  var grant_type = 'mobile'
  var scope = 'server'
  return request({
    url: '/auth/mobile/token',
    method: 'post',
    params: { mobile, code, grant_type, scope }
  })
}

export const getUserInfo = () => {
    return request({
        url: '/enterprise/saas/user/info',
        method: 'get'
    })
}

export const logout = (accesstoken) => {
    return request({
        url: '/enterprise/saas/user/logout',
        method: 'post',
        params: { accesstoken }
    })
}

