import request from '@/utils/request'
export function GetGjinfoList(userName, pageNo, pageSize) {
  return request({
    url: '/Zjjg/AccCollect/GetGjinfoByUser',
    method: 'post',
    data: { username: userName, pageno: pageNo, pagesize: pageSize },
  })
}

export function GetGjinfoListByChoose(
  userName,
  payerName,
  payerAcc,
  contractNo,
  Amt,
  startdataDate,
  enddataDate,
  isGj,
  orgId,
  pageNo,
  pageSize
) {
  return request({
    url: '/Zjjg/AccCollect/GetGjinfoByMultiChoose',
    method: 'post',
    data: {
      username: userName,
      payername: payerName,
      payeracc: payerAcc,
      contractno: contractNo,
      amt: Amt,
      startdatadate: startdataDate,
      enddatadate: enddataDate,
      isgj: isGj,
      orgid: orgId,
      pageno: pageNo,
      pagesize: pageSize,
    },
  })
}

export function AddGjInfoByDetail(data) {
  return request({
    url: '/Zjjg/AccCollect/AddGjInfoByDetail',
    method: 'post',
    data,
  })
}
export function GetAccInfoList(userName) {
  return request({
    url: '/Zjjg/AccInfo/GetAccInfoList',
    method: 'post',
    data: { username: userName },
  })
}

export function GetGjJzValidByUser(userName, pageNo, pageSize) {
  return request({
    url: '/Zjjg/AccCollect/GetGjJzValidByUser',
    method: 'post',
    data: { username: userName, pageno: pageNo, pagesize: pageSize },
  })
}

export function GetGjJzValidByMultiChoose(
  userName,
  payerName,
  payerAcc,
  contractNo,
  isValid,
  orgId,
  pageNo,
  pageSize
) {
  return request({
    url: '/Zjjg/AccCollect/GetGjJzValidByMultiChoose',
    method: 'post',
    data: {
      username: userName,
      payername: payerName,
      payeracc: payerAcc,
      contractno: contractNo,
      isvalid: isValid,
      orgid: orgId,
      pageno: pageNo,
      pagesize: pageSize,
    },
  })
}
