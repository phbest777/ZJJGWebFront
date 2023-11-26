<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-autocomplete
              v-model.trim="queryForm.payername"
              :trigger-on-focus="false"
              :fetch-suggestions="querySearchByJgName"
              placeholder="开发商"
              prefix-icon="el-icon-search"
              clearable
              @select="selectHandleByJgname"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-autocomplete
              v-model.trim="queryForm.payeracc"
              :trigger-on-focus="false"
              :fetch-suggestions="querySearchByJgAcc"
              placeholder="监管账号"
              prefix-icon="el-icon-search"
              clearable
              @select="selectHandleByJgAccount"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-autocomplete
              v-model.trim="queryForm.contractno"
              :trigger-on-focus="false"
              :fetch-suggestions="querySearchByContractno"
              placeholder="协议编号"
              prefix-icon="el-icon-search"
              clearable
              @select="selectHandleByContractno"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="queryForm.orgid"
              clearable
              placeholder="机构查询"
              @change="$forceUpdate()"
            >
              <el-option
                v-for="item in orgidlist"
                :key="item.id"
                :label="item.orgname"
                :value="item.orgid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="queryForm.useflag"
              clearable
              placeholder="使用标志"
              @change="$forceUpdate()"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="handleQuery"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-bottom-panel>
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="handleAdd(orgidlist)"
        >
          添加
        </el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">
          删除
        </el-button>
        <el-button type="primary" @click="testMessage">baseMessage</el-button>
        <el-button type="primary" @click="testALert">baseAlert</el-button>
        <el-button type="primary" @click="testConfirm">baseConfirm</el-button>
        <el-button type="primary" @click="testNotify">baseNotify</el-button>
      </vab-query-form-bottom-panel>
    </vab-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      border
      style="width: 100%"
      highlight-current-row
      :data="list"
      :element-loading-text="elementLoadingText"
      :height="height"
      @selection-change="setSelectRows"
      @sort-change="tableSortChange"
    >
      <el-table-column
        show-overflow-tooltip
        type="selection"
        width="55"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="序号" width="50" fixed>
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="zhmc"
        label="账户名称"
        width="245"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="监管账号"
        prop="jgAccount"
        width="150"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="协议编号"
        prop="xybh"
        width="135"
        sortable
      ></el-table-column>
      <el-table-column
        v-if="false"
        show-overflow-tooltip
        label="项目名称"
        prop="itemName"
        width="245"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="银行编号"
        prop="bankNo"
        width="80"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="银行名称"
        prop="bankName"
        width="239"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="使用标志"
        prop="useFlag"
        width="90"
      >
        <template #default="{ row }">
          <el-tag :type="row.useFlag | statusFilter">
            {{ row.useFlag | statusForm }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="开户时间"
        prop="createDate"
        width="190"
        sortable
      ></el-table-column>
    </el-table>
    <el-pagination
      :background="background"
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <acc-add ref="edit-add" @refresh-data="fetchData"></acc-add>
  </div>
</template>

<script>
  import { GetAccInfoList } from '@/api/xzhouse_gjinfo'
  import {
    GetJgAccinfoList,
    GetJgAccinfoByMultiChoose,
  } from '@/api/xzhouse_accinfo'
  import AccAdd from './components/AccAdd'
  import store from '@/store'
  export default {
    name: 'ComprehensiveTable',
    components: {
      AccAdd,
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: 'success',
          0: 'danger',
          //deleted: 'danger',
        }
        return statusMap[status]
      },
      statusForm(status) {
        const statusMap = {
          1: '已启用',
          0: '未启用',
          2: '注销中',
          //deleted: 'danger',
        }
        return statusMap[status]
      },
    },
    data() {
      return {
        imgShow: true,
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          payeracc: '',
          payername: '',
          contractno: '',
          orgid: '',
          orgname: '',
          useflag: '',
        },
        options: [
          {
            value: '3',
            label: '全部',
          },
          {
            value: '1',
            label: '已启用',
          },
          {
            value: '0',
            label: '未启用',
          },
          {
            value: '2',
            label: '注销中',
          },
        ],
        options_zjxz: [
          {
            value: '1',
            label: '全部',
          },
          {
            value: '2',
            label: '专用POS',
          },
          {
            value: '0',
            label: '银行贷款',
          },
        ],
        temp: '11111',
        date: [],
        orgidlist: [],
        accinfolist: [],
        accinfo: { jgaccount: '', jgname: '', contractno: '' },
        timeout: '',
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    created() {
      this.fetchData()
    },
    beforeDestroy() {},
    mounted() {
      //this.fetchData()
    },
    methods: {
      tableSortChange() {
        const imageList = []
        this.$refs.tableSort.tableData.forEach((item, index) => {
          imageList.push(item.img)
        })
        this.imageList = imageList
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleAdd(orgIdList) {
        this.$refs['edit-add'].showEdit(orgIdList)
      },
      handleEdit(row) {
        this.$refs['edit-show'].showEdit(row)
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id })
            this.$baseMessage(msg, 'success')
            this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids: ids })
              this.$baseMessage(msg, 'success')
              this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      handleQuery() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        /* console.log('payeracc is' + this.queryForm.payeracc)
      console.log('payeracc is' + this.queryForm.contractno)
      console.log('payeracc is' + this.queryForm.startdate)
      console.log('payeracc is' + this.queryForm.enddate)
      console.log('payeracc is' + this.queryForm.payername)
      console.log('payeracc is' + this.queryForm.orgid)*/
        if (
          this.queryForm.payeracc === '' &&
          this.queryForm.payername === '' &&
          this.queryForm.contractno === '' &&
          this.queryForm.orgid === '' &&
          (this.queryForm.useflag === '' || this.queryForm.useflag === '3')
        ) {
          const { data, totalCount, code, orgidlist } = await GetJgAccinfoList(
            store.getters['user/username'],
            this.queryForm.pageNo,
            this.queryForm.pageSize
          )
          //console.log('date is:' + date)
          //console.log('usernamesss is:' + store.getters['user/username'])

          if (code !== '200') {
            this.list = null
          } else {
            this.list = data
            this.orgidlist = orgidlist
          }
          //console.log(data)
          const imageList = []
          data.forEach((item, index) => {
            imageList.push(item.img)
          })
          this.imageList = imageList
          this.total = totalCount
          //console.log('list is :' + data)
          setTimeout(() => {
            this.listLoading = false
            //this.listLoading.close()
          }, 500)
        } else {
          try {
            const { data, totalCount, code } = await GetJgAccinfoByMultiChoose(
              store.getters['user/username'],
              this.queryForm.payername,
              this.queryForm.payeracc,
              this.queryForm.contractno,
              this.queryForm.useflag,
              this.queryForm.orgid,
              this.queryForm.pageNo,
              this.queryForm.pageSize
            )
            if (code === '200') {
              this.list = data
              const imageList = []
              data.forEach((item, index) => {
                imageList.push(item.img)
              })
              this.imageList = imageList
              this.total = totalCount
              //console.log('list is :' + data)
              setTimeout(() => {
                this.listLoading = false
                //this.listLoading.close()
              }, 500)
            }
          } catch (e) {
            this.list = null
            this.listLoading = false
          }
          //console.log(data)
        }
      },
      testMessage() {
        this.$baseMessage('test1', 'success')
      },
      testALert() {
        this.$baseAlert('11')
        this.$baseAlert('11', '自定义标题', () => {
          /* 可以写回调; */
        })
        this.$baseAlert('11', null, () => {
          /* 可以写回调; */
        })
      },
      testConfirm() {
        this.$baseConfirm(
          '你确定要执行该操作?',
          null,
          () => {
            /* 可以写回调; */
          },
          () => {
            /* 可以写回调; */
          }
        )
      },
      testNotify() {
        this.$baseNotify('测试消息提示', 'test', 'success', 'bottom-right')
      },
      createStateFilterByJgname(queryString) {
        return (list) => {
          return list.jgname.indexOf(queryString) >= 0
        }
      },

      createStateFilterByContractno(queryString) {
        return (list) => {
          return list.contractno.indexOf(queryString) >= 0
        }
      },
      createStateFilterByJgAccount(queryString) {
        return (list) => {
          return list.jgaccount.indexOf(queryString) >= 0
        }
      },
      querySearchByJgAcc(queryString, callback) {
        GetAccInfoList(store.getters['user/username'])
          .then((res) => {
            let retdata = res.data
            if (res.code === '200') {
              retdata.forEach((item, index) => {
                item.value = item.jgaccount
              })
              let jgaccounts = (this.accinfolist = retdata)
              let results = queryString
                ? jgaccounts.filter(
                    this.createStateFilterByJgAccount(queryString)
                  )
                : jgaccounts
              results = this.arrayReuse(results)
              clearTimeout(this.timeout)
              this.timeout = setTimeout(() => {
                callback(results)
              }, 100 * Math.random())
            } else {
              this.$message({
                type: 'error',
                message: res.data.code,
              })
            }
          })
          .catch((err) => {
            callback([]) //如果搜索不到数据需要传空   才会隐藏下拉框
          })
      },
      querySearchByContractno(queryString, callback) {
        GetAccInfoList(store.getters['user/username'])
          .then((res) => {
            let retdata = res.data
            if (res.code === '200') {
              retdata.forEach((item, index) => {
                item.value = item.contractno
              })
              let contractnos = (this.accinfolist = retdata)
              let results = queryString
                ? contractnos.filter(
                    this.createStateFilterByContractno(queryString)
                  )
                : contractnos
              results = this.arrayReuse(results)
              clearTimeout(this.timeout)
              this.timeout = setTimeout(() => {
                callback(results)
              }, 100 * Math.random())
            } else {
              this.$message({
                type: 'error',
                message: res.data.code,
              })
            }
          })
          .catch((err) => {
            callback([]) //如果搜索不到数据需要传空   才会隐藏下拉框
          })
      },
      querySearchByJgName(queryString, callback) {
        GetAccInfoList(store.getters['user/username'])
          .then((res) => {
            let retdata = res.data
            if (res.code === '200') {
              retdata.forEach((item, index) => {
                item.value = item.jgname
              })
              let jgnames = (this.accinfolist = retdata)
              let results = queryString
                ? jgnames.filter(this.createStateFilterByJgname(queryString))
                : jgnames
              results = this.arrayReuse(results)
              clearTimeout(this.timeout)
              this.timeout = setTimeout(() => {
                callback(results)
              }, 100 * Math.random())
            } else {
              this.$message({
                type: 'error',
                message: res.data.code,
              })
            }
          })
          .catch((err) => {
            callback([]) //如果搜索不到数据需要传空   才会隐藏下拉框
          })
      },
      selectHandleByJgname(item) {
        this.queryForm.payername = item.jgname
        this.queryForm.payeracc = item.jgaccount
        this.queryForm.contractno = item.contractno
        this.queryForm.orgid = item.orgid
      },
      selectHandleByJgAccount(item) {
        this.queryForm.payername = item.jgname
        this.queryForm.payeracc = item.jgaccount
        this.queryForm.contractno = item.contractno
        this.queryForm.orgid = item.orgid
      },
      selectHandleByContractno(item) {
        this.queryForm.payername = item.jgname
        this.queryForm.payeracc = item.jgaccount
        this.queryForm.contractno = item.contractno
        this.queryForm.orgid = item.orgid
      },
      arrayReuse(arr) {
        const res = new Map()
        return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
      },
      getdatepicker() {
        this.queryForm.startdate = this.date ? this.date[0] : ''
        this.queryForm.enddate = this.date ? this.date[1] : ''
      },
    },
  }
</script>
