<template>
    <div>
        <el-table ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="科室id" prop="id" width="100px" sortable>
            </el-table-column>
            <el-table-column label="科室名称" prop="name" width="200px" sortable>
            </el-table-column>
            <el-table-column label="科室简介" prop="description" width="300px">
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" sortable>
            </el-table-column>
            <el-table-column label="更新时间" prop="updateTime" sortable>
            </el-table-column>
            <el-table-column label="状态" prop="status" width="100px" sortable>
                <template slot-scope="scope">
                    {{ scope.row.status === 1 ? '启用中' : '已停用' }}
                </template>
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
                <el-button @click="deleteOrg()" size="mini" type="danger">删除</el-button>
                <el-button @click="dialogVisible=true" size="mini" type="primary">添加科室</el-button>
            </div>
        </el-row>

        <el-dialog title="更改科室信息" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="id" prop="id" :label-width="formLabelWidth">
                    <el-input v-model="form.id" style="width: 200px;" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="科室名称" prop="name" :label-width="formLabelWidth">
                    <el-input type="textarea" autosize placeholder="请输入内容" v-model="form.name">
                    </el-input>
                </el-form-item>
                <el-form-item label="科室简介" prop="description" :label-width="formLabelWidth">
                    <el-input type="textarea" autosize placeholder="请输入内容" v-model="form.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-radio v-model="form.status" :label='1'>启用</el-radio>
                    <el-radio v-model="form.status" :label='0'>停用</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editOrg()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="添加科室" :visible.sync="dialogVisible">
            <el-form :model="addForm">
                <el-form-item label="科室名称" prop="name" :label-width="formLabelWidth">
                    <el-input type="textarea" autosize placeholder="请输入内容" v-model="addForm.name">
                    </el-input>
                </el-form-item>
                <el-form-item label="科室简介" prop="description" :label-width="formLabelWidth">
                    <el-input type="textarea" autosize placeholder="请输入内容" v-model="addForm.description">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrg()">确 定</el-button>
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
            formLabelWidth: '120px',
            addForm:{
                name:'',
                description:''
            },
            dialogVisible:false
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
        queryOrg() {
            adminRequest({
                url: '/organization/page',
                method: 'get',
                params: {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize
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
        editOrg() {
            this.dialogFormVisible = false
            adminRequest({
                url: '/organization',
                method: 'put',
                data: this.form
            }).then(res => {
                this.$message.success('修改成功')
                this.queryOrg()
            })
        },
        addOrg() {
            this.dialogVisible = false
            adminRequest({
                url: '/organization',
                method: 'post',
                data: this.addForm
            }).then(res => {
                this.$message.success('添加成功')
                this.queryOrg()
            })
        },
        deleteOrg() {
            let selectedIds = this.multipleSelection.map(item => item.id);
            if (selectedIds.length === 0) {
                this.$message.error('请选择要删除的科室');
                return;
            }
            adminRequest({
                url: '/organization/del',
                method: 'delete',
                data: selectedIds
            }).then(res => {
                this.$message.success('删除成功')
                this.queryOrg()
            }).catch(err => {
                console.log(err)
            })
        }
    },
    mounted() {
        this.queryOrg()
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