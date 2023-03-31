<template>
    <!-- 表格 -->
    <el-table :data="tableData" show-header highlight-current-row style="width: 100%" stripe>
        <el-table-column type="index" label="#" width="50" />
        <el-table-column label="图片" prop="goodsImg" width="100">
            <template #default="scope">
                <img class="goods_img" :src="'http://localhost:3000/' + scope.row.goodsImg" />
            </template>
        </el-table-column>
        <el-table-column label="菜品名" prop="goodsName" />
        <el-table-column label="类别" prop="categoryName" width="300" />
        <el-table-column label="价格" prop="goodsPrice" width="100" />
        <el-table-column label="状态" prop="state" width="220">
            <template #default="scope">
                <el-switch
                    v-model="scope.row.goodsState"
                    :active-text="scope.row.state === 1 ? '上架' : ''"
                    :inactive-text="scope.row.state === 1 ? '' : '下架'"
                    :loading="switchIsLoading"
                    @change="goodsStateChange(scope.row)"
                ></el-switch>
            </template>
        </el-table-column>
        <el-table-column align="right" label="操作" width="220">
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
                    title="确定删除该商品吗？"
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
    <el-dialog v-model="dialogFormVisible" title="编辑菜品">
        <el-form ref="ruleForm" :model="formData" :rules="formRules">
            <el-form-item label="商品名" label-width="120px" prop="goodsName">
                <el-input
                    v-model="formData.goodsName"
                    autocomplete="off"
                    clearable
                    placeholder="请输入商品名"
                ></el-input>
            </el-form-item>
            <el-form-item label="类别" label-width="120px" prop="category">
                <el-select v-model="formData.category" placeholder="请选择一个类别">
                    <el-option
                        v-for="item in categoryList"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.categoryName"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="价格" label-width="120px" prop="goodsPrice">
                <el-input
                    type="number"
                    v-model.number="formData.goodsPrice"
                    autocomplete="off"
                    clearable
                    placeholder="请输入商品价格"
                ></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editGoods">确定</el-button>
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
// 是否开启switch加载动画
const switchIsLoading = ref(false)
// 当前第几页
const currentPage = ref(1)
// 多少条数据一页
const currentData = ref(5)
// 总数
let totalPage = ref(0)
// 组件的refs
const ruleForm = ref('') as any
// 商品类别列表
const categoryList = ref({}) as any
// 是否显示编辑弹出层
let dialogFormVisible = ref(false)
// 编辑表单数据
let formData = ref({
    goodsName: '',
    category: '',
    goodsPrice: 0,
    id: 0
})
// 表格数据
const tableData = ref([]) as any
const tableDataClone = ref([]) as any
// 编辑表单验证规则
const formRules = ref({
    goodsName: [
        {
            required: true,
            message: '请输入商品名',
            trigger: 'blur',
        },
        {
            min: 3,
            max: 12,
            message: '用户名长度在3~12个字符',
            trigger: 'blur',
        },
    ],
    category: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
        },
    ],
    goodsPrice: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
        },
    ]
})

onMounted(() => {
    getGoodsList()
    getCategoryList()
})
// 处理编辑
const handleEdit = (index: number, row: any) => {
    formData.value.category = row.categoryName
    formData.value.goodsName = row.goodsName
    formData.value.goodsPrice = row.goodsPrice
    formData.value.id = row.id
    dialogFormVisible.value = true
}
// 确认删除
const confirmDelete = async (id: number, index: number) => {
    const res = await upData('goods/deleteGoods', { id }) as any
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
// 确认编辑
const editGoods = () => {
    ruleForm.value.validate(async (valid: any) => {
        if (valid) {
            const res = await upData('goods/updateGoods', formData.value) as any
            console.log(res);
            switchIsLoading.value = false
            if (res.code === 200) {
                getGoodsList()
                dialogFormVisible.value = false
                formData.value.goodsName = ''
                formData.value.category = ''
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
    getGoodsList()
}
// 当前页改变
const handleCurrentChange = (val: any) => {
    getGoodsList()
}
// 商品状态改变
const goodsStateChange = async (value: any) => {
    const state = value.goodsState ? 1 : 0
    value.state = state
    switchIsLoading.value = true
    const res = await upData('goods/updateState', { state, id: value.id }) as any
    console.log(res);
    switchIsLoading.value = false
    if (res.code === 200) {
        proxy.$message.success('修改成功！')
        return
    }
    value.goodsState = !value.goodsState
    proxy.$message.error('修改失败！')
}
// 监听搜索值进行搜索
watch(() => searchValue.value, () => {
    if (!searchValue.value) {
        tableData.value = tableDataClone.value
        return
    }
    tableData.value = tableData.value.filter(
        (data: any) =>
            data.goodsName.toLowerCase().includes(searchValue.value.toLowerCase())
    )
})
// 获取菜品类别列表
const getCategoryList = async () => {
    const res = await upData('/goods/categoryList', {}) as any
    console.log(res);

    if (res.code === 200) {
        categoryList.value = res.data
        return
    }
    proxy.$message.error('菜品类别获取失败！')
}
// 获取菜品列表
const getGoodsList = async () => {
    // 获取多少条数据
    const pageTotal = currentData.value
    // 数据开始下标
    const pageIndex = (currentPage.value - 1) * pageTotal
    const res = await upData('goods/goodsList', { pageIndex, pageTotal }) as any
    console.log(res)
    if (res.code === 200) {
        if (res.data.goodsList && res.data.goodsList.length > 0) {
            res.data.goodsList.forEach((item: any) => {
                item.goodsState = item.state === 1 ? true : false
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
