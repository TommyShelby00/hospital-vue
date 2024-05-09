<template>
    <div>
        <el-container>
            <el-header>
                欢迎使用L医院预约挂号系统-医生端
                <span style="float: right;">{{ this.$store.state.username }}</span>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                        <el-menu-item index="1" @click="enterSch()">
                            <i class="el-icon-document"></i>
                            <span slot="title">排班表</span>
                        </el-menu-item>
                        <el-menu-item index="2" @click="enterMsg()">
                            <i class="el-icon-document"></i>
                            <span slot="title">消息中心</span>
                        </el-menu-item>
                        <el-menu-item index="3" @click="enterOrder()">
                            <i class="el-icon-s-order"></i>
                            <span slot="title">预约订单</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>



<script>
import store from '@/store';

export default {
    data() {
        return {

        }
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath)
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath)
        },
        enterSch(){
            this.$router.push('/doctor/sch')
        },
        enterMsg(){
            this.$router.push('/doctor/message')
        },
        enterOrder(){
            this.$router.push('/doctor/order')
        },
    }
};
</script>

<style scoped>

.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
}

.el-aside {
    color: #333;
    height: 80vh;
}

.el-main{
    /* height: 400px; */
    padding: 0px;
}
</style>