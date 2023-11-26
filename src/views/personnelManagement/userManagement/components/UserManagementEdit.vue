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
      <el-form-item label="人员名称:" prop="userName">
        <el-input
          v-model.trim="form.userName"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="人员代码:" prop="userCode">
        <el-input
          v-model.trim="form.userCode"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属部门:" prop="deptName">
        <el-input
          v-model.trim="form.deptName"
          autocomplete="off"
          :disabled="!inputEditable"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属机构" prop="orgid">
        <el-select
          ref="optionRef"
          v-model="form.orgid"
          clearable
          placeholder="请选择所属机构"
          @change="$forceUpdate()"
        >
          <el-option
            v-for="item in deporgidlist"
            :key="item.id"
            :label="item.orgname"
            :value="item.orgid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属角色" prop="roleCode">
        <el-select
          ref="optionRef"
          v-model="form.roleCode"
          clearable
          placeholder="请选择角色"
          @change="$forceUpdate()"
        >
          <el-option
            v-for="item in subrolelist"
            :key="item.id"
            :label="item.roleName"
            :value="item.roleCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Notes:" prop="userEmail">
        <el-input v-model.trim="form.userEmail" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="更新日期:" prop="submitdate">
        <el-input
          v-model.trim="form.submitdate"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="更新时间:" prop="submittime">
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
  import { doEdit } from '@/api/table'
  import { UpdateUserinfoList } from '@/api/xzhouse_users'
  import store from '@/store'

  export default {
    name: 'UserManagementEdit',
    data() {
      return {
        form: {
          username: '',
          userName: '',
          userCode: '',
          orgid: '',
          orgname: '',
          userDeptcode: '',
          deptName: '',
          userEmail: '',
          roleCode: '',
          roleName: '',
          editmode: '',
          submitdate: '',
          submittime: '',
        },
        rules: {
          userName: [
            { required: true, trigger: 'blur', message: '请输入用户名' },
          ],
          userCode: [
            { required: true, trigger: 'blur', message: '请输入用户代码' },
          ],
          orgid: [{ required: true, trigger: 'blur', message: '请输入机构号' }],
          orgname: [
            { required: true, trigger: 'blur', message: '请输入机构名称' },
          ],
          userDeptcode: [
            { required: true, trigger: 'blur', message: '请输入部门号' },
          ],
          deptName: [
            { required: true, trigger: 'blur', message: '请输入部门名称' },
          ],
          roleCode: [
            { required: true, trigger: 'blur', message: '请选择角色' },
          ],
          roleName: [
            { required: true, trigger: 'blur', message: '请选择角色' },
          ],
          submitdate: [
            { required: true, trigger: 'blur', message: '更新日期' },
          ],
          submittime: [
            { required: true, trigger: 'blur', message: '更新时间' },
          ],
        },
        title: '',
        dialogFormVisible: false,
        inputEditable: false,
        deporgidlist: [],
        subrolelist: [],
      }
    },
    created() {},
    methods: {
      showEdit(row, deporgidlist, subrolelist) {
        if (!row) {
          this.title = '添加'
          this.inputEditable = true
          this.form.submitdate = this.getDate()
          this.form.submittime = this.getTime()
        } else {
          this.inputEditable = false
          this.title = '资金归集发送'
          this.form = Object.assign({}, row)
          this.subrolelist = subrolelist
          this.deporgidlist = deporgidlist
          console.log('subrolelist is ' + this.subrolelist[0].roleName)
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
      submitGjInfo() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            if (this.title === '资金归集发送') {
              this.$confirm('你确定要执行该操作', '资金归集发送', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                type: 'warning',
              })
                .then(async () => {
                  this.form.username = store.getters['user/username']
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
