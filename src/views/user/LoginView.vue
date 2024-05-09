<template>
  <div>
    <h1 id="title">欢迎使用L医院挂号预约系统</h1>


    <div class="loginBox">
      <el-form ref="myForm" :model="formData" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="formData.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button @click="register">注册账号</el-button>
          &nbsp;<router-link to="/register" id="forget">忘记密码？</router-link>
        </el-form-item>
      </el-form>

    </div>
  </div>

</template>

<script>
import { request } from '@/network/gateway';

export default {
  data() {
    return {
      formData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit() {
      // let data={
      //   'username':this.formData.username,
      //   'password':this.formData.password
      // }
      request({
        url:'/user/login',
        method:'post',
        data:this.formData
      }).then(res => {
        if (res.data.code == 200) {
          var userInfo = res.data.data;
          this.$store.commit('setId',userInfo.id)
          this.$store.commit('setToken', userInfo.token)
          this.$store.commit('setUsername',userInfo.username)
          this.$store.commit('setAvatar',userInfo.avatar)
          this.$router.push('/home')
          this.$message({
            message: '登录成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    register() {
      this.$router.push('/register');
    }
  }
}
</script>

<style scoped>
.loginBox {
  position: absolute;
  right: 10%;
  bottom: 20%;
  width: 400px;
  height: 200px;
}

#forget {
  text-decoration: none;
  color: black;

}

#title {
  color: cornflowerblue;
  text-align: center;
}

</style>