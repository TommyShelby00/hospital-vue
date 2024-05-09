<template>
    <div class="loginBox">
        <h1 id="title">账号注册</h1>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input v-model="ruleForm.age"></el-input>
            </el-form-item>
            <el-form-item label="头像" label-width="100px">
                <el-upload class="avatar-uploader" :show-file-list="false" :before-upload="beforeAvatarUpload"
                    action="">
                    <img v-if="ruleForm.avatar" :src="ruleForm.avatar" class="avatar" list-type="picture-card">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="性别">
                <el-radio v-model="ruleForm.gender" label="1">男</el-radio>
                <el-radio v-model="ruleForm.gender" label="2">女</el-radio>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()">注册</el-button>
                <el-button @click="returnLogin">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { request } from '@/network/gateway';

export default {
    data() {
        var validateUsername = (rule, value, callback) => {
            if (value === '') {
                console.log(value);
                callback(new Error('请输入用户名'));
            } else {
                callback();
            }
        };
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        var validatePhone = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号'));
            } else if (!/^1[3456789]\d{9}$/.test(value)) {
                callback(new Error('手机号格式不正确'));
            } else {
                callback();
            }
        };

        var validateAge = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入年龄'));
            } else if (!/^\d+$/.test(value)) {
                callback(new Error('年龄必须为数字'));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                username: '',
                pass: '',
                checkPass: '',
                phone: '',
                age: '',
                gender: '1',
                avatar: null
            },
            rules: {
                username: [
                    { validator: validateUsername, trigger: 'blur' }
                ],
                pass: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
                phone: [
                    { validator: validatePhone, trigger: 'blur' }
                ],
                age: [
                    { validator: validateAge, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        submitForm() {
            const form=this.ruleForm
            form.password=this.ruleForm.pass
            request({
                url:'/user/1',
                method:'post',
                data:form
            }).then(res=>{
                this.$message.success("注册成功")
                this.$router.push('/login')
            })
        },
        returnLogin() {
            this.$router.push('/login');
        }, beforeAvatarUpload(file) {
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
                this.ruleForm.avatar = res.data.data
                console.log(this.avatar)
            })
        },
    }
}
</script>

<style scoped>
.loginBox {
    position: absolute;
    top: 3%;
    right: 40%;
    width: 400px;
    height: 200px;
}

#title {
    color: #409EFF;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>