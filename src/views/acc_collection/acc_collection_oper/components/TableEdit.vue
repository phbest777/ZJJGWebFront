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
      label-width="100px"
    >
      <el-form-item label="资金监管户名:" prop="payername">
        <el-input
          v-model.trim="form.payername"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="资金监管账号:" prop="payeracc">
        <el-input
          v-model.trim="form.payeracc"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="机构号:" prop="orgid">
        <el-input
          v-model.trim="form.orgid"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="机构名称:" prop="orgname">
        <el-input
          v-model.trim="form.orgname"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="存款金额:" prop="amt">
        <el-input
          v-model.trim="form.amt"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="交易流水号:" prop="hxlsh">
        <el-input
          v-model.trim="form.hxlsh"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="交易日期:" prop="datadate">
        <el-input
          v-model.trim="form.datadate"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="交易时间:" prop="datatime">
        <el-input
          v-model.trim="form.datatime"
          autocomplete="off"
          disabled
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
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/table'

  export default {
    name: 'TableEdit',
    data() {
      return {
        form: {
          payername: '',
          payeracc: '',
          orgid: '',
          orgname: '',
          amt: '',
          hxlsh: '',
          datadate: '',
          datatime: '',
          submitdate: '',
          submittime: '',
        },
        rules: {
          title: [{ required: true, trigger: 'blur', message: '请输入标题' }],
          author: [{ required: true, trigger: 'blur', message: '请输入作者' }],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '资金归集发送'
          this.form = Object.assign({}, row)
          this.form.submitdate = this.getDate()
          this.form.submittime = this.getTime()
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
      submitGjInfo() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            if (this.title == '资金归集发送') {
              const { msg } = await SaveEmp(this.form)
              this.$baseMessage(msg, 'success')
              this.$refs['form'].resetFields()
              this.dialogFormVisible = false
              this.$emit('refresh-data')
              this.form = this.$options.data().form
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
        let hh = new Date().getHours()
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
  }
</script>
