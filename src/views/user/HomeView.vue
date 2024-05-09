<template>
    <div>
        <el-container style="height: 100vh;">
            <el-header>
                欢迎使用L医院预约挂号系统
                <div id="search">
                    <el-select v-model="value" placeholder="请选择" style="width: 100px;">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input placeholder="请输入科室名称/医生姓名" v-model="input" style="width: 500px;"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                </div>
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1" @click="enterHome()">首页</el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">个人中心</template>
                        <el-menu-item index="2-1" @click="enterEdit"><i class="el-icon-edit"></i>更改个人信息</el-menu-item>
                        <el-menu-item index="2-2" @click="enterPatient"><i class="el-icon-notebook-1"></i>我的就诊卡</el-menu-item>
                        <el-menu-item index="2-3" @click="enterAppoint"><i class="el-icon-bell"></i>待完成预约</el-menu-item>
                        <el-menu-item index="2-4" @click="enterOrder"><i class="el-icon-s-order"></i>历史预约记录</el-menu-item>
                        <el-menu-item index="2-5" @click="exit">退出登录</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="3" @click="enterMsg()">消息中心</el-menu-item>
                </el-menu>
                <div id="avatar">
                    {{ this.$store.state.username }}
                    <el-avatar :size="30" :src="avatar" style="position: relative; top: 8px;"></el-avatar>
                </div>
            </el-header>
            <el-container>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import { request } from '@/network/gateway';
import store from '@/store';

export default {
    data() {
        return {
            input: '',
            avatar:this.$store.state.avatar,
            value1: '',
            activeIndex: '',
            options: [{
                value: 1,
                label: '科室'
            }, {
                value: 2,
                label: '医生'
            }],
            value: ''
        }
    }, methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }, handleEdit(index, row) {
            console.log(index, row);
        }, handleCommand(command) {
            this.$message('click on item ' + command);
        }, handleSelect(key, keyPath) {
            console.log(key, keyPath);
        }, enterEdit() {
            if (this.$route.path !== '/home/personalEdit') {
            this.$router.push('/home/personalEdit');
            }
        }, enterPatient() {
            if (this.$route.path !== '/home/personalPatient') {
            this.$router.push('/home/personalPatient');
            }
        }, enterAppoint() {
            if (this.$route.path !== '/home/personalAppoint') {
            this.$router.push('/home/personalAppoint');
            }
        }, enterOrder() {
            if (this.$route.path !== '/home/personalOrder') {
            this.$router.push('/home/personalOrder');
            }
        },enterMsg(){
            this.$router.push('/home/userMessage')
        },enterHome() {
            if (this.$route.path !== '/home') {
            this.$router.push('/home');
            }
        },search(){
            if(this.value===1){
                this.$store.commit('setSearchOrg',this.input)
                if (this.$route.path !== '/home/searchOrg')
                this.$router.push('/home/searchOrg')
            else{
                window.location.reload()
            }
            }else if(this.value===2){
                this.$store.commit('setSearchDoc',this.input)
                if (this.$route.path !== '/home/searchDoc')
                this.$router.push('/home/searchDoc')
            else{
                window.location.reload()
            }
            }
        },exit(){
            request({
                url:'/user/exit',
                method:'get',
                params:{
                    id:this.$store.state.id
                }
            }).then(res=>{
                this.$store.commit('restart')
                this.$message.success("成功登出")
                this.$router.push('/login')
            })
        }
    }
}
</script>

<style scoped>
.el-header {
    background-color: rgb(252, 199, 236);
    color: #333;
    line-height: 60px;
    display: flex;

    justify-content: space-between;

}

.el-main {
    background-color: #ffffff;
    color: #333;
}

body>.el-container {
    margin-bottom: 40px;
}

#avatar {
    justify-content: flex-end;
}

.el-dropdown-link {
    cursor: pointer;
    color: #000000;
}

.el-icon-arrow-down {
    font-size: 12px;
}

.el-menu {
    background-color: rgb(252, 199, 236);
}
</style>