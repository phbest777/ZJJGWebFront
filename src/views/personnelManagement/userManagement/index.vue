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
              v-model.trim="queryForm.username"
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
              v-model.trim="queryForm.usercode"
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
          v-if="checkPermission(['001', '002', '003', '004'])"
          icon="el-icon-plus"
          type="primary"
          @click="handleAdd"
        >
          添加
        </el-button>
        <el-button
          v-if="checkPermission(['001', '002', '003', '004'])"
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
      <el-table-column show-overflow-tooltip label="序号" width="50" fixed>
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="userName"
        label="人员名称"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="人员代码"
        prop="userCode"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="所属机构"
        prop="orgname"
        sortable
      ></el-table-column>
      <el-table-column
        v-if="false"
        show-overflow-tooltip
        label="所属机构号"
        prop="orgid"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="所属部门"
        prop="deptName"
        sortable
      ></el-table-column>
      <el-table-column
        v-if="false"
        show-overflow-tooltip
        label="所属部门号"
        prop="userDeptcode"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="Notes"
        prop="userEmail"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="角色"
        prop="roleName"
        sortable
      ></el-table-column>
      <el-table-column
        v-if="false"
        show-overflow-tooltip
        label="角色代码"
        prop="roleCode"
        sortable
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" fixed="right">
        <template #default="{ row }">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(row, orgidlist, subrolelist)"
          >
            编辑
          </el-button>
          <el-button
            v-if="checkPermission(['001', '002', '003', '004'])"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
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
    <user-management-edit
      ref="edit-show"
      @refresh-data="fetchData"
    ></user-management-edit>
  </div>
</template>

<script>
  import { GetAccInfoList } from '@/api/xzhouse_gjinfo'
  import { GetUserinfoList } from '@/api/xzhouse_users'
  import UserManagementEdit from './components/UserManagementEdit'
  //import GjTableEdit from './components/GjTableEdit'
  import store from '@/store'
  import checkPermission from '@/utils/permission'
  export default {
    name: 'ComprehensiveTable',
    components: {
      UserManagementEdit,
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
          1: '已记账',
          0: 'POS未记账',
          2: '贷款未记账',
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
          username: '',
          usercode: '',
          deptid: '',
          deptname: '',
          orgid: '',
          orgname: '',
        },
        options: [
          {
            value: '3',
            label: '全部',
          },
          {
            value: '0',
            label: 'POS未记账',
          },
          {
            value: '2',
            label: '贷款未记账',
          },
          {
            value: '1',
            label: '已记账',
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
        date: [],
        orgidlist: [],
        subrolelist: [],
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
      checkPermission,
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
      handleAdd() {
        this.$refs['edit-add'].showEdit()
      },
      handleEdit(row, DepOrgidlist, SubRoleList) {
        this.$refs['edit-show'].showEdit(row, DepOrgidlist, SubRoleList)
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
          this.queryForm.username === '' &&
          this.queryForm.usercode === '' &&
          this.queryForm.deptid === '' &&
          this.queryForm.deptname === '' &&
          this.queryForm.orgid === '' &&
          this.queryForm.orgname === ''
        ) {
          try {
            const { data, totalCount, code, orgidlist, subrolelist } =
              await GetUserinfoList(
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
              this.subrolelist = subrolelist
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
          } catch (e) {
            this.list = null
            this.listLoading = false
          }
        } else {
          try {
            const { data, totalCount, code } = await GetJzinfoListByChoose(
              store.getters['user/username'],
              this.queryForm.payername,
              this.queryForm.payeracc,
              this.queryForm.contractno,
              this.queryForm.recordno,
              this.queryForm.ckr,
              this.queryForm.price,
              this.queryForm.flag,
              this.queryForm.startdate,
              this.queryForm.enddate,
              this.queryForm.isjz,
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
      },
      selectHandleByJgAccount(item) {
        this.queryForm.payeracc = item.jgaccount
      },
      selectHandleByContractno(item) {
        this.queryForm.contractno = item.contractno
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
