<template>
    <div>
        <div class="search">
            姓名&nbsp;<el-input placeholder="请输入" v-model="name" style="width: 200px;" size="small"></el-input>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            手机号&nbsp;<el-input placeholder="请输入" v-model="phone" style="width: 200px;" size="small"></el-input>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            身份证&nbsp;<el-input placeholder="请输入" v-model="identity" style="width: 200px;" size="small"></el-input>
            <el-button type="primary" icon="el-icon-search" size="small" @click="search()">搜索</el-button>
        </div>
        <el-table ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="id" prop="id" width="200px">
            </el-table-column>
            <el-table-column label="用户id" prop="userId" width="200px">
            </el-table-column>
            <el-table-column prop="qrCode" label="二维码">
                <template slot-scope="scope">
                    <el-image :src="scope.row.avatar" style="width: 50px; height: 50px"></el-image>
                </template>
            </el-table-column>
            <el-table-column label="姓名" prop="name">
            </el-table-column>
            <el-table-column label="手机号" prop="phone">
            </el-table-column>
            <el-table-column label="身份证" prop="identity">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row>
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
            <div class="btn">
                <el-button @click="toggleSelection()" size="mini">取消选择</el-button>
                <el-button @click="deleteCard()" size="mini" type="danger">删除</el-button>
            </div>
        </el-row>

        <el-dialog title="更改就诊卡信息" :visible.sync="dialogFormVisible" label-position="right">
            <el-form :model="form">
                <el-form-item label="id" prop="id" :label-width="formLabelWidth">
                    <el-input v-model="form.id" style="width: 200px;" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="用户id" prop="userId" :label-width="formLabelWidth">
                    <el-input v-model="form.userId" style="width: 200px;" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="form.name" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone" :label-width="formLabelWidth">
                    <el-input v-model="form.phone" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="身份证" prop="identity" :label-width="formLabelWidth">
                    <el-input v-model="form.identity" style="width: 200px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCard()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { adminRequest } from '@/network/gateway'
export default {
    data() {
        return {
            tableData: [],
            currentPage: 1,
            total: 0,
            pageSize: 10,
            multipleSelection: [],
            dialogFormVisible: false,
            form: '',
            name:'',
            phone:'',
            identity:'',
            formLabelWidth:'120px'
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath)
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath)
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.queryUser()
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.queryUser()
            console.log(`当前页: ${val}`);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        queryCard() {
            adminRequest({
                url: '/admin/queryCard',
                method: 'get',
                params: {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,
                    name:this.name,
                    phone:this.phone,
                    identity:this.identity
                }
            }).then(res => {
                this.tableData = res.data.data.records
                this.total = res.data.data.total
            })
        },
        handleEdit(row) {
            this.dialogFormVisible = true
            this.form = JSON.parse(JSON.stringify(row)); 
        },
        editCard() {
            this.dialogFormVisible = false
            adminRequest({
                url: '/user/updateCard',
                method: 'put',
                data: this.form
            }).then(res => {
                this.$message.success('修改成功')
                this.queryCard()
            })
        },
        search(){
            this.queryCard()
        },
        deleteCard(){
            let selectedIds = this.multipleSelection.map(item => item.id);
            if (selectedIds.length === 0) {
                this.$message.error('请选择要删除的就诊卡');
                return;
            }
            adminRequest({
                url: '/admin/card',
                method: 'delete',
                data: selectedIds
            }).then(res => {
                this.$message.success('删除成功')
                this.queryCard()
            }).catch(err => {
                console.log(err)
            })
        }
    },
    mounted() {
        this.queryCard()
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
</style>