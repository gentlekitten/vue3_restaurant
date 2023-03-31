<template>
    <div class="container">
        <div class="date_picker">
            <span>选择时间：</span>
            <el-date-picker
                v-model="selectTime"
                type="daterange"
                unlink-panels
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"
                :shortcuts="timeList"
            ></el-date-picker>
            <el-button class="btn" type="primary" @click="getRunningWater">搜索</el-button>
        </div>
        <div class="card_group">
            <card-item :cardData="cardData" />
        </div>
        <el-table class="table" :data="tableData" highlight-current-row stripe style="width: 100%">
            <el-table-column type="index" label="#" width="50" />
            <el-table-column prop="goodsName" label="菜品名" />
            <el-table-column prop="categoryName" label="类别" width="180" />
            <el-table-column prop="goodsPrice" label="单价" width="120" />
            <el-table-column prop="sale" label="数量" width="100" />
            <el-table-column prop="createTime" label="下单时间" width="250" />
            <el-table-column prop="type" label="方式" width="100">
                <template #default="scope">{{ scope.row.type === 1 ? '会员' : '普通' }}</template>
            </el-table-column>
            <el-table-column prop="type" label="优惠金额" width="100">
                <template
                    #default="scope"
                >{{ scope.row.discountPrice ? scope.row.discountPrice : 0 }}</template>
            </el-table-column>
            <el-table-column prop="state" label="状态" width="100">
                <template #default="scope">{{ scope.row.state === 1 ? '上架' : '下架' }}</template>
            </el-table-column>
            <el-table-column prop="goodsPrice" label="总价" width="120">
                <template
                    #default="scope"
                >{{ (scope.row.sale * 100000 * scope.row.goodsPrice / 100000) - (scope.row.discountPrice ? scope.row.discountPrice : 0) }}</template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            class="pagination"
            v-model:currentPage="currentPage"
            :page-sizes="pageSizes"
            :page-size="currentData"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        ></el-pagination>
    </div>
</template>
<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router';
import { upData } from '@/api';
import { store } from '@/store';
import CardItem from '@/components/common/Card.vue'
import money from '@/assets/image/money.png'
import order from '@/assets/image/order.png'
import _ from 'lodash'
const { proxy } = getCurrentInstance() as any
// 选择的时间
const selectTime = ref('')
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
const route = useRoute()
// console.log(route)
const pageSizes = ref([5, 10, 15, 20])
const pageSizesClone = ref([5, 10, 15, 20])
// 当前第几页
const currentPage = ref(1)
// 多少条数据一页
const currentData = ref(5)
// 总数
let totalPage = ref(0)
// 表格数据
const tableData = ref([])
// Cart数据
const cardData = ref([
    {
        title: '交易金额',
        number: '0',
        imgUrl: money,
        class: 'red'
    },
    {
        title: '份数',
        imgUrl: order,
        number: '0',
        class: 'yellow'
    }
])
// 多少条数据每页改变
const handleSizeChange = (val: any) => {
    currentData.value = val
    getRunningWater()
}
// 当前页改变
const handleCurrentChange = (val: any) => {
    getRunningWater()
}
// 选择的事件搜索店铺该段时间的流水
const getRunningWater = async () => {
    if (!selectTime.value) return proxy.$message.warning('请选择时间段！')
    pageSizes.value = _.clone(pageSizesClone.value)
    // 总金额
    let total = 0
    // 获取多少条数据
    const pageTotal = currentData.value
    // 数据开始下标
    const pageIndex = (currentPage.value - 1) * pageTotal
    // 时间
    const startTime = formatDataTime(selectTime.value[0])
    const endTime = formatDataTime(selectTime.value[1])
    console.log(startTime)
    // const time = (Number(selectTime.value[1]) - Number(selectTime.value[0])) / 86400000
    const res = await upData('/analysis/getRunningWater', {
        startTime,
        endTime,
        pageIndex: pageIndex,
        pageTotal: pageTotal
    }) as any
    console.log(res);
    if (res.code === 200) {
        if (res.data.goodsList && res.data.goodsList.length > 0) {
            res.data.goodsList.forEach((item: any) => {
                item.goodsState = item.state === 1 ? true : false
                item.createTime = formatDataTime(item.createTime)
                total += item.goodsPrice * item.num
            })
            tableData.value = res.data.goodsList
            // 获取菜品总数
            totalPage.value = res.data.total
            cardData.value[1].number = res.data.totalSale
            cardData.value[0].number = '￥' + res.data.totalPrice
            // 根据总数更改分页数组使最后一个是全部数据
            if (totalPage.value >= pageSizes.value[3]) return pageSizes.value.push(Number(totalPage.value))
            pageSizes.value.forEach((item: any, index: number) => {
                if (item >= totalPage.value) {
                    pageSizes.value[index] = Number(totalPage.value)
                    pageSizes.value.splice(index + 1, 3 - index)
                    return
                }
            })
            return
        }
        tableData.value = []
        return
    }
    tableData.value = []
    proxy.$message.error('餐厅流水获取失败！')

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
.date_picker {
    margin-left: 200px;
    span {
        color: #666;
    }
    .btn {
        margin-left: 60px;
    }
}
.pagination {
    margin-top: 50px;
}
.card_group {
    display: flex;
    justify-content: space-around;
    margin: 50px 0;
    // background-color: #f0f2f5;
    // padding: 50px;
}
</style>
