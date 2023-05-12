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
      pageno: pageNo,
      pagesize: pageSize,
    },
  })
}

export function GetAccInfoList(userName) {
  return request({
    url: '/Zjjg/AccInfo/GetAccInfoList',
    method: 'post',
    data: { username: userName },
  })
}
