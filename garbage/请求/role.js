import request from '@/router/axios'

export function roleList() {
  return request({
    url: '/saas/role',
    method: 'get'
  })
}

export function fetchList(query) {
  return request({
    url: '/saas/role',
    method: 'get',
    params: query
  })
}

export function deptRoleList(deptId) {
  return request({
    url: '/saas/role',
    method: 'get',
    params:{
      limit:100
    }
  })
}

export function getObj(id) {
  return request({
    url: '/saas/role/' + id,
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/saas/role',
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/saas/role',
    method: 'put',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/saas/role/' + id,
    method: 'delete'
  })
}

export function permissionUpd(roleId, menuIds) {
  return request({
    url: '/saas/role/updatePermission',
    method: 'post',
    params: {
      roleId: roleId,
      menuIds: menuIds
    }
  })
}

export function fetchRoleTree(roleId) {
  return request({
    url: '/saas/menu/getMenuIdByRoleId/'+roleId,
    method: 'get'
  })
}

export function fetchDeptTree(query) {
  return request({
    url: '/saas/dept',
    method: 'get',
    params: query
  })
}
