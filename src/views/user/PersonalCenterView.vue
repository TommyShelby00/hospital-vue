<template>
  <div>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <el-menu-item index="1" @click="enterEdit()">
          <i class="el-icon-edit"></i>
          <span slot="title">更改个人信息</span>
        </el-menu-item>
        <el-menu-item index="2" @click="enterPatient()">
          <i class="el-icon-notebook-1"></i>
          <span slot="title">我的就诊卡</span>
        </el-menu-item>
        <el-menu-item index="3" @click="enterAppoint()">
          <i class="el-icon-bell"></i>
          <span slot="title">待完成预约</span>
        </el-menu-item>
        <el-menu-item index="4" @click="enterOrder()">
          <i class="el-icon-s-order"></i>
          <span slot="title">历史预约记录</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</div>
</template>

<script>
export default {
  data() {
    return{
    }
  }, methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }, enterEdit() {
      if (this.$route.path !== '/home/personalCenter/personalEdit') {
        // 如果当前不是个人中心的患者页面，则执行导航操作
        this.$router.push('/home/personalCenter/personalEdit');
      }
    }, enterPatient() {
      if (this.$route.path !== '/home/personalCenter/personalPatient') {
        this.$router.push('/home/personalCenter/personalPatient');
      }
    },enterAppoint() {
      if (this.$route.path !== '/home/personalCenter/personalAppoint') {
        this.$router.push('/home/personalCenter/personalAppoint');
      }
    },enterOrder() {
      if (this.$route.path !== '/home/personalCenter/personalOrder') {
        this.$router.push('/home/personalCenter/personalOrder');
      }
    }
  }
};
</script>
<style scoped>

.el-aside {
  color: #d7d7d7;
}

.el-menu-vertical-demo {
  background-color: rgb(255, 255, 255);
}

.as {
  background-color: rgb(240, 240, 240);
}
</style>