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
      <el-form-item label="开发商户名:" prop="rcvname">
        <el-input
          v-model.trim="form.rcvname"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="开发商收款账号:" prop="rcvacc">
        <el-input
          v-model.trim="form.rcvacc"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="收款银行:" prop="bankname">
        <el-input
          v-model.trim="form.bankname"
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
      <el-form-item label="支付金额:" prop="amt">
        <el-input
          v-model.trim="form.amt"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="支付流水号:" prop="addwords">
        <el-input
          v-model.trim="form.addwords"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="支付接收日期:" prop="datadate">
        <el-input
          v-model.trim="form.datadate"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="支付接收时间:" prop="datatime">
        <el-input
          v-model.trim="form.datatime"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitZfInfo">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/table'
  import { UpZfInfoByDetail } from '@/api/xzhouse_zjzf'
  import store from '@/store'

  export default {
    name: 'AuthEdit',
    data() {
      return {
        form: {
          username: '',
          rcvname: '',
          rcvacc: '',
          bankname: '',
          contractno: '',
          amt: '',
          addwords: '',
          hxlsh: '',
          datadate: '',
          datatime: '',
        },
        rules: {
          rcvname: [
            { required: true, trigger: 'blur', message: '请输入开发商户名' },
          ],
          rcvacc: [
            {
              required: true,
              trigger: 'blur',
              message: '请输入开发商收款账号',
            },
          ],
          bankname: [
            { required: true, trigger: 'blur', message: '请输入收款银行' },
          ],
          contractno: [
            { required: true, trigger: 'blur', message: '请输入协议编号' },
          ],
          amt: [{ required: true, trigger: 'blur', message: '请输入存款金额' }],
          addwords: [
            { required: true, trigger: 'blur', message: '请输入支付流水号' },
          ],
          datadate: [
            { required: true, trigger: 'blur', message: '请输入交易日期' },
          ],
          datatime: [
            { required: true, trigger: 'blur', message: '请输入交易时间' },
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
        } else {
          this.inputEditable = false
          this.title = '资金支付授权发送'
          this.form = Object.assign({}, row)
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
      submitZfInfo() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            if (this.title === '资金支付授权发送') {
              this.$confirm('你确定要执行该操作', '资金支付授权发送', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                type: 'warning',
              })
                .then(async () => {
                  this.form.username = store.getters['user/username']
                  const { msg } = await UpZfInfoByDetail(this.form)
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
