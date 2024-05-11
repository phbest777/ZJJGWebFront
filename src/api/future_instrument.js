import request from '@/utils/request'
export function GetInstrument(data) {
  return request({
    url: '/Future/Instrument/GetInstrumentAll',
    method: 'post',
    data,
  })
}
