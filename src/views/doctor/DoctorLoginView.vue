<template>
    <div>
      <h1 id="title">欢迎使用L医院挂号预约系统-医生端</h1>
      <div class="loginBox">
        <el-form ref="myForm" :model="formData" label-width="100px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formData.name"></el-input>
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
  import { request } from '@/network/gateway';
  
  export default {
    data() {
      return {
        formData: {
          name: '',
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
          url:'/doctor/login',
          method:'post',
          data:this.formData
        }).then(res => {
          if (res.data.code == 200) {
            var userInfo = res.data.data;
            this.$store.commit('setDocId',userInfo.id)
            this.$store.commit('setToken', userInfo.token)
            this.$store.commit('setUsername',userInfo.name)
            this.$store.commit('setAvatar',userInfo.img)
            this.$router.push('/doctor')
            this.$message({
              message: '登录成功',
              type: 'success'
            })
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