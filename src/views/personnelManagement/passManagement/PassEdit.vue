<template>
  <div class="form-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户代码" prop="userCode">
            <el-input v-model="ruleForm.userCode" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="用户名称" prop="userName">
            <el-input v-model="ruleForm.userName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="原密码" prop="oriPass">
            <el-input v-model="ruleForm.oriPass" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPass">
            <el-input
              v-model="ruleForm.newPass"
              :disabled="!inputEditable"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPass">
            <el-input
              v-model="ruleForm.confirmPass"
              :disabled="!inputEditable"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="是否修改" prop="delivery">
            <el-switch
              v-model="ruleForm.delivery"
              @change="switchStatus()"
            ></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">
              立即更改
            </el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { GetUserinfo, UpdateUserPass } from '@/api/xzhouse_users'
  import store from '@/store'

  export default {
    name: 'PassEdit',
    data() {
      return {
        ruleForm: {
          userCode: '',
          userName: '',
          delivery: false,
          oriPass: '',
          newPass: '',
          confirmPass: '',
        },
        rules: {
          newPass: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            {
              min: 6,
              message: '长度大于6 个字符',
              trigger: 'blur',
            },
          ],
          confirmPass: [
            {
              required: true,
              message: '确认密码，两次密码必须一致',
              trigger: 'blur',
            },
            {
              min: 6,
              message: '长度大于6 个字符',
              trigger: 'blur',
            },
            {
              validator: (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请再一次输入密码'))
                } else if (value !== this.ruleForm.newPass) {
                  callback(new Error('两次密码不一致'))
                } else {
                  callback()
                }
              },
              trigger: 'blur',
            },
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' },
          ],
          type: [
            {
              type: 'array',
              required: true,
              message: '请至少选择一个活动性质',
              trigger: 'change',
            },
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' },
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' },
          ],
        },
        //inputEditable: this.ruleForm.delivery,
        inputEditable: false,
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.$confirm('你确定要执行该操作', '密码修改', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false,
              type: 'warning',
            })
              .then(async () => {
                const { msg } = await UpdateUserPass(this.ruleForm)
                this.$baseMessage(msg, 'success')
                this.dialogFormVisible = false
                this.fetchData()
              })
              .catch(() => {
                this.dialogFormVisible = false
              })
          } else {
            return false
          }
        })
      },
      resetForm(formName) {
        //this.$refs[formName].resetFields()
        this.ruleForm.newPass = ''
        this.ruleForm.confirmPass = ''
        //this.ruleForm.delivery = false
        //this.inputEditable = false
      },
      switchStatus() {
        this.inputEditable = this.ruleForm.delivery
      },
      async fetchData() {
        this.listLoading = true
        const { data, code } = await GetUserinfo(store.getters['user/username'])
        console.log('data is:' + data.userName)
        //console.log('usernamesss is:' + store.getters['user/username'])

        if (code !== '200') {
        } else {
          this.ruleForm.userCode = data.userCode
          this.ruleForm.userName = data.userName
          this.ruleForm.oriPass = data.userPass
          this.ruleForm.newPass = ''
          this.ruleForm.confirmPass = ''
          this.ruleForm.delivery = false
          this.inputEditable = false
        }
        //console.log(data)
        setTimeout(() => {
          this.listLoading = false
          //this.listLoading.close()
        }, 500)
      },
    },
  }
</script>
