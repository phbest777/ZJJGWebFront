<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      width="500px"
      label-width="150px"
    >
      <el-form-item label="商户号:" prop="agent">
        <el-input
          v-model.trim="form.agent"
          autocomplete="off"
          clearable
          placeholder="商户号,贷款资金填写开发商监管资金账号"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="卡号:" prop="cardno">
        <el-input
          v-model.trim="form.cardno"
          autocomplete="off"
          clearable
          placeholder="卡号,贷款资金填写银行贷款账号"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="协议编号:" prop="xybh">
        <el-autocomplete
          v-model.trim="form.xybh"
          :trigger-on-focus="false"
          :fetch-suggestions="querySearchByContractno"
          placeholder="协议编号"
          prefix-icon="el-icon-search"
          clearable
          @select="selectHandleByContractno"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="合同编号:" prop="recordno">
        <el-input
          v-model.trim="form.recordno"
          autocomplete="off"
          clearable
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="存款人:" prop="ckr">
        <el-input
          v-model.trim="form.ckr"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="记账金额:" prop="price">
        <el-input
          v-model.trim="form.price"
          type="number"
          autocomplete="off"
          clearable
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="操作员编号:" prop="operator">
        <el-input
          v-model.trim="form.operator"
          autocomplete="off"
          clearable
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="资金性质:" prop="zjxz">
        <el-select
          v-model="form.zjxz"
          clearable
          placeholder="资金性质"
          @change="$forceUpdate()"
        >
          <el-option
            v-for="item in options_zjxz"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资金标识:" prop="flag">
        <el-select
          v-model="form.flag"
          clearable
          placeholder="资金标识"
          @change="$forceUpdate()"
        >
          <el-option
            v-for="item in options_flag"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资金来源" prop="cklb">
        <el-select
          v-model="form.cklb"
          clearable
          placeholder="资金来源"
          @change="$forceUpdate()"
        >
          <el-option
            v-for="item in options_cklb"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="存款流水号:" prop="cklsh">
        <el-input
          v-model.trim="form.cklsh"
          autocomplete="off"
          clearable
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="交易日期:" prop="transdate">
        <el-input
          v-model.trim="form.transdate"
          autocomplete="off"
          clearable
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="提交日期:" prop="submitdate">
        <el-input
          v-model.trim="form.submitdate"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="提交时间:" prop="submittime">
        <el-input
          v-model.trim="form.submittime"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitJzInfo">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  //import { doEdit } from '@/api/table'
  import { GetAccInfoList } from '@/api/xzhouse_gjinfo'
  import { AddJzInfoNewByDetail } from '@/api/xzhouse_jzinfo'
  import store from '@/store'

  export default {
    name: 'JzTableAddNew',
    data() {
      return {
        form: {
          username: '',
          agent: '',
          cardno: '',
          xybh: '',
          recordno: '',
          ckr: '',
          price: '',
          operator: '',
          zjxz: '',
          flag: '',
          cklsh: '',
          cklb: '',
          isjz: '',
          transdate: '',
          submitdate: '',
          submittime: '',
          addmode: '',
          accinfolist: [],
          accinfo: { jgaccount: '', jgname: '', contractno: '' },
          timeout: '',
        },
        rules: {
          agent: [{ required: true, trigger: 'blur', message: '请输入商户号' }],
          cardno: [{ required: true, trigger: 'blur', message: '请输入卡号' }],
          xybh: [
            { required: true, trigger: 'blur', message: '请输入协议编号' },
          ],
          recordno: [
            { required: true, trigger: 'blur', message: '请输入合同编号' },
          ],
          ckr: [{ required: true, trigger: 'blur', message: '请输入存款人' }],
          price: [
            { required: true, trigger: 'blur', message: '请输入记账金额' },
          ],
          operator: [
            { required: true, trigger: 'blur', message: '请输入操作员编号' },
          ],
          zjxz: [
            { required: true, trigger: 'blur', message: '请输入资金性质' },
          ],
          flag: [
            { required: true, trigger: 'blur', message: '请输入记账标识' },
          ],
          cklb: [
            { required: true, trigger: 'blur', message: '请输入资金来源' },
          ],
          cklsh: [
            { required: true, trigger: 'blur', message: '请输入存款流水号' },
          ],
          transdate: [
            { required: true, trigger: 'blur', message: '请输入交易日期' },
          ],
          submitdate: [
            { required: true, trigger: 'blur', message: '请输入提交日期' },
          ],
          submittime: [
            { required: true, trigger: 'blur', message: '请输入提交时间' },
          ],
        },
        options_zjxz: [
          {
            value: '0',
            label: '消费',
          },
          {
            value: '1',
            label: '贷款',
          },
        ],
        options_flag: [
          {
            value: '2',
            label: '专用POS',
          },
          {
            value: '0',
            label: '银行贷款',
          },
          {
            value: '1',
            label: '开发商',
          },
        ],

        options_cklb: [
          {
            value: '1',
            label: '用户存款',
          },
          {
            value: '2',
            label: '商业贷款',
          },
          {
            value: '3',
            label: '公积金贷款',
          },
          {
            value: '4',
            label: '调账补款',
          },
        ],
        title: '',
        dialogFormVisible: false,
        inputEditable: false,
        timeout: '',
      }
    },
    created() {},
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '新增资金记账'
          this.inputEditable = true
          this.form.submitdate = this.getDate()
          this.form.submittime = this.getTime()
          this.form.transdate = this.getDate()
          this.form.operator = '9880800'
          this.form.addmode = '1'
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      submitJzInfo() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            this.$confirm('你确定要执行该操作', '资金记账发送', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false,
              type: 'warning',
            })
              .then(async () => {
                this.form.username = store.getters['user/username']
                const { msg } = await AddJzInfoNewByDetail(this.form)
                this.$baseMessage(msg, 'success')
                this.$refs['form'].resetFields()
                this.dialogFormVisible = false
                this.$emit('refresh-data')
                this.form = this.$options.data().form
              })
              .catch(() => {
                this.dialogFormVisible = false
              })
          } else {
            return false
          }
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
      createStateFilterByContractno(queryString) {
        return (list) => {
          return list.contractno.indexOf(queryString) >= 0
        }
      },
      selectHandleByContractno(item) {
        this.form.xybh = item.contractno
      },
      arrayReuse(arr) {
        const res = new Map()
        return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
      },
      getDate() {
        const nowDate = new Date()
        const date = {
          year: nowDate.getFullYear(),
          month: nowDate.getMonth() + 1,
          date: nowDate.getDate(),
        }
        const newmonth = date.month >= 10 ? date.month : '0' + date.month
        const day = date.date >= 10 ? date.date : '0' + date.date
        return date.year + newmonth + day
      },
      getTime() {
        let hh =
          new Date().getHours() < 10
            ? '0' + new Date().getHours()
            : new Date().getHours()
        let mf =
          new Date().getMinutes() < 10
            ? '0' + new Date().getMinutes()
            : new Date().getMinutes()
        let ss =
          new Date().getSeconds() < 10
            ? '0' + new Date().getSeconds()
            : new Date().getSeconds()
        let currentTime = hh.toString() + mf.toString() + ss.toString()
        //let currentTime = hh + mf + ss
        return currentTime
      },
    },
    inputIsEdit() {
      this.inputEditable = !this.inputEditable
    },
  }
</script>
