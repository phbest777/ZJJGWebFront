import request from '@/utils/request'
/*export function getList(data) {
  return request({
    url: '/table/getList',
    method: 'post',
    data,
  })
}*/

export function getList() {
  return request({
    url: '/emps/getlist',
    method: 'get',
  })
}

export function getEmpAll() {
  return request({
    url: '/emps/getlist',
    method: 'get',
  })
}

export function getEmpAllPage(pageNo, pageSize) {
  return request({
    url:
      '/emps/getlist_page/' +
      pageNo +
      '?pageNum=' +
      pageNo +
      '&pageSize=' +
      pageSize,
    method: 'get',
  })
}

export function getEmpByName(pageNo, pageSize, name) {
  return request({
    url:
      '/emps/getlist_name/' +
      pageNo +
      '?pageNum=' +
      pageNo +
      '&pageSize=' +
      pageSize +
      '&empName=' +
      name,
    method: 'get',
  })
}

export function SaveEmp(data) {
  return request({
    url: '/emps/saveEmp',
    method: 'post',
    data,
  })
}

export function DeleteEmp(data) {
  return request({
    url: '/emps/DeleteEmp',
    method: 'post',
    data,
  })
}

export function UpdateEmp(data) {
  return request({
    url: '/emps/updateEmp',
    method: 'put',
    data,
  })
}

export function DeleteEmp_Batch(data) {
  return request({
    url: '/emps/DeleteEmpBatch',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/table/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/table/doDelete',
    method: 'post',
    data,
  })
}
