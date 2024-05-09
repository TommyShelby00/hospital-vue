<template>
    <div>
        <div class="search">
            用户名&nbsp;<el-input placeholder="请输入" v-model="username" style="width: 200px;" size="small"></el-input>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            手机号&nbsp;<el-input placeholder="请输入" v-model="phone" style="width: 200px;" size="small"></el-input>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            年龄&nbsp;<el-input placeholder="请输入" v-model="age" style="width: 200px;" size="small"></el-input>
            <el-button type="primary" icon="el-icon-search" size="small" @click="search()">搜索</el-button>
        </div>
        <el-table ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="用户id" prop="id" width="200px">
            </el-table-column>
            <el-table-column prop="avatar" label="头像">
                <template slot-scope="scope">
                    <el-image :src="scope.row.avatar" style="width: 50px; height: 50px"></el-image>
                </template>
            </el-table-column>
            <el-table-column label="用户名" prop="username" >
            </el-table-column>
            <el-table-column label="密码" prop="password">
            </el-table-column>
            <el-table-column label="手机号" prop="phone">
            </el-table-column>
            <el-table-column label="性别" prop="gender" >
                <template slot-scope="scope">
                    {{ scope.row.gender === 1 ? '男' : '女' }}
                </template>
            </el-table-column>
            <el-table-column label="年龄" prop="age" >
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
                <el-button @click="deleteUser()" size="mini" type="danger">删除</el-button>
                <el-button @click="banUser()" size="mini" type="danger">封禁</el-button>
            </div>
        </el-row>

        <el-dialog title="更改用户信息" :visible.sync="dialogFormVisible" label-position="right">
            <el-form :model="form">
                <el-form-item label="用户id" prop="id" :label-width="formLabelWidth">
                    <el-input v-model="form.id" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
                    <el-input v-model="form.username" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
                    <el-input v-model="form.password" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone" :label-width="formLabelWidth">
                    <el-input v-model="form.phone" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth">
                    <el-radio v-model="form.gender" :label='1'>男</el-radio>
                    <el-radio v-model="form.gender" :label='2'>女</el-radio>
                </el-form-item>
                <el-form-item label="年龄" prop="age" :label-width="formLabelWidth">
                    <el-input v-model="form.age" style="width: 200px;"></el-input>
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
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser()">确更改</el-button>
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
            input: '',
            username: '',
            phone: '',
            age: '',
            formLabelWidth: '120px',
            imageUrl:''
        }
    }, methods: {
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
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
        queryUser() {
            adminRequest({
                url: '/admin/queryUser',
                method: 'get',
                params: {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,
                    username: this.username,
                    phone: this.phone,
                    age: this.age
                }
            }).then(res => {
                this.tableData = res.data.data.records
                this.total = res.data.data.total
            })
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
        deleteUser() {
            let selectedIds = this.multipleSelection.map(item => item.id);
            if (selectedIds.length === 0) {
                this.$message.error('请选择要删除的账号');
                return;
            }
            adminRequest({
                url: '/admin/user',
                method: 'delete',
                data: selectedIds
            }).then(res => {
                this.$message.success('删除成功')
                this.queryUser()
            }).catch(err => {
                console.log(err)
            })
        },
        banUser() {
            let selectedIds = this.multipleSelection.map(item => item.id);
            if (selectedIds.length === 0) {
                this.$message.error('请选择要封禁的账号');
                return;
            }
            adminRequest({
                url: '/admin/ban',
                method: 'post',
                data: selectedIds
            }).then(res => {
                this.$message.success('封禁成功')
            })
        },
        handleEdit(row) {
            this.dialogFormVisible = true
            this.form = JSON.parse(JSON.stringify(row));
        },
        editUser() {
            this.form.avatar=this.imageUrl
            this.dialogFormVisible = false
            adminRequest({
                url: '/admin/2',
                method: 'put',
                data: this.form
            }).then(res => {
                this.$message.success('修改成功')
                this.queryUser()
            })
        }, search() {
            this.queryUser()
        }
    }, mounted() {
        this.queryUser()
    }, actions: {
        upload() {
            adminRequest()
        }
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