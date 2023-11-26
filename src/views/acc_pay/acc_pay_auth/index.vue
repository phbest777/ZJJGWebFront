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
          <!--<el-form-item>
            <el-input
              v-model="queryForm.pyaername"
              placeholder="开发商"
              clearable
              prefix-icon="el-icon-search"
            />
          </el-form-item>-->
          <el-form-item>
            <el-autocomplete
              v-model.trim="queryForm.rcvname"
              :trigger-on-focus="false"
              :fetch-suggestions="querySearchByRcvName"
              placeholder="开发商"
              prefix-icon="el-icon-search"
              clearable
              @select="selectHandleByRcvname"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-autocomplete
              v-model.trim="queryForm.rcvacc"
              :trigger-on-focus="false"
              :fetch-suggestions="querySearchByRcvAcc"
              placeholder="收款账号"
              prefix-icon="el-icon-search"
              clearable
              @select="selectHandleByRcvAccount"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="queryForm.amt"
              type="number"
              placeholder="支付金额"
              clearable
              prefix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyyMMdd"
              @change="getdatepicker"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="queryForm.iszf"
              clearable
              placeholder="支付状态"
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
        <el-button
          v-if="checkPermission(['00002', '00001'])"
          icon="el-icon-delete"
          type="danger"
          @click="handleDelete"
        >
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
      <el-table-column show-overflow-tooltip label="序号" width="70" fixed>
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="开发商"
        prop="rcvname"
        width="250"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="rcvacc"
        label="收款账号"
        width="160"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="bankname"
        label="收款银行"
        width="150"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="协议编号"
        prop="contractno"
        width="130"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="支付金额"
        prop="amt"
        width="100"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="支付流水号"
        prop="addwords"
        width="120"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="核心流水号"
        prop="hxlsh"
        width="120"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="支付接收日期"
        prop="datadate"
        width="90"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="支付到账日期"
        prop="hxtransdate"
        width="90"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="支付状态"
        prop="iszf"
        width="100"
        :formatter="stateFormat"
      >
        <template #default="{ row }">
          <el-tag :type="row.iszf | statusFilter">
            {{ row.iszf | statusForm }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="操作"
        width="70px"
        fixed="right"
      >
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">执行</el-button>
        </template>
      </el-table-column>
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
    <zf-table-edit ref="edit-add" @refresh-data="fetchData"></zf-table-edit>
    <auth-edit ref="edit-show" @refresh-data="fetchData"></auth-edit>
  </div>
</template>

<script>
  import {
    GetRcvAccinfoList,
    GetZfTransListByAll,
    GetZfTransListByMultiChoose,
  } from '@/api/xzhouse_zjzf'
  import AuthEdit from './components/AuthEdit'
  import ZfTableEdit from './components/ZfTableEdit'
  import store from '@/store'
  import checkPermission from '@/utils/permission'
  import websocket from '@/utils/websocket'
  export default {
    name: 'ComprehensiveTable',
    components: {
      ZfTableEdit,
      AuthEdit,
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          9: 'success',
          0: 'danger',
          //deleted: 'danger',
        }
        return statusMap[status]
      },
      statusForm(status) {
        const statusMap = {
          9: '已到账',
          5: '已授权',
          0: '未授权',
          //deleted: 'danger',
        }
        return statusMap[status]
      },
    },
    mixins: [websocket],
    data() {
      return {
        wsdata: '',
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
          pageSize: 10,
          rcvacc: '',
          rcvname: '',
          amt: '',
          startdate: '',
          enddate: '',
          iszf: '',
          querymode: '',
        },
        options: [
          {
            value: '2',
            label: '全部',
          },
          {
            value: '0',
            label: '未授权',
          },
          {
            value: '5',
            label: '已授权',
          },
          {
            value: '9',
            label: '已支付',
          },
        ],
        date: [],
        orgidlist: [],
        accinfolist: [],
        accinfo: { rcvacc: '', rcvname: '', contractno: '' },
        timeout: '',
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    created() {
      //this.wsdata = websocket.data().msg
      this.fetchData()
    },
    beforeDestroy() {},
    mounted() {
      //this.fetchData()
    },
    methods: {
      checkPermission,
      handleWebsocketMessage(event) {
        if (event.data === '1') {
          this.wsdata = 'data is updated'
          this.fetchData()
        }
      },
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
        this.queryForm.querymode = '0'
        if (
          this.queryForm.rcvacc === '' &&
          this.queryForm.rcvname === '' &&
          this.queryForm.startdate === '' &&
          this.queryForm.enddate === '' &&
          this.queryForm.amt === '' &&
          (this.queryForm.iszf === '' || this.queryForm.iszf === '2')
        ) {
          const { data, totalCount, code } = await GetZfTransListByAll(
            store.getters['user/username'],
            this.queryForm.querymode,
            this.queryForm.pageNo,
            this.queryForm.pageSize
          )
          //console.log('date is:' + date)
          //console.log('usernamesss is:' + store.getters['user/username'])

          if (code !== '200') {
            this.list = null
          } else {
            this.list = data
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
            const { data, totalCount, code } =
              await GetZfTransListByMultiChoose(
                store.getters['user/username'],
                this.queryForm.rcvname,
                this.queryForm.rcvacc,
                this.queryForm.amt,
                this.queryForm.iszf,
                this.queryForm.startdate,
                this.queryForm.enddate,
                this.queryForm.querymode,
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
      createStateFilterByRcvname(queryString) {
        return (list) => {
          return list.rcvname.indexOf(queryString) >= 0
        }
      },

      createStateFilterByRcvAccount(queryString) {
        return (list) => {
          return list.rcvacc.indexOf(queryString) >= 0
        }
      },
      querySearchByRcvAcc(queryString, callback) {
        GetRcvAccinfoList(store.getters['user/username'])
          .then((res) => {
            let retdata = res.data
            if (res.code === '200') {
              retdata.forEach((item, index) => {
                item.value = item.rcvacc
              })
              let rcvaccounts = (this.accinfolist = retdata)
              let results = queryString
                ? rcvaccounts.filter(
                    this.createStateFilterByRcvAccount(queryString)
                  )
                : rcvaccounts
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
      querySearchByRcvName(queryString, callback) {
        GetRcvAccinfoList(store.getters['user/username'])
          .then((res) => {
            let retdata = res.data
            if (res.code === '200') {
              retdata.forEach((item, index) => {
                item.value = item.rcvname
              })
              let rcvnames = (this.accinfolist = retdata)
              let results = queryString
                ? rcvnames.filter(this.createStateFilterByRcvname(queryString))
                : rcvnames
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
      selectHandleByRcvname(item) {
        this.queryForm.rcvname = item.rcvname
      },
      selectHandleByRcvAccount(item) {
        this.queryForm.rcvacc = item.rcvacc
      },
      arrayReuse(arr) {
        const res = new Map()
        return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
      },
      stateFormat(row) {
        if (row.iszf === '0') {
          return '未授权'
        } else if (row.iszf === '5') {
          return '已授权'
        } else if (row.iszf === '9') {
          return '已到账'
        }
      },
      getdatepicker() {
        this.queryForm.startdate = this.date ? this.date[0] : ''
        this.queryForm.enddate = this.date ? this.date[1] : ''
      },
    },
  }
</script>
