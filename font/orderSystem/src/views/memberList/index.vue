<template>
    <!-- 表格 -->
    <el-table :data="tableData" show-header highlight-current-row style="width: 100%" stripe>
        <el-table-column type="index" label="#" width="50" />
        <el-table-column label="会员号" prop="memberId" />
        <el-table-column label="用户名" prop="username" width="200" />
        <el-table-column label="充值时间" prop="createTime" width="220" />
        <el-table-column label="到期时间" prop="endTime" width="220" />
        <el-table-column align="right" label="操作" width="250">
            <template #header>
                <el-input v-model="searchValue" size="mini" clearable placeholder="输入商品名进行搜索" />
            </template>
            <template #default="scope">
                <el-button
                    size="mini"
                    type="primary"
                    @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button>
                <el-button
                    size="mini"
                    type="success"
                    @click="handleRenew(scope.$index, scope.row)"
                >续费</el-button>
                <!-- 确认弹出框 -->
                <el-popconfirm
                    confirm-button-text="确认"
                    cancel-button-text="取消"
                    icon="el-icon-info"
                    icon-color="red"
                    title="确定删除该会员吗？"
                    @confirm="confirmDelete(scope.row.memberId, scope.$index)"
                    @cancel="cancelDelete"
                >
                    <template #reference>
                        <el-button size="mini" type="danger">删除</el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
        class="pagination"
        v-model:currentPage="currentPage"
        :page-sizes="[5, 10, 15, 20, 100]"
        :page-size="currentData"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    ></el-pagination>
    <!-- 编辑弹出框 -->
    <el-dialog v-model="dialogFormVisible" title="编辑会员">
        <el-form ref="ruleForm" :model="formData" :rules="formRules">
            <el-form-item label="用户名" label-width="120px" prop="username">
                <el-input
                    v-model="formData.username"
                    autocomplete="off"
                    clearable
                    placeholder="请输入用户名"
                ></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editMember">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 续费弹出框 -->
    <el-dialog v-model="renewDialogVisible" title="编辑会员">
        <el-form ref="renewRuleForm" :model="renewFormData" :rules="renewFormRules">
            <el-form-item label="续费时间" label-width="120px" prop="time">
                <el-select v-model="renewFormData.time" placeholder="选择有效期">
                    <el-option
                        v-for="item in timeSelect"
                        :key="item.id"
                        :label="item.time"
                        :value="item.time"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="renewDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmRenew">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, watch, getCurrentInstance, onMounted } from 'vue'
import { upData } from '@/api';
import _ from 'lodash';
const { proxy } = getCurrentInstance() as any
// 搜索值
const searchValue = ref('')
// 当前第几页
const currentPage = ref(1)
// 多少条数据一页
const currentData = ref(5)
// 总数
let totalPage = ref(0)
// 组件的refs
const ruleForm = ref('') as any
const renewRuleForm = ref('') as any
// 是否显示编辑弹出层
let dialogFormVisible = ref(false)
// 是否显示续费弹出层
let renewDialogVisible = ref(false)
// 编辑表单数据
const formData = ref({
    username: '',
    memberId: ''
})
// 续费表单数据
const renewFormData = ref({
    time: '',
    memberId: ''
})
// 时间列表
const timeSelect = ref([
    {
        id: 1,
        time: '一年'
    },
    {
        id: 2,
        time: '半年'
    },
    {
        id: 3,
        time: '一季度'
    }
]
) as any
// 表格数据
const tableData = ref([]) as any
const tableDataClone = ref([]) as any
// 编辑表单验证规则
const formRules = ref({
    username: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
        },
        {
            min: 2,
            max: 10,
            message: '用户名长度在2~10个字符',
            trigger: 'blur',
        },
    ],
})
// 续费表单验证规则
const renewFormRules = ref({
    time: [
        {
            required: true,
            message: '请输入续费时间',
            trigger: 'blur',
        }
    ],
})

onMounted(() => {
    getMemberList()
})
// 处理编辑
const handleEdit = (index: number, row: any) => {
    formData.value.username = row.username
    formData.value.memberId = row.memberId
    dialogFormVisible.value = true
}
// 处理续费
const handleRenew = (index: number, row: any) => {
    renewFormData.value.memberId = row.memberId
    renewDialogVisible.value = true
}
// 确认删除
const confirmDelete = async (memberId: number, index: number) => {
    const res = await upData('member/deleteMember', { memberId }) as any
    console.log(res)
    if (res.code === 200) {
        tableData.value.splice(index, 1)
        proxy.$message.success('删除成功！')
        return
    }
    proxy.$message.error('删除失败！')
}
// 确认弹出框取消
const cancelDelete = () => { }
// 确认续费
const confirmRenew = async () => {
    renewRuleForm.value.validate(async (valid: any) => {
        if (valid) {
            const res = await upData('member/renewMember', renewFormData.value) as any
            console.log(res)
            if (res.code === 200) {
                getMemberList()
                renewDialogVisible.value = false
                proxy.$message.success('续费成功！')
                return
            }
            proxy.$message.error('续费失败！')
        }
    })
}
// 确认编辑
const editMember = () => {
    ruleForm.value.validate(async (valid: any) => {
        if (valid) {
            const res = await upData('member/editMember', formData.value) as any
            console.log(res);
            if (res.code === 200) {
                getMemberList()
                dialogFormVisible.value = false
                formData.value.username = ''
                proxy.$message.success('修改成功！')

                return
            }
            proxy.$message.error('修改失败！')
        }
    })
}
// 多少条数据每页改变
const handleSizeChange = (val: any) => {
    currentData.value = val
    getMemberList()
}
// 当前页改变
const handleCurrentChange = (val: any) => {
    getMemberList()
}
// 监听搜索值进行搜索
watch(() => searchValue.value, () => {
    if (!searchValue.value) {
        tableData.value = tableDataClone.value
        return
    }
    tableData.value = tableData.value.filter(
        (data: any) =>
            data.username.toLowerCase().includes(searchValue.value.toLowerCase())
    )
})
// 获取会员列表
const getMemberList = async () => {
    // 获取多少条数据
    const pageTotal = currentData.value
    // 数据开始下标
    const pageIndex = (currentPage.value - 1) * pageTotal
    const res = await upData('member/getMemberList', { pageIndex, pageTotal }) as any
    console.log(res)
    if (res.code === 200) {
        if (res.data.goodsList && res.data.goodsList.length > 0) {
            res.data.goodsList.forEach((item: any) => {
                item.createTime = formatDataTime(item.createTime)
                item.endTime = formatDataTime(item.endTime)
            })
            tableData.value = res.data.goodsList
            tableDataClone.value = _.cloneDeep(tableData.value)
            // 获取菜品总数
            totalPage.value = res.data.total
        }
        return
    }
    proxy.$message.error('菜品列表获取失败！')
}
// 格式化datatime
const formatDataTime = (time: any) => {
    const date = new Date(time)
    const value = date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' +
        date.getDate() + ' ' +
        date.getHours() + ':' +
        date.getMinutes() + ':' +
        date.getSeconds();
    return value
}
</script>
<style lang="scss" scoped>
.pagination {
    margin-top: 20px;
}
.goods_img {
    width: 50px;
    height: 50px;
}
</style>
