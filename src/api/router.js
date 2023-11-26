import request from '@/utils/request'

export function getRouterList(username) {
  return request({
    url: '/menu/navigate',
    method: 'post',
    data: {
      username: username,
    },
  })
}
