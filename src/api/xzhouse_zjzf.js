import request from '@/utils/request'
export function GetRcvAccinfoList(userName, pageNo, pageSize) {
  return request({
    url: '/Zjjg/AccPay/GetRcvAccinfoList',
    method: 'post',
    data: { username: userName, pageno: pageNo, pagesize: pageSize },
  })
}

export function GetZfTransListByAll(userName, queryMode, pageNo, pageSize) {
  return request({
    url: '/Zjjg/AccPay/GetZfTransListByAll',
    method: 'post',
    data: {
      username: userName,
      querymode: queryMode,
      pageno: pageNo,
      pagesize: pageSize,
    },
  })
}

export function GetZfTransListByMultiChoose(
  userName,
  rcvName,
  rcvAcc,
  amt,
  zfFlag,
  startDate,
  endDate,
  queryMode,
  pageNo,
  pageSize
) {
  return request({
    url: '/Zjjg/AccPay/GetZfTransListByMultiChoose',
    method: 'post',
    data: {
      username: userName,
      rcvname: rcvName,
      rcvacc: rcvAcc,
      amt: amt,
      zfflag: zfFlag,
      startdate: startDate,
      enddate: endDate,
      querymode: queryMode,
      pageno: pageNo,
      pagesize: pageSize,
    },
  })
}

export function UpZfInfoByDetail(data) {
  return request({
    url: '/Zjjg/AccPay/UpZfInfoByDetail',
    method: 'post',
    data,
  })
}

export function CheckZfInfoRedo(data) {
  return request({
    url: '/Zjjg/AccPay/CheckZfInfoRedo',
    method: 'post',
    data,
  })
}
