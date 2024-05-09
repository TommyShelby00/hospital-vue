<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/organization' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
            <el-breadcrumb-item>我的就诊卡</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
        <div v-if="cardForm != null">
            <el-image style="width: 200px; height: 200px;" :src="cardForm.qrCode" v-if="cardForm.qrCode != ''"
                class="img"></el-image>
            <div class="info">
                <span><i class="el-icon-user"></i>姓名:{{ cardForm.name }}</span><br>
                <span><i class="el-icon-phone"></i>手机号:{{ cardForm.phone }}</span><br>
                <span><i class="el-icon-tickets"></i>身份证:{{ cardForm.identity }}</span><br>
            </div>
            <el-divider></el-divider>
        </div>

        <div v-if="cardForm!= null">
            <el-button @click="returnInfo()">编辑就诊卡</el-button>
            <el-dialog title="编辑就诊卡" :visible.sync="dialogFormVisible" width="600px">
                <el-form :model="form" :rules="rules">
                    <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
                        <el-input v-model="form.phone" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号码" :label-width="formLabelWidth" prop="identity">
                        <el-input v-model="form.identity" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateCard()">确 定</el-button>
                </div>
            </el-dialog>
        </div>

        <div v-if="cardForm=== null">
            <el-button @click="dialogFormVisible = true">添加就诊卡</el-button>
            <el-dialog title="添加就诊卡" :visible.sync="dialogFormVisible" width="600px">
                <el-form :model="form">
                    <el-form-item label="姓名" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" :label-width="formLabelWidth">
                        <el-input v-model="form.phone" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号码" :label-width="formLabelWidth">
                        <el-input v-model="form.identity" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="insertCard()">确 定</el-button>
                </div>
            </el-dialog>
        </div>


    </div>
</template>

<script>
import { request } from '@/network/gateway';
export default {
    data() {
        return {
            dialogFormVisible: false,
            cardForm:'',
            form: {
                userId:this.$store.state.username,
                name: '',
                phone: '',
                identity: ''
            },
            formLabelWidth: '120px',
            rules: {
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
                ],
                identity: [
                    { required: true, message: '请输入身份证号码', trigger: 'blur' },
                    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号格式不正确', trigger: 'blur' }
                ],
                name: [
                    {
                        required: true, message: '密码不能为空', trigger: 'blur'
                    }
                ]
            }
        };
    }, methods: {
        queryCard() {
            request({
                url: '/user/queryCard',
                method: 'get',
                params: {
                    id: this.$store.state.id
                }
            }).then(res => {
                this.cardForm = res.data.data
            })
        }, insertCard() {
            this.dialogFormVisible = false
            request({
                url: '/user/addCard',
                method: 'post',
                data: this.form
            }).then(res => {
                this.cardForm = res.data.data
                console.log(this.cardForm.qrCode)
            })
        }, updateCard() {
            request({
                url: '/user/updateCard',
                method: 'put',
                data: this.form
            }).then(res => {
                this.dialogFormVisible = false,
                    this.queryCard()
            })
        }, returnInfo() {
            this.dialogFormVisible = true
            this.form.id = this.cardForm.id
            this.form.name = this.cardForm.name
            this.form.phone = this.cardForm.phone
            this.form.identity = this.cardForm.identity
            console.log("信息回显")
            console.log(this.form)
        }
    }, mounted() {
        this.queryCard()
    }
};
</script>

<style scoped>
.info {
    position: relative;
    top: 10px;
}
</style>