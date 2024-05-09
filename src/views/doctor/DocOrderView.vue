<template>
    <div>
        <el-table ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column label="id" prop="id" width="70px" >
            </el-table-column>
            <el-table-column label="用户id" prop="userId" width="180px" >
            </el-table-column>
            <el-table-column label="科室名称" prop="orgName" width="150px" >
            </el-table-column>
            <el-table-column label="医生" prop="doctorName" width="90px" >
            </el-table-column>
            <el-table-column label="日期" prop="date" width="100px" sortable>
            </el-table-column>
            <el-table-column label="开始时间" prop="beginTime" width="110px" >
            </el-table-column>
            <el-table-column label="结束时间" prop="endTime" width="110px" >
            </el-table-column>
            <el-table-column label="姓名" prop="name" width="90px" sortable>
            </el-table-column>
            <el-table-column label="手机号" prop="phone" width="120px" >
            </el-table-column>
            <el-table-column label="身份证" prop="identity" width="90px" >
            </el-table-column>
            <el-table-column label="费用" prop="fee" width="80px" sortable>
            </el-table-column>
            <el-table-column label="状态" prop="status" width="80px" sortable>
                <template slot-scope="scope">
                    {{ scope.row.status === 0 ? '未支付' :
                       scope.row.status === 1 ? '已支付' :
                       scope.row.status === 2 ? '已取消' :
                       scope.row.status === 3 ? '已超时' :
                       scope.row.status === 4 ? '已完成' : 
                                    ''}}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { doctorRequest } from '@/network/gateway'
export default {
    data() {
        return {
            tableData: [],
            currentPage: 1,
            total: 0,
            pageSize: 10,
            multipleSelection: [],
            dialogFormVisible: false,
            form: {
            },
            formLabelWidth: '120px',
            addForm: {},
            dialogVisible: false,
            orgName: '',
            docName: '',
            date: '',
            options: [],
            options2: [],
            value: '',
            value2: ''
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath)
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath)
        },
        queryOrder() {
            doctorRequest({
                url: '/order/getByDocId',
                method: 'get',
                params: {
                    doctorId:this.$store.state.docId
                }
            }).then(res => {
                this.tableData = res.data.data
            })
        },
        handleEdit(row) {
            this.dialogFormVisible = true
            this.form = JSON.parse(JSON.stringify(row))
            this.queryDoc()
        },
        editOrder() {
            this.dialogFormVisible = false
            doctorRequest({
                url: '/order',
                method: 'put',
                data: this.form
            }).then(res => {
                this.$message.success('修改成功')
                this.queryOrder()
            })
        },
        deleteOrder() {
            let selectedIds = this.multipleSelection.map(item => item.id);
            if (selectedIds.length === 0) {
                this.$message.error('请选择要删除的订单');
                return;
            }
            doctorRequest({
                url: '/order',
                method: 'delete',
                data: selectedIds
            }).then(res => {
                this.$message.success('删除成功')
                this.queryOrder()
            }).catch(err => {
                console.log(err)
            })
        },
        search() {
            this.querySch()
        }
    },
    mounted() {
        this.queryOrder()
    }

}
</script>

<style>
.block {
    width: 70%;
}

.btn {
    position: absolute;
    top: 3px;
    right: 2px;
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