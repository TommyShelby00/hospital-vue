<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">科室选择</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/home/doctor' }">医生选择</el-breadcrumb-item>
            <el-breadcrumb-item>号源选择</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="info">
            <div class="img">
                <el-avatar shape="square" :size="150" :src="img"></el-avatar>
            </div>
            <div class="detail">
                姓名：{{ docInfo.name }}<br>
                科室：{{ this.$store.state.orgName }}<br>
                简介:{{ docInfo.description }}<br>
                职称:{{ docInfo.position }}<br>
                专长:{{ docInfo.specialty }}<br>
                <el-button size="small" @click="enterMsg"><i class="el-icon-chat-dot-square"></i>交流</el-button>
            </div>
        </div>
        <div class="resource">
            <el-menu :default-active="index" class="el-menu-demo" mode="horizontal" @select="handleSelect" id="date">
                <el-menu-item v-for="(info, i) in docInfo.resources" :key="i" :index="i + 1">{{ info.date
                    }}(余号{{ info.remind }})</el-menu-item>
            </el-menu>
            <template>
                <el-table :data="detailInfo" style="width: 100%">
                    <el-table-column label="开始时间" prop="beginTime" width="200">
                    </el-table-column>
                    <el-table-column label="结束时间" prop="endTime" width="200">
                    </el-table-column>
                    <el-table-column label="费用" prop="fee" width="200">
                    </el-table-column>
                    <el-table-column label="余号" prop="remind" width="200" align="center">
                    </el-table-column>
                    <el-table-column label="预约">
                        <template slot-scope="scope">
                            <el-button @click="handleOrder(scope.row)">预约</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <el-dialog title="确认预约信息" :visible.sync="dialogFormVisible" width="500px">
                <el-form :model="form">
                    <el-form-item label="科室名称" :label-width="formLabelWidth">
                        <el-input v-model="form.orgName" :readonly="true"></el-input>
                    </el-form-item>
                    <el-form-item label="医生姓名" :label-width="formLabelWidth">
                        <el-input v-model="form.doctorName" :readonly="true"></el-input>
                    </el-form-item>
                    <el-form-item label="预约日期" :label-width="formLabelWidth">
                        <el-input v-model="form.date" :readonly="true"></el-input>
                    </el-form-item>
                    <el-form-item label="预约时间段" :label-width="formLabelWidth">
                        <el-row>
                            <el-col :span="11">
                                <el-input v-model="form.beginTime" :readonly="true"></el-input>
                            </el-col>
                            <el-col class="line" :span="2" style="text-align: center;">-</el-col>
                            <el-col :span="11">
                                <el-input v-model="form.endTime" :readonly="true"></el-input>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="就诊人姓名" :label-width="formLabelWidth">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" :label-width="formLabelWidth">
                        <el-input v-model="form.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证" :label-width="formLabelWidth">
                        <el-input v-model="form.identity"></el-input>
                    </el-form-item>
                    <el-form-item label="费用" :label-width="formLabelWidth">
                        <el-input v-model="form.fee" readonly="true"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="createOrder()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <div v-html="text">

        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { request } from '@/network/gateway';
import store from '@/store';

export default {
    data() {
        return {
            activeIndex: '1',
            img: '',
            docInfo: '',
            detailInfo: {},
            dialogFormVisible: false,
            text:'',
            form: {
                userId: this.$store.state.id,
                schId: '',
                doctorId: '',
                orgId: '',
                orgName: '',
                doctorName: '',
                date: '',
                beginTime: '',
                endTime: '',
                name: '',
                phone: '',
                identity: '',
                fee: ''
            },
            formLabelWidth: '120px',
            index: '1'
        }
    }, methods: {
        queryDoctor() {
            request({
                url: '/schedule/doctor',
                method: 'get',
                params: {
                    id: this.$store.state.docId,

                }
            }).then(res => {
                this.docInfo = res.data.data
                this.img=this.docInfo.img
                this.queryDetail()
            })
        },
        queryDetail() {
            request({
                url: '/schedule/date',
                method: 'get',
                params: {
                    id: this.$store.state.docId,
                    date: this.docInfo.resources[this.activeIndex - 1].date
                }
            }).then(res => {
                this.detailInfo = res.data.data
            })
        }, handleSelect(index) {
            this.activeIndex = index
            this.queryDetail()
        }, handleOrder(row) {
            this.form.schId = row.id
            this.dialogFormVisible = true
            this.form.doctorId = this.$store.state.docId
            this.form.orgId = this.$store.state.orgId
            this.form.orgName = this.$store.state.orgName
            this.form.doctorName = this.$store.state.docName
            this.form.date = this.docInfo.resources[this.activeIndex - 1].date
            this.form.beginTime = row.beginTime
            this.form.endTime = row.endTime
            this.form.fee = row.fee
            this.queryCard()
        }, createOrder() {
            this.dialogFormVisible = false
            request({
                url: '/order',
                method: 'post',
                data: this.form
            }).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('订单创建成功')
                    console.log(res.data.data)
                    this.doPay(res.data.data)
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        }, enterMsg() {
            // request({
            //     url:'/chat/enterRoom',
            //     method:'post',
            //     data:{
            //         userId:this.$store.state.id,
            //         doctorId:this.$store.state.docId
            //     }
            // }).then(res=>{
            //     this.$store.commit('setRoomId',res.data.data.id)
            // })
            this.$router.push('/home/userMessage')
        }, queryCard() {
            request({
                url: '/user/queryCard',
                method: 'get',
                params: {
                    id: this.$store.state.id
                }
            }).then(res => {
                const r = res.data.data
                this.form.phone = r.phone
                this.form.identity = r.identity
                this.form.name = r.name
            })
        }, doPay(order) {
            request({
                url: '/pay/doPay',
                method: 'post',
                data: {
                    "orderId": order.id,
                    "userId": order.userId,
                    "orgId": order.orgId,
                    "doctorId": order.doctorId,
                    "amount": order.fee
                }
            }).then(res=>{
                this.text=res.data.data
                this.text = this.text.replace('style="display:none"', 'style="display:none" id="payBtn"')
                setInterval(function(){
                    document.getElementById('payBtn').click()
                } , 50)
            }).catch(err=>{
                console.log(err)
            })
        }
    }, mounted() {
        this.queryDoctor()
    }
}
</script>

<style scoped>
.info {
    display: flex;
    width: 100%;
    height: 170px;
}

.img {
    float: left;
}

.detail {
    float: left;
    text-align: left;
}

.resource {
    float: left;
}

.el-breadcrumb {
    margin: 10px;
}

#date {
    background-color: rgb(255, 255, 255);
}
</style>