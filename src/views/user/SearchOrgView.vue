<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>科室选择</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column label="科室名称" prop="name" width="180">
            </el-table-column>
            <el-table-column label="科室简介" prop="description" width="500">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEnter(scope.row)">进入科室</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { request } from '@/network/gateway'
import moment from 'moment'

export default {
    // name:'organizationView',
    data() {
        return {
            tableData: [],
            currentDate: new Date(),
            today: ''
        }
    }, methods: {
        query() {
            request({
                url: '/schedule/orgRemind',
                method: 'get',
                params: {
                    date: this.today
                }
            }).then(res => {
                this.tableData = res.data.data
                this.tableData.map((item) => {
                    if (item.remind === null)
                        item.remind = 0;
                    // return;
                })
            })
        }
        , handleEnter(row) {
            this.$store.commit('setOrgId',row.id)
            this.$store.commit('setOrgName',row.name)
            this.$router.push('/home/doctor')
        },
        search(){
            let orgName=this.$store.state.searchOrg
            request({
                url:'/organization/name',
                method:'get',
                params:{
                    orgName:orgName
                }
            }).then(res=>{
                this.tableData=res.data.data
            })
        }
    }, mounted() {
        this.today = moment(this.currentDate).format('YYYY-MM-DD')
        this.$nextTick(()=>{
            
            this.search()
        })
        // this.query()
    }
}
</script>

<style scoped>
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
.el-breadcrumb{
    margin: 10px;
}
</style>