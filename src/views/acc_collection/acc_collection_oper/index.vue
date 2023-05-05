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
          <el-autocomplete
            v-model.trim="accinfo.jgname"
            :trigger-on-focus="false"
            :fetch-suggestions="querySearch"
            placeholder="开发商"
            prefix-icon="el-icon-search"
            @select="handleSelect"
          ></el-autocomplete>
          <el-form-item>
            <el-input
              v-model="queryForm.payeracc"
              placeholder="监管账号"
              clearable
              prefix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="queryForm.contractno"
              placeholder="协议编号"
              clearable
              prefix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="queryForm.amt"
              placeholder="归集金额"
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
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="queryForm.isgj"
              clearable
              placeholder="归集状态"
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
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
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
      <el-table-column show-overflow-tooltip label="序号" width="95">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="payeracc"
        label="监管账号"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="开发商"
        prop="payername"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="协议编号"
        prop="contractno"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="归集金额"
        prop="amt"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="机构号"
        prop="orgid"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="机构名称"
        prop="orgname"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="归集日期"
        prop="datadate"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="归集状态"
        prop="isgj"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="180px">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
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
    <table-edit ref="edit" @refresh-data="fetchData"></table-edit>
  </div>
</template>

<script>
  import {
    doDelete,
    GetGjinfoList,
    GetGjinfoListByChoose,
    GetAccInfoList,
  } from '@/api/table'
  import TableEdit from './components/TableEdit'
  import store from '@/store'
  export default {
    name: 'ComprehensiveTable',
    components: {
      TableEdit,
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger',
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
          pyaername: '',
          contractno: '',
          amt: '',
          orgid: '',
          orgname: '',
          startdate: '',
          enddate: '',
          isgj: '',
        },
        options: [
          {
            value: '2',
            label: '全部',
          },
          {
            value: '0',
            label: '未归集',
          },
          {
            value: '1',
            label: '已归集',
          },
        ],
        date: [],
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
    mounted() {},
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
      handleAdd() {
        this.$refs['edit'].showEdit()
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
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
        if (
          this.queryForm.payeracc === '' &&
          this.queryForm.contractno === '' &&
          this.queryForm.datadate === '' &&
          (this.queryForm.isgj === '' || this.queryForm.isgj === '2')
        ) {
          const { data, totalCount, code } = await GetGjinfoList(
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
          }, 500)
        } else {
          this.queryForm.startdate = this.date == null ? '' : this.date[0]
          this.queryForm.enddate = this.date == null ? '' : this.date[1]
          const { data, totalCount, code } = await GetGjinfoListByChoose(
            store.getters['user/username'],
            this.queryForm.pyaername,
            this.queryForm.payeracc,
            this.queryForm.contractno,
            this.queryForm.amt,
            this.queryForm.startdate,
            this.queryForm.enddate,
            this.queryForm.isgj,
            this.queryForm.pageNo,
            this.queryForm.pageSize
          )
          if (code === '200') {
            this.list = data
          } else {
            this.list = null
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
          }, 500)
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
    },

    createStateFilter(queryString) {
      return (list) => {
        return list.name.indexOf(queryString) >= 0
      }
    },
    querySearch(queryString, callback) {
      if (this.accinfo.jgname) {
        GetAccInfoList(store.getters['user/username'])
          .then((res) => {
            let retdata = res.data.data
            if (res.data.code === '200') {
              retdata.rows.forEach((item, index) => {
                item.value = item.jgname
              })
              let jgnames = (this.accinfolist = data.rows)
              let results = queryString
                ? jgnames.filter(this.createStateFilter(queryString))
                : jgnames
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
      }
    },
  }
</script>
