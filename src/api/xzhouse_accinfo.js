import request from '@/utils/request'
export function GetJgAccinfoList(userName, pageNo, pageSize) {
  return request({
    url: '/Zjjg/AccManagement/GetJgAccinfoByUser',
    method: 'post',
    data: { username: userName, pageno: pageNo, pagesize: pageSize },
  })
}

export function GetJgAccinfoByMultiChoose(
  userName,
  payerName,
  payerAcc,
  contractNo,
  useFlag,
  orgId,
  pageNo,
  pageSize
) {
  return request({
    url: '/Zjjg/AccManagement/GetJgAccinfoByMultiChoose',
    method: 'post',
    data: {
      username: userName,
      payername: payerName,
      payeracc: payerAcc,
      contractno: contractNo,
      useflag: useFlag,
      orgid: orgId,
      pageno: pageNo,
      pagesize: pageSize,
    },
  })
}

export function AddJgAccinfoByDetail(data) {
  return request({
    url: '/Zjjg/AccManagement/AddJgAccinfoByDetail',
    method: 'post',
    data,
  })
}
