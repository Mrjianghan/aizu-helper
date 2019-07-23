import request from '@/router/axios'

export function GetMenu() {
    return request({
        url: '/saas/saas/menu/getSelfMenu',
        method: 'get'
    })
}
export function fetchTree(query) {
    return request({
        url: '/saas/menu',
        method: 'get',
        params: query
    })
}

export function fetchAll() {
    return request({
        url: '/saas/menu/navMenu',
        method: 'get'
    })
}

export function fetchUserTree() {
    return request({
        url: '/saas/menu/userTree',
        method: 'get'
    })
}

export function addObj(obj) {
    return request({
        url: '/saas/menu',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/saas/menu/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return request({
        url: '/saas/menu/' + id,
        method: 'delete'
    })
}

export function putObj(obj) {
    return request({
        url: '/saas/menu',
        method: 'put',
        data: obj
    })
}
