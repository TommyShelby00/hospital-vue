<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
            <el-breadcrumb-item>待完成预约</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
        <div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="日期" prop="date" sortable>
                </el-table-column>
                <el-table-column label="开始时间" prop="beginTime">
                </el-table-column>
                <el-table-column label="结束时间" prop="endTime">
                </el-table-column>
                <el-table-column label="科室名称" prop="orgName" sortable>
                </el-table-column>
                <el-table-column label="医生名称" prop="doctorName" sortable>
                </el-table-column>
                <el-table-column label="姓名" prop="name">
                </el-table-column>
                <el-table-column label="手机号" prop="phone">
                </el-table-column>
                <el-table-column label="身份证" prop="identity">
                </el-table-column>
                <el-table-column label="费用" prop="fee" sortable>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="cancelOrder(scope.row)">取消预约</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { request } from '@/network/gateway';

export default {
    data() {
        return {
            tableData: []
        }
    }, methods: {
        queryAppoint() {
            request({
                url: '/order/todo',
                method: 'get',
                params: {
                    userId: this.$store.state.id
                }
            }).then(res => {
                this.tableData = res.data.data
            })
        },
        cancelOrder(row){
            request({
                url:'/order/cancel',
                method:'put',
                data:{
                    id:row.id,
                    status:2
                }
            }).then(res=>{
                this.queryAppoint()
            })
        }
    }, mounted() {
        this.queryAppoint()
    }
}
</script>