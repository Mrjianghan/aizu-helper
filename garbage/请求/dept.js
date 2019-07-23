import request from '@/router/axios'

export function fetchTree(query) {
  return request({
    url: '/saas/dept',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/saas/dept/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/saas/dept/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/saas/dept/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/saas/dept/',
    method: 'put',
    data: obj
  })
}
