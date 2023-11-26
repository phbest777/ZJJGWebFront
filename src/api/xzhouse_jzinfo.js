import request from '@/utils/request'
export function GetJzinfoList(userName, pageNo, pageSize) {
  return request({
    url: '/Zjjg/AccDebt/GetJzinfoByUser',
    method: 'post',
    data: { username: userName, pageno: pageNo, pagesize: pageSize },
  })
}

export function GetJzinfoNewList(userName, pageNo, pageSize) {
  return request({
    url: '/Zjjg/AccDebt/GetJzinfoNewByUser',
    method: 'post',
    data: { username: userName, pageno: pageNo, pagesize: pageSize },
  })
}
export function GetJzinfoListByChoose(
  userName,
  payerName,
  payerAcc,
  contractNo,
  recordNo,
  Ckr,
  Price,
  Flag,
  startdataDate,
  enddataDate,
  isJz,
  orgId,
  pageNo,
  pageSize
) {
  return request({
    url: '/Zjjg/AccDebt/GetJzinfoByMultiChoose',
    method: 'post',
    data: {
      username: userName,
      payername: payerName,
      payeracc: payerAcc,
      contractno: contractNo,
      recordno: recordNo,
      ckr: Ckr,
      price: Price,
      flag: Flag,
      startdatadate: startdataDate,
      enddatadate: enddataDate,
      isjz: isJz,
      orgid: orgId,
      pageno: pageNo,
      pagesize: pageSize,
    },
  })
}

export function GetJzinfoNewListByChoose(
  userName,
  payerName,
  payerAcc,
  contractNo,
  recordNo,
  Ckr,
  Price,
  Flag,
  startdataDate,
  enddataDate,
  isJz,
  orgId,
  pageNo,
  pageSize
) {
  return request({
    url: '/Zjjg/AccDebt/GetJzinfoNewByMultiChoose',
    method: 'post',
    data: {
      username: userName,
      payername: payerName,
      payeracc: payerAcc,
      contractno: contractNo,
      recordno: recordNo,
      ckr: Ckr,
      price: Price,
      flag: Flag,
      startdatadate: startdataDate,
      enddatadate: enddataDate,
      isjz: isJz,
      orgid: orgId,
      pageno: pageNo,
      pagesize: pageSize,
    },
  })
}

export function AddJzInfoByDetail(data) {
  return request({
    url: '/Zjjg/AccDebt/AddJzInfoByDetail',
    method: 'post',
    data,
  })
}

export function AddJzInfoNewByDetail(data) {
  return request({
    url: '/Zjjg/AccDebt/AddJzInfoNewByDetail',
    method: 'post',
    data,
  })
}
