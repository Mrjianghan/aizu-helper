import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/admin/enterprise',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/enterprise',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/enterprise/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/enterprise/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/enterprise',
    method: 'put',
    data: obj
  })
}

