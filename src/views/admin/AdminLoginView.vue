<template>
    <div>
      <h1 id="title">欢迎使用L医院后台管理系统</h1>
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
          </el-form-item>
        </el-form>
  
      </div>
    </div>
  
  </template>
  
  <script>
  import { adminRequest } from '@/network/gateway';
import store from '@/store';
  
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
        adminRequest({
          url:'/admin/login',
          method:'post',
          data:this.formData
        }).then(res => {
          if (res.data.code == 200) {
            var userInfo = res.data.data;
            this.$store.commit('setToken', userInfo);
            this.$store.state.username=userInfo.username
            this.$message({
              message: '登录成功',
              type: 'success'
            }),
            this.$router.push('/admin')
          } else {
            this.$message.error(res.data.msg)
          }
        })
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