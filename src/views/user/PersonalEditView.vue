<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
            <el-breadcrumb-item>更改个人信息</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
        <div class="avatar">
            <el-avatar :size="100" :src="form.avatar"></el-avatar>
        </div>
        <el-divider></el-divider>
        <div class="info">
            <el-form :model="form" label-position="left" label-width="80px" :rules="rules">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" show-password :readonly="isPasswordReadonly"
                        style="width: 200px;"></el-input>
                    <el-button type="text" @click="passEdit"><i class="el-icon-edit"></i>更改密码</el-button>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="form.phone" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio v-model="form.gender" :label='1'>男</el-radio>
                    <el-radio v-model="form.gender" :label='2'>女</el-radio>
                </el-form-item>
                <el-form-item label="头像" label-width="100px">
                <el-upload class="avatar-uploader" :show-file-list="false" :before-upload="beforeAvatarUpload"
                    action="">
                    <img v-if="form.avatar" :src="form.avatar" class="avatar" list-type="picture-card">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            </el-form>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="primary" @click="updateUser()">更改</el-button>
        </div>
    </div>
</template>

<script>
import { request } from '@/network/gateway';
import store from '@/store';

export default {
    // name:'personalEdit',
    data() {
        var validatePhone = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号'));
            } else if (!/^1[3456789]\d{9}$/.test(value)) {
                callback(new Error('手机号格式不正确'));
            } else {
                callback();
            }
        };
        var validateUsername = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('用户名不能为空'));
            } else {
                callback();
            }
        };
        var validatePassword = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('密码不能为空'));
            } else {
                callback();
            }
        };
        return {
            circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            dialogVisible: false,
            form: {
                username: '',
                password: '',
                phone: '',
                gender: '',
                avatar: ''
            },
            imageUrl: '',
            isPasswordReadonly: true,
            rules: {
                phone: [
                    { validator: validatePhone, trigger: 'blur' }
                ],
                username: [
                    { validator: validateUsername, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePassword, trigger: 'blur' }
                ]
            }
        }
    }, methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        }, handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            //const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            let fd = new FormData();//通过form数据格式来传
            fd.append("image", file); //传文件
            request({
                url: '/user/upload',
                method: 'post',
                data: fd
            }).then(res => {
                this.form.avatar = res.data.data
                console.log(this.avatar)
            })
        },
        queryUser() {

            request({
                url: '/user',
                method: 'get',
            }).then(res => {
                this.form = res.data.data
                console.log(this.form.gender)
            })
        }, updateUser() {
            request({
                url: '/user/2',
                method: 'put',
                data: this.form
            }).then(res => {
                this.queryUser()
                this.$message.success('修改成功')
            })
        }, passEdit() {
            this.isPasswordReadonly = !this.isPasswordReadonly;
            if (!this.isPasswordReadonly) {
                this.dialogVisible = true; // 可以在这里添加弹出框逻辑
            }
        }
    }, mounted() {
        this.queryUser()
    }
}
</script>

<style scoped>
.info {
    margin: 20px;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
}

</style>