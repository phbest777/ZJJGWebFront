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
      <el-form-item label="资金监管账号:" prop="payeracc">
        <el-autocomplete
          v-model.trim="form.payeracc"
          :trigger-on-focus="false"
          :fetch-suggestions="querySearchByJgAcc"
          placeholder="监管账号"
          prefix-icon="el-icon-search"
          clearable
          @select="selectHandleByJgAccount"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="资金监管户名:" prop="payername">
        <el-input
          v-model.trim="form.payername"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="协议编号:" prop="contractno">
        <el-input
          v-model.trim="form.contractno"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="请输入开户银行" prop="orgid">
        <el-select
          ref="optionRef"
          v-model="form.orgid"
          clearable
          placeholder="请选择开户机构"
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
      <el-form-item label="存款金额:" prop="amt">
        <el-input
          v-model.trim="form.amt"
          type="number"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="GAPS流水号:" prop="gapslsh">
        <el-input
          v-model.trim="form.gapslsh"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="交易流水号:" prop="hxlsh">
        <el-input
          v-model.trim="form.hxlsh"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="附言:" prop="addwords">
        <el-input
          v-model.trim="form.addwords"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="交易日期:" prop="datadate">
        <el-input
          v-model.trim="form.datadate"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="交易时间:" prop="datatime">
        <el-input
          v-model.trim="form.datatime"
          autocomplete="off"
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
      <el-button type="primary" @click="submitGjInfo">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  //import { doEdit } from '@/api/table'
  import { AddGjInfoByDetail, GetAccInfoList } from '@/api/xzhouse_gjinfo'
  import store from '@/store'

  export default {
    name: 'GjTableEdit',
    data() {
      return {
        form: {
          username: '',
          payername: '',
          payeracc: '',
          orgid: '',
          orgname: '',
          contractno: '',
          amt: '',
          gapslsh: '',
          hxlsh: '',
          gjacc: '',
          gjname: '',
          datadate: '',
          datatime: '',
          addwords: '',
          submitdate: '',
          submittime: '',
          agent: '',
          addmode: '',
        },
        rules: {
          payername: [
            { required: true, trigger: 'blur', message: '请输入资金监管户名' },
          ],
          payeracc: [
            { required: true, trigger: 'blur', message: '请输入资金监管账号' },
          ],
          contractno: [
            { required: true, trigger: 'blur', message: '请输入协议编号' },
          ],
          orgid: [
            { required: true, trigger: 'blur', message: '请选择开户机构' },
          ],
          amt: [{ required: true, trigger: 'blur', message: '请输入存款金额' }],
          gapslsh: [
            { required: true, trigger: 'blur', message: '请输入GAPS流水号' },
          ],
          hxlsh: [
            { required: true, trigger: 'blur', message: '请输入交易流水号' },
          ],
          datadate: [
            { required: true, trigger: 'blur', message: '请输入交易日期' },
          ],
          datatime: [
            { required: true, trigger: 'blur', message: '请输入交易时间' },
          ],
          submitdate: [
            { required: true, trigger: 'blur', message: '请输入提交日期' },
          ],
          submittime: [
            { required: true, trigger: 'blur', message: '请输入提交时间' },
          ],
        },
        title: '',
        dialogFormVisible: false,
        inputEditable: false,
        accinfolist: [],
        orgidlist: [],
        accinfo: { jgaccount: '', jgname: '', contractno: '' },
        timeout: '',
      }
    },
    created() {},
    methods: {
      showEdit(orgIdList) {
        this.title = '新增资金归集'
        this.inputEditable = true
        this.form.submitdate = this.getDate()
        this.form.submittime = this.getTime()
        this.form.datadate = this.getDate()
        this.form.datatime = this.getTime()
        this.form.addmode = '1'
        this.orgidlist = orgIdList
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      submitGjInfo() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            this.$confirm('你确定要执行该操作', '资金归集发送', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false,
              type: 'warning',
            })
              .then(async () => {
                this.form.username = store.getters['user/username']
                this.form.orgname = this.$refs.optionRef.selected.label
                const { msg } = await AddGjInfoByDetail(this.form)
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
      arrayReuse(arr) {
        const res = new Map()
        return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
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
      createStateFilterByJgAccount(queryString) {
        return (list) => {
          return list.jgaccount.indexOf(queryString) >= 0
        }
      },
      selectHandleByJgAccount(item) {
        this.form.payeracc = item.jgaccount
        this.form.payername = item.jgname
        //console.log('payername is:' + item.jgname)
        this.form.contractno = item.contractno
        this.form.orgid = item.orgid
        this.form.orgname = item.orgname
        this.form.gjacc = item.gjacc
        this.form.gjname = item.gjname
        this.form.agent = item.agent
      },
    },
    inputIsEdit() {
      this.inputEditable = !this.inputEditable
    },
  }
</script>
