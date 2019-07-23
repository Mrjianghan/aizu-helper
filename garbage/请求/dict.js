import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/saas/dict/dictPage',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/saas/dict/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/saas/dict/' + id,
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/saas/dict/' + row.id + '/' + row.type,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/saas/dict/',
    method: 'put',
    data: obj
  })
}

export function remote(type) {
  return request({
    url: '/saas/dict/type/' + type,
    method: 'get'
  })
}
