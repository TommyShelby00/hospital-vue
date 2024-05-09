<template>
    <div>
        <div class="til">
            <div style="display: flex; align-items: center;">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/home' }">科室选择</el-breadcrumb-item>
                    <el-breadcrumb-item>医生选择</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <template>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="医生名称" prop="name" width="180">
                </el-table-column>
                <el-table-column label="特长" prop="specialty" width="500">
                </el-table-column>
                <el-table-column label="职称" prop="position" width="180" sortable>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEnter(scope.row)">选择医生</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
import { request } from '@/network/gateway';
import moment from 'moment';
export default {
    data() {
        return {
            tableData: [],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            value1: '',
            today: ''

        }
    }, methods: {
        query() {
            request({
                url: '/schedule/docRemind',
                method: 'get',
                params: {
                    id: this.$store.state.orgId,
                    date: this.today
                }
            }).then(res => {
                this.tableData = res.data.data
                this.tableData.map((item) => {
                    if (item.remind === null)
                        item.remind = 0;
                    return;
                })
            })
        },
        handleEnter(row) {
            this.$store.commit('setDocId', row.id)
            this.$store.commit('setDocName', row.name)
            this.$router.push('/home/doctorDetail')
        },
        changeDate(){
            this.today=moment(this.value1).format('YYYY-MM-DD')
            this.query()
        },
        search(){
            request({
                url:'/doctor/name',
                method:'get',
                params:{
                    docName:this.$store.state.searchDoc
                }
            }).then(res=>{
                this.tableData = res.data.data
            })
        }
    }, mounted() {
        this.today = moment(this.currentDate).format('YYYY-MM-DD')
        this.value1=this.today
        this.search()
    }
}
</script>

<style scoped></style>