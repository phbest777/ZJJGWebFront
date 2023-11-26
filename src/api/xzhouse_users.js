import request from '@/utils/request'

export function GetUserinfoList(userName, pageNo, pageSize) {
  return request({
    url: '/Zjjg/PersonnelManagement/UserManagement/GetUserinfoList',
    method: 'post',
    data: { username: userName, pageno: pageNo, pagesize: pageSize },
  })
}

export function UpdateUserinfoList(data) {
  return request({
    url: '/Zjjg/PersonnelManagement/UserManagement/UpdateUserinfoList',
    method: 'post',
    data,
  })
}

export function GetUserinfo(userName) {
  return request({
    url: '/Zjjg/PersonnelManagement/UserManagement/GetUserinfo',
    method: 'post',
    data: { username: userName },
  })
}

export function UpdateUserPass(data) {
  return request({
    url: '/Zjjg/PersonnelManagement/UserManagement/UpdateUserPass',
    method: 'post',
    data,
  })
}
