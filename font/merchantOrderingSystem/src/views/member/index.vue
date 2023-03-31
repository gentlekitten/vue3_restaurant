<template>
    <div class="container">
        <div class="order_list">
            <div class="title">菜品类别</div>
            <list-item
                v-if="categoryList.length > 0"
                from="goodslist"
                :orderList="categoryList"
                @clickOrder="clickCategory"
            />
            <el-empty v-else :image-size="200"></el-empty>
        </div>
        <div class="order_value">
            <header>
                <el-form
                    :inline="true"
                    class="form"
                    ref="searchRuleForm"
                    :model="formData"
                    :rules="formRules"
                    label-width="100px"
                >
                    <el-form-item label="搜索：">
                        <el-input v-model="formData.searchVaue" clearable placeholder="请输入菜品名"></el-input>
                    </el-form-item>
                </el-form>
                <el-form
                    :inline="true"
                    class="form"
                    ref="ruleForm"
                    :model="formData"
                    :rules="formRules"
                    label-width="100px"
                >
                    <el-form-item label="座位号：" prop="seat">
                        <el-input v-model="formData.seat" clearable placeholder="请填写座位号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="btn" type="primary" @click="addOrder">添加至订单</el-button>
                    </el-form-item>
                </el-form>
                <el-button
                    class="btn"
                    type="primary"
                    @click="selectedGoodsDialogVisible = true"
                >查看已选菜品</el-button>
            </header>
            <goods-list
                v-if="goodsList.length > 0"
                :goodsList="goodsList"
                from="goodslist"
                @addGoods="addGoods"
            />
            <el-empty v-else :image-size="200"></el-empty>
        </div>
    </div>
    <!-- 已选菜品弹出层 -->
    <el-dialog v-model="selectedGoodsDialogVisible" title="已选菜品列表">
        <el-table :data="selectedGoodsList" stripe>
            <el-table-column type="index" label="#" width="50"></el-table-column>
            <el-table-column property="goodsName" label="菜品名"></el-table-column>
            <el-table-column property="goodsPrice" label="菜品价格" width="200"></el-table-column>
            <el-table-column property="goodsNum" label="菜品数量" width="300">
                <template #default="scope">
                    <el-input-number size="mini" v-model="scope.row.goodsNum" :min="1" />
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="scope">
                    <el-button
                        size="mini"
                        type="danger"
                        @click="deleteSelectedGoods(scope.$index, scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>
<script setup lang="ts">
import ListItem from '@/components/order/ListItem.vue';
import GoodsList from '@/components/order/GoodsList.vue';
import { ref, getCurrentInstance, onMounted, watch } from 'vue';
import { upData } from '@/api/index'
import _ from 'lodash'
name: 'GoodsList'
const { proxy } = getCurrentInstance() as any
// 已选菜品弹出框
const selectedGoodsDialogVisible = ref(false)
// 表单数据
const formData = ref({
    seat: '',
    searchVaue: ''
})
// 添加订单表单ref
const ruleForm = ref('') as any
// 搜索表单ref
const searchRuleForm = ref('') as any
// 表单规则
const formRules = ref({
    seat: [
        {
            required: true,
            message: '请输入座位号',
            trigger: 'blur',
        },
    ]
})
// 点击菜品类别获取菜品
const categoryList = ref([]) as any
// 当前订单菜品列表
const goodsList = ref([]) as any
const goodsListClone = ref([]) as any
// 
const selectedGoodsList = ref([]) as any
onMounted(() => {
    getCategoryList()
})
const clickCategory = async (obj: any) => {
    const { categoryName } = obj
    const res = await upData('/goods/getGoodsBycategory', { categoryName }) as any
    console.log(res);
    if (res.code === 200) {
        goodsList.value = res.data
        goodsList.value.forEach((item: any) => {
            // 会员九折，item.goodsPrice * 100000 * 0.9 / 100000这样书写是为了解决js有小数相乘出现很多位小数
            item.goodsPrice = item.goodsPrice * 100000 * 0.9 / 100000
            // 保留两位小数并且不四舍五入
            item.goodsPrice = Math.floor(item.goodsPrice * 100) / 100
        })
        console.log(goodsList.value)
        // 深拷贝
        goodsListClone.value = _.cloneDeep(goodsList.value)
        return
    }
    proxy.$message.error('菜品获取失败！')
}
// 添加菜单
const addOrder = () => {
    ruleForm.value.validate(async (valid: any) => {
        if (valid) {
            if (selectedGoodsList.value.length <= 0) {
                return proxy.$message.error('你还未添加任何菜品！')
            }
            // 将字符串中\\换为/
            selectedGoodsList.value.forEach((item: any) => {
                item.goodsImg = item.goodsImg.replace(/\\/g, "/")
            })
            const res = await upData('/order/addOrder', { seat: formData.value.seat, goodsList: selectedGoodsList.value, type: 1 }) as any
            console.log(res);
            if (res.code === 200) {
                formData.value.seat = ''
                selectedGoodsList.value = []
                proxy.$message.success('订单添加成功!')
                return
            }
            proxy.$message.error('订单添加失败！')
        }
    })

}
// 添加菜品进入菜单中
const addGoods = (item: any) => {
    console.log(item)
    // 判断已选菜单中是否存在该商品，存在就只添加数量
    if (selectedGoodsList.value.some((i: any) => i.id === item.id)) {
        const index = selectedGoodsList.value.findIndex((i: any) => i.id === item.id)
        selectedGoodsList.value[index].goodsNum++
    } else {
        item.goodsNum = 1
        selectedGoodsList.value.push(item)
    }
    proxy.$message.success('添加成功!')
}
// 删除已选菜品列表里的菜品
const deleteSelectedGoods = (index: number, value: any) => {
    selectedGoodsList.value.splice(index, 1)
}
// 搜索菜品
const searchGoods = () => {
    goodsList.value = _.cloneDeep(goodsListClone.value)
    goodsList.value = goodsList.value.filter((item: any) =>
        item.goodsName.indexOf(formData.value.searchVaue) !== -1
    )
}
watch(() => formData.value.searchVaue, searchGoods)
// 获取菜品类别列表
const getCategoryList = async () => {
    const res = await upData('/goods/categoryList', {}) as any
    console.log(res);
    if (res.code === 200) {
        categoryList.value = res.data
        if (res.data.length > 0) {
            clickCategory({ categoryName: categoryList.value[0].categoryName })
        }
        return
    }
    proxy.$message.error('菜品类别获取失败！')
}
</script>
<style lang="scss" scoped>
.container {
    display: flex;
    height: 100%;
    overflow: hidden;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 200px;
    right: 0;
    .order_list {
        width: 400px;
        min-width: 300px;
        height: 100%;
        background-color: #fff;
        text-align: center;
        float: left;
        height: 100%;
        overflow-x: hidden;
        .title {
            border-bottom: 1px solid#eee;
            height: 60px;
            line-height: 60px;
            font-weight: 800;
            font-size: 25px;
            background-color: #3869aa;
            color: #fff;
        }
    }
    .order_value {
        width: 100%;
        height: 100%;
        background-color: #fafbfc;
        float: left;
        overflow-x: hidden;
        header {
            height: 80px;
            border-bottom: 1px solid #e7e7e7;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            .form {
                height: 100%;
                display: flex;
                align-items: center;
                margin-top: 20px;
            }
        }
    }
}
// 隐藏滚动条
.order_list::-webkit-scrollbar {
    display: none;
}
</style>
