import request from '@/utils/request'
export function GetOneMinuteMD(data) {
  return request({
    url: '/Future/MD/GetOneMinuteMDByCode',
    method: 'post',
    data,
  })
}
