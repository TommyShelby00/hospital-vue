<template>
    <div>
        <div class="search">
            科室名&nbsp;<el-select v-model="value" placeholder="请选择" size="small">
                <el-option :key="null" :label="''" :value="null"></el-option>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            姓名&nbsp;<el-input placeholder="请输入" v-model="name" style="width: 200px;" size="small"></el-input>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            职位&nbsp;<el-input placeholder="请输入" v-model="position" style="width: 200px;" size="small"></el-input>
            <el-button type="primary" icon="el-icon-search" size="small" @click="search()">搜索</el-button>
        </div>
        <el-table ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="id" prop="id" width="70px" >
            </el-table-column>
            <el-table-column label="科室名称" prop="orgName" width="150px" >
            </el-table-column>
            <el-table-column label="姓名" prop="name" width="100px" >
            </el-table-column>
            <el-table-column label="简介" prop="description" width="270px">
            </el-table-column>
            <el-table-column label="专长" prop="specialty" width="180px">
            </el-table-column>
            <el-table-column label="职称" prop="position" >
            </el-table-column>
            <el-table-column label="入院时间" prop="comeTime" >
            </el-table-column>
            <el-table-column label="状态" prop="status" width="100px" >
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
                <el-button @click="deleteDoctor()" size="mini" type="danger">删除</el-button>
                <el-button @click="dialogVisible = true" size="mini" type="primary">添加医生</el-button>
            </div>
        </el-row>

        <el-dialog title="更改医生信息" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="id" prop="id" :label-width="formLabelWidth">
                    <el-input v-model="form.id" style="width: 200px;" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="科室名称" prop="orgName" :label-width="formLabelWidth">
                    <el-select v-model="form.orgId" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="form.name" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="简介" prop="description" :label-width="formLabelWidth">
                    <el-input type="textarea" autosize placeholder="请输入内容" v-model="form.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="专长" prop="specialty" :label-width="formLabelWidth">
                    <el-input type="textarea" autosize placeholder="请输入内容" v-model="form.specialty">
                    </el-input>
                </el-form-item>
                <el-form-item label="职称" prop="position" :label-width="formLabelWidth">
                    <el-input v-model="form.position" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-radio v-model="form.status" :label='1'>启用</el-radio>
                    <el-radio v-model="form.status" :label='0'>停用</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editDoctor()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="添加医生" :visible.sync="dialogVisible">
            <el-form :model="addForm">
                <el-form-item label="科室名称" prop="orgName" :label-width="formLabelWidth">
                    <el-select v-model="addForm.orgId" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="医生姓名" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="addForm.name" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="医生简介" prop="description" :label-width="formLabelWidth">
                    <el-input type="textarea" autosize placeholder="请输入内容" v-model="addForm.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="专长" prop="specialty" :label-width="formLabelWidth">
                    <el-input v-model="addForm.specialty" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="职称" prop="position" :label-width="formLabelWidth">
                    <el-input v-model="addForm.position" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="入院时间" prop="comeTime" :label-width="formLabelWidth">
                    <el-date-picker v-model="addForm.comeTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="头像" :label-width="formLabelWidth">
                    <el-upload class="avatar-uploader"  :show-file-list="false"
                         :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" list-type="picture-card">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addDoctor()">确 定</el-button>
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
            addForm: {},
            dialogVisible: false,
            orgName: '',
            name: '',
            position: '',
            options: [],
            value: '',
            imageUrl:''
        }
    },
    methods: {
        beforeAvatarUpload(file) {
            //const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            // if (!isJPG) {
            //     this.$message.error('上传头像图片只能是 JPG 格式!');
            // }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            let fd = new FormData();//通过form数据格式来传
            fd.append("image", file); //传文件
            adminRequest({
                url: '/user/upload',
                method: 'post',
                data:fd
            }).then(res=>{
                this.imageUrl=res.data.data
                console.log(this.imageUrl)
            })
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath)
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath)
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.queryDoctor()
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.queryDoctor()
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
        queryDoctor() {
            adminRequest({
                url: '/doctor/page',
                method: 'get',
                params: {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,
                    orgId: this.value,
                    name: this.name,
                    position: this.position
                }
            }).then(res => {
                this.tableData = res.data.data.records
                this.total = res.data.data.total
            })
        },
        queryOrg() {
            adminRequest({
                url: '/organization',
                method: 'get',
            }).then(res => {
                this.options = []
                res.data.data.map(item => {
                    const op = {}
                    op.label = item.name,
                        op.value = item.id
                    this.options.push(op)
                })
            })
        },
        handleEdit(row) {
            this.dialogFormVisible = true
            this.form = JSON.parse(JSON.stringify(row));
        },
        editDoctor() {
            this.dialogFormVisible = false
            adminRequest({
                url: '/doctor',
                method: 'put',
                data: this.form
            }).then(res => {
                this.$message.success('修改成功')
                this.queryDoctor()
            })
        },
        addDoctor() {
            this.dialogVisible = false
            this.addForm.img=this.imageUrl
            adminRequest({
                url: '/doctor',
                method: 'post',
                data: this.addForm
            }).then(res => {
                this.$message.success('添加成功')
                this.queryDoctor()
            })
        },
        deleteDoctor() {
            let selectedIds = this.multipleSelection.map(item => item.id);
            if (selectedIds.length === 0) {
                this.$message.error('请选择要删除的医生');
                return;
            }
            adminRequest({
                url: '/doctor',
                method: 'delete',
                data: selectedIds
            }).then(res => {
                this.$message.success('删除成功')
                this.queryDoctor()
            }).catch(err => {
                console.log(err)
            })
        },
        search() {
            this.queryDoctor()
        }
    },
    mounted() {
        this.queryOrg()
        this.queryDoctor()
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