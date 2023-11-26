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
      <el-form-item label="账户名称:" prop="zhmc">
        <el-input
          v-model.trim="form.zhmc"
          autocomplete="off"
          clearable
          placeholder="请输入账户名称"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="企业名称:" prop="corpname">
        <el-input
          v-model.trim="form.corpname"
          autocomplete="off"
          clearable
          placeholder="请输入企业名称"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="监管账户:" prop="jgaccount">
        <el-input
          v-model.trim="form.jgaccount"
          autocomplete="off"
          clearable
          placeholder="请输入监管开户账号"
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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitJgAccInfo">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  //import { doEdit } from '@/api/table'
  import { GetAccInfoList } from '@/api/xzhouse_gjinfo'
  import { AddJgAccinfoByDetail } from '@/api/xzhouse_accinfo'
  import store from '@/store'

  export default {
    name: 'AccAdd',
    props: {
      parentdata1: {
        type: String,
        default: '',
      },
    },
    //props: ['parentdata'],
    data() {
      return {
        form: {
          username: '',
          orgid: '',
          orgname: '',
          zhmc: '',
          corpname: '',
          jgaccount: '',
        },
        rules: {
          zhmc: [
            { required: true, trigger: 'blur', message: '请输入账户名称' },
          ],
          corpname: [
            { required: true, trigger: 'blur', message: '请输入企业名称' },
          ],
          jgaccount: [
            { required: true, trigger: 'blur', message: '请输入开户账号' },
          ],
          orgid: [
            { required: true, trigger: 'blur', message: '请输入开户机构' },
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
        orgidlist: [],
        title: '',
        dialogFormVisible: false,
        inputEditable: false,
        timeout: '',
      }
    },
    created() {},
    methods: {
      showEdit(orgIdList) {
        this.title = '新增账户开户'
        this.inputEditable = true
        this.orgidlist = orgIdList
        this.dialogFormVisible = true
      },
      getOrgidList(tmp) {
        console.log('second tmp is' + tmp)
        this.temp = tmp
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      submitJgAccInfo() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            this.$confirm('你确定要执行该操作', '账户开户发送', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false,
              type: 'warning',
            })
              .then(async () => {
                this.form.username = store.getters['user/username']
                this.form.orgname = this.$refs.optionRef.selected.label
                const { msg } = await AddJgAccinfoByDetail(this.form)
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
    },
    inputIsEdit() {
      this.inputEditable = !this.inputEditable
    },
  }
</script>
