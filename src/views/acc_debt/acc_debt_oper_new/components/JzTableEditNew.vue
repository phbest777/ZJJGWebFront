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
      <el-form-item label="资金监管户名:" prop="jgname">
        <el-input
          v-model.trim="form.jgname"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="资金监管账号:" prop="jgaccount">
        <el-input
          v-model.trim="form.jgaccount"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="协议编号:" prop="xybh">
        <el-input
          v-model.trim="form.xybh"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="合同号:" prop="recordno">
        <el-input v-model.trim="form.recordno" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="存款人:" prop="ckr">
        <el-input v-model.trim="form.ckr" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="机构号:" prop="orgid">
        <el-input
          v-model.trim="form.orgid"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="机构名称:" prop="orgname">
        <el-input
          v-model.trim="form.orgname"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="记账金额:" prop="price">
        <el-input
          v-model.trim="form.price"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="交易流水号:" prop="cklsh">
        <el-input
          v-model.trim="form.cklsh"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="交易日期:" prop="transdate">
        <el-input
          v-model.trim="form.transdate"
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
      <el-button type="primary" @click="submitJzInfo">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/table'
  import store from '@/store'
  import { AddJzInfoNewByDetail } from '@/api/xzhouse_jzinfo'

  export default {
    name: 'JzTableEditOld',
    data() {
      return {
        form: {
          username: '',
          jgname: '',
          jgaccount: '',
          xybh: '',
          recordno: '',
          ckr: '',
          operator: '',
          flag: '',
          cklb: '',
          cklsh: '',
          orgid: '',
          orgname: '',
          price: '',
          zjxz: '',
          transdate: '',
          submitdate: '',
          submittime: '',
          addmode: '',
        },
        rules: {
          jgname: [
            { required: true, trigger: 'blur', message: '请输入资金监管户名' },
          ],
          jgaccount: [
            { required: true, trigger: 'blur', message: '请输入资金监管账号' },
          ],
          xybh: [
            { required: true, trigger: 'blur', message: '请输入协议编号' },
          ],
          recordno: [
            { required: true, trigger: 'blur', message: '请输入合同编号' },
          ],
          ckr: [{ required: true, trigger: 'blur', message: '请输入存款人' }],
          orgid: [{ required: true, trigger: 'blur', message: '请输入机构号' }],
          orgname: [
            { required: true, trigger: 'blur', message: '请输入机构名称' },
          ],
          amt: [{ required: true, trigger: 'blur', message: '请输入存款金额' }],
          cklsh: [
            { required: true, trigger: 'blur', message: '请输入交易流水号' },
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
        title: '',
        dialogFormVisible: false,
        inputEditable: false,
      }
    },
    created() {},
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
          this.inputEditable = true
          this.form.submitdate = this.getDate()
          this.form.submittime = this.getTime()
        } else {
          this.inputEditable = false
          this.title = '资金记账发送'
          this.form = Object.assign({}, row)
          this.form.submitdate = this.getDate()
          this.form.submittime = this.getTime()
          this.form.addmode = '0'
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { msg } = await doEdit(this.form)
            this.$baseMessage(msg, 'success')
            this.$refs['form'].resetFields()
            this.dialogFormVisible = false
            this.$emit('fetch-data')
            this.form = this.$options.data().form
          } else {
            return false
          }
        })
      },
      submitJzInfo() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            if (this.title === '资金记账发送') {
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
              const { msg } = await UpdateEmp(this.form)
              this.$baseMessage(msg, 'success')
              this.$refs['form'].resetFields()
              this.dialogFormVisible = false
              this.$emit('refresh-data')
              this.form = this.$options.data().form
            }
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
    },
    inputIsEdit() {
      this.inputEditable = !this.inputEditable
    },
  }
</script>
