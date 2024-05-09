<template>
    <div>
        <el-container>
            <el-header>
                欢迎使用L医院后台管理系统
                <span style="float: right;">{{ this.$store.state.username }}</span>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu default-active="1-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" style="height: 100%;">
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-user"></i>
                                <span>用户管理</span>
                            </template>
                            <el-menu-item index="1-1" @click="enterUser()">用户管理</el-menu-item>
                            <el-menu-item index="1-2" @click="enterCard()">就诊卡管理</el-menu-item>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title">
                                <i class="el-icon-s-cooperation"></i>
                                <span>科室/医生管理</span>
                            </template>
                            <el-menu-item index="2-1" @click="enterDoctor()">医生管理</el-menu-item>
                            <el-menu-item index="2-2" @click="enterOrg()">科室管理</el-menu-item>
                        </el-submenu>
                        <el-menu-item index="3" @click="enterSch()">
                            <i class="el-icon-document"></i>
                            <span slot="title">排班管理</span>
                        </el-menu-item>
                        <el-menu-item index="4" @click="enterOrder()">
                            <i class="el-icon-s-order"></i>
                            <span slot="title">订单管理</span>
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

<style>

.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
}

.el-aside {
    color: #333;
    height: 90vh;
}

</style>

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
        enterUser() {
            this.$router.push('/admin/userManage')
        },
        enterCard() {
            this.$router.push('/admin/cardManage')
        },
        enterDoctor(){
            this.$router.push('/admin/doctorManage')
        },
        enterOrg(){
            this.$router.push('/admin/orgManage')
        },
        enterSch(){
            this.$router.push('/admin/schManage')
        },
        enterOrder(){
            this.$router.push('/admin/OrderManage')
        }
    }
};
</script>