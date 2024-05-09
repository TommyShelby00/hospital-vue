<template>
    <div>
        <div class="search">
            姓名<el-input v-model="name" size="small" placeholder="请输入" style="width: 200px;"></el-input>
            &nbsp;&nbsp;
            科室名&nbsp;<el-select v-model="value" placeholder="请选择" @change="qdc()" size="small">
                <el-option :key="null" :label="''" :value="null"></el-option>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            &nbsp;&nbsp;
            医生名&nbsp;<el-select v-model="value2" placeholder="请选择" size="small">
                <el-option :key="null" :label="''" :value="null"></el-option>
                <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            &nbsp;&nbsp;
            日期&nbsp; <el-date-picker v-model="date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                size="small">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" size="small" @click="search()">搜索</el-button>
        </div>
        <el-table ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="id" prop="id" width="70px" >
            </el-table-column>
            <el-table-column label="用户id" prop="userId" width="90px" >
            </el-table-column>
            <el-table-column label="科室名称" prop="orgName" width="120px" >
            </el-table-column>
            <el-table-column label="医生" prop="doctorName" width="90px" >
            </el-table-column>
            <el-table-column label="日期" prop="date" width="100px" >
            </el-table-column>
            <el-table-column label="开始时间" prop="beginTime" width="110px" >
            </el-table-column>
            <el-table-column label="结束时间" prop="endTime" width="110px" >
            </el-table-column>
            <el-table-column label="姓名" prop="name" width="90px" >
            </el-table-column>
            <el-table-column label="手机号" prop="phone" width="120px" >
            </el-table-column>
            <el-table-column label="身份证" prop="identity" width="90px" >
            </el-table-column>
            <el-table-column label="费用" prop="fee" width="80px" >
            </el-table-column>
            <el-table-column label="状态" prop="status" width="80px" >
                <template slot-scope="scope">
                    {{ scope.row.status === 0 ? '未支付' :
                       scope.row.status === 1 ? '已支付' :
                       scope.row.status === 2 ? '已取消' :
                       scope.row.status === 3 ? '已超时' :
                       scope.row.status === 4 ? '已完成' : 
                                    ''}}
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
            </div>
        </el-row>

        <el-dialog title="修改订单信息" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="id" prop="id" :label-width="formLabelWidth">
                    <el-input v-model="form.id" style="width: 200px;" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="用户id" prop="userId" :label-width="formLabelWidth">
                    <el-input v-model="form.userId" style="width: 200px;" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="科室名称" prop="orgId" :label-width="formLabelWidth">
                    <el-select v-model="form.orgId" placeholder="请选择" @change="queryDoc()">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="医生" prop="docName" :label-width="formLabelWidth">
                    <el-select v-model="form.doctorId" placeholder="请选择">
                        <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期" prop="date" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="预约时间段" :label-width="formLabelWidth">
                    <el-row>
                        <el-col :span="11">
                            <el-time-select v-model="form.beginTime" :picker-options="{
                                start: '08:30',
                                step: '00:15',
                                end: '18:30'
                            }" placeholder="选择时间">
                            </el-time-select>
                        </el-col>
                        <el-col class="line" :span="2" style="text-align: center;">-</el-col>
                        <el-col :span="11">
                            <el-time-select v-model="form.endTime" :picker-options="{
                                start: '08:30',
                                step: '00:15',
                                end: '18:30'
                            }" placeholder="选择时间">
                            </el-time-select>
                        </el-col>
                    </el-row>
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
                <el-form-item label="费用" prop="fee" :label-width="formLabelWidth">
                    <el-input v-model="form.fee" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
                    <el-radio v-model="form.status" label=0>未支付</el-radio>
                    <el-radio v-model="form.status" label=1>已支付</el-radio>
                    <el-radio v-model="form.status" label=2>已取消</el-radio>
                    <el-radio v-model="form.status" label=3>已超时</el-radio>
                    <el-radio v-model="form.status" label=4>已完成</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editOrder()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="发布排班" :visible.sync="dialogVisible">
            <el-form :model="addForm">
                <el-form-item label="科室名称" prop="orgId" :label-width="formLabelWidth">
                    <el-select v-model="addForm.orgId" placeholder="请选择" @change="qdc2()">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="医生" prop="docName" :label-width="formLabelWidth">
                    <el-select v-model="addForm.doctorId" placeholder="请选择">
                        <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期" prop="date" :label-width="formLabelWidth">
                    <el-date-picker v-model="addForm.date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="预约时间段" :label-width="formLabelWidth">
                    <el-row>
                        <el-col :span="11">
                            <el-time-select v-model="addForm.beginTime" :picker-options="{
                                start: '08:30',
                                step: '00:15',
                                end: '18:30'
                            }" placeholder="选择时间">
                            </el-time-select>
                        </el-col>
                        <el-col class="line" :span="2" style="text-align: center;">-</el-col>
                        <el-col :span="11">
                            <el-time-select v-model="addForm.endTime" :picker-options="{
                                start: '08:30',
                                step: '00:15',
                                end: '18:30'
                            }" placeholder="选择时间">
                            </el-time-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="余号" prop="remind" :label-width="formLabelWidth">
                    <el-input v-model="addForm.remind" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="费用" prop="fee" :label-width="formLabelWidth">
                    <el-input v-model="addForm.fee" style="width: 200px;"></el-input>
                </el-form-item>
                <!-- <el-form-item label="头像" :label-width="formLabelWidth">
                    <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" list-type="picture-card">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSch()">确 定</el-button>
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
        handleSizeChange(val) {
            this.pageSize = val
            this.queryOrder()
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.queryOrder()
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
        queryOrder() {
            adminRequest({
                url: '/order/page',
                method: 'get',
                params: {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,
                    name: this.name,
                    orgId: this.value,
                    doctorId: this.value2,
                    date: this.date
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
        queryDoc() {
            adminRequest({
                url: '/doctor',
                method: 'get',
                params: {
                    id: this.form.orgId
                }
            }).then(res => {
                this.options2 = []
                res.data.data.map(item => {
                    const op = {}
                    op.label = item.name
                    op.value = item.id
                    this.options2.push(op)
                })
            })
        },
        qdc() {
            adminRequest({
                url: '/doctor',
                method: 'get',
                params: {
                    id: this.value
                }
            }).then(res => {
                this.options2 = []
                res.data.data.map(item => {
                    const op = {}
                    op.label = item.name
                    op.value = item.id
                    this.options2.push(op)
                })
            })
        },
        qdc2() {
            adminRequest({
                url: '/doctor',
                method: 'get',
                params: {
                    id: this.addForm.orgId
                }
            }).then(res => {
                this.options2 = []
                res.data.data.map(item => {
                    const op = {}
                    op.label = item.name
                    op.value = item.id
                    this.options2.push(op)
                })
            })
        },
        handleEdit(row) {
            this.dialogFormVisible = true
            this.form = JSON.parse(JSON.stringify(row))
            this.queryDoc()
        },
        editOrder() {
            this.dialogFormVisible = false
            adminRequest({
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
            adminRequest({
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
        this.queryOrg()
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