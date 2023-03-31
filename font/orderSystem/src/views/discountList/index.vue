<template>
    <!-- 表格 -->
    <el-table :data="tableData" show-header highlight-current-row style="width: 100%" stripe>
        <el-table-column type="index" label="#" width="50" />
        <el-table-column label="活动内容" prop="discountContent" />
        <el-table-column label="优惠条件" prop="discountCondition" width="200">
            <template
                #default="scope"
            >{{ scope.row.discountCondition === 0 ? '无' : scope.row.discountCondition }}</template>
        </el-table-column>
        <el-table-column label="优惠价格" prop="discountPrice" width="220">
            <template
                #default="scope"
            >{{ scope.row.discountPrice === 0 ? '无' : scope.row.discountPrice }}</template>
        </el-table-column>
        <el-table-column label="开始时间" prop="createTime" width="220" />
        <el-table-column label="结束时间" prop="endTime" width="220" />
        <el-table-column label="状态" prop="isOverdue" width="100">
            <template
                #default="scope"
            >{{ scope.row.isStart === 0 ? '未开始' : scope.row.isOverdue === 0 ? '正在进行' : '已过期' }}</template>
        </el-table-column>
        <el-table-column label="类别" prop="type" width="100">
            <template #default="scope">{{ scope.row.type === 0 ? '条件活动' : '特殊活动' }}</template>
        </el-table-column>
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
                <!-- 确认弹出框 -->
                <el-popconfirm
                    confirm-button-text="确认"
                    cancel-button-text="取消"
                    icon="el-icon-info"
                    icon-color="red"
                    title="确定删除该活动吗？"
                    @confirm="confirmDelete(scope.row.id, scope.$index)"
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
            <el-form-item label="优惠时间">
                <el-date-picker
                    v-model="formData.selectTime"
                    type="daterange"
                    unlink-panels
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    :shortcuts="timeList"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="活动内容" prop="discountContent">
                <el-input v-model="formData.discountContent" placeholder="如五一活动满100减10"></el-input>
            </el-form-item>
            <el-form-item v-if="formData.type === 0" label="优惠条件" prop="discountCondition">
                <el-input
                    type="number"
                    v-model.number="formData.discountCondition"
                    placeholder="满多少的优惠价格"
                ></el-input>
            </el-form-item>
            <el-form-item v-if="formData.type === 0" label="优惠价格" prop="discountPrice">
                <el-input
                    type="number"
                    v-model.number="formData.discountPrice"
                    placeholder="请输入减免多少钱"
                ></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editDiscount">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, watch, getCurrentInstance, onMounted } from 'vue'
import { upData } from '@/api';
import _ from 'lodash';
const { proxy } = getCurrentInstance() as any
// 时间快捷选项
const timeList = ref([
    {
        text: '上周',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: '上个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: '过去三个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
])
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
// 是否显示编辑弹出层
let dialogFormVisible = ref(false)
// 保存当前时间
const createTime = ref('') as any
// 保存结束时间
const overTime = ref('') as any
// 编辑表单数据
let formData = ref({
    discountContent: '',
    discountPrice: '',
    discountCondition: '',
    id: '',
    selectTime: [] as any,
    type: 0
})
// 表格数据
const tableData = ref([]) as any
const tableDataClone = ref([]) as any
// 编辑表单验证规则
const formRules = ref({
    discountContent: [
        {
            required: true,
            message: '请输入活动内容',
            trigger: 'blur',
        },
        {
            min: 2,
            max: 100,
            message: '活动内容长度在2~100个字符',
            trigger: 'blur',
        },
    ],
    discountPrice: [
        {
            required: true,
            message: '请输入优惠价格',
            trigger: 'blur',
        },
    ],
    discountCondition: [
        {
            required: true,
            message: '请输入优惠条件',
            trigger: 'blur',
        }
    ]
})

onMounted(() => {
    getDiscountList()
})
// 处理编辑
const handleEdit = (index: number, row: any) => {
    formData.value.discountContent = row.discountContent
    formData.value.discountPrice = row.discountPrice
    formData.value.discountCondition = row.discountCondition
    formData.value.selectTime[0] = row.createTime
    formData.value.selectTime[1] = row.endTime
    createTime.value = row.createTime
    overTime.value = row.endTime
    formData.value.id = row.id
    formData.value.type = row.type
    dialogFormVisible.value = true
}
// 确认删除
const confirmDelete = async (id: number, index: number) => {
    const res = await upData('discount/deleteDiscountList', { id }) as any
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
// 续费弹出框取消
const cancelRenew = () => { }
// 确认编辑
const editDiscount = () => {
    ruleForm.value.validate(async (valid: any) => {
        if (valid) {
            let timeIsChange = 0
            const startTime = formatDataTime(formData.value.selectTime[0])
            const endTime = formatDataTime(formData.value.selectTime[1])
            if (createTime.value !== startTime || overTime.value !== endTime) timeIsChange = 1
            console.log(timeIsChange)
            const res = await upData('discount/editDiscountList', {
                ...formData.value,
                startTime,
                endTime,
                timeIsChange
            }) as any
            console.log(res);
            if (res.code === 200) {
                getDiscountList()
                dialogFormVisible.value = false
                formData.value = {
                    discountContent: '',
                    discountPrice: '',
                    discountCondition: '',
                    selectTime: [],
                    id: '',
                    type: 0
                }
                proxy.$message.success('修改成功！')

                return
            }
            proxy.$message.error(res.msg)
        }
    })
}
// 多少条数据每页改变
const handleSizeChange = (val: any) => {
    currentData.value = val
    getDiscountList()
}
// 当前页改变
const handleCurrentChange = (val: any) => {
    getDiscountList()
}
// 监听搜索值进行搜索
watch(() => searchValue.value, () => {
    if (!searchValue.value) {
        tableData.value = tableDataClone.value
        return
    }
    tableData.value = tableData.value.filter(
        (data: any) =>
            data.discountContent.toLowerCase().includes(searchValue.value.toLowerCase())
    )
})
// 获取菜品列表
const getDiscountList = async () => {
    // 获取多少条数据
    const pageTotal = currentData.value
    // 数据开始下标
    const pageIndex = (currentPage.value - 1) * pageTotal
    const res = await upData('discount/getDiscountList', { pageIndex, pageTotal }) as any
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
