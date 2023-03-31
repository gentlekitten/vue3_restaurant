<template>
    <div class="container">
        <div class="order_list">
            <div class="title">订单列表</div>
            <list-item
                v-if="orderList.length > 0"
                from="order"
                :orderList="orderList"
                @clickOrder="clickOrder"
            />
            <el-empty v-else :image-size="200"></el-empty>
        </div>
        <div class="order_value">
            <header>
                <span>{{ seatNum }}号</span>
                <span
                    v-if="discountObj && Object.keys(discountObj).length > 0"
                >当前活动：{{ discountObj.discountContent }}</span>
                <div class="btn_group">
                    <el-button class="btn" type="primary" @click="confirmOrder">确认订单</el-button>
                    <el-popconfirm
                        title="确定删除该订单?"
                        confirmButtonText="确认"
                        cancelButtonText="取消"
                        @confirm="deleteOrder('订单删除')"
                    >
                        <template #reference>
                            <el-button type="danger">删除订单</el-button>
                        </template>
                    </el-popconfirm>
                </div>
            </header>
            <div class="goods">
                <div class="goods_num">
                    <span>共{{ goodsList.length }}道菜</span>
                    <span>金额：{{ getTotalPrice }}元</span>
                </div>
                <goods-list v-if="goodsList.length > 0" form="order" :goodsList="goodsList" />
                <el-empty v-else :image-size="200"></el-empty>
            </div>
        </div>
    </div>
    <!-- 特殊活动减免价格弹出层 -->
    <el-dialog
        v-if="discountObj && Object.keys(discountObj).length > 0"
        v-model="discountDialogVisible"
        :title="'是否满足优惠活动(无填0)：' + discountObj.discountContent"
    >
        <el-form :model="formData" :rules="formRules">
            <el-form-item label="减免价格：" label-width="100px" prop="discountPrice">
                <el-input
                    v-model="formData.discountPrice"
                    type="number"
                    autocomplete="off"
                    placeholder="请输入活动的减免价格"
                ></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="handleConfirmOrder">提交</el-button>
                <el-button @click="discountDialogVisible = false">取消</el-button>
            </span>
        </template>
    </el-dialog>
    <el-backtop :visibility-height="100" />
</template>
<script setup lang="ts">
import { ref, watch, computed, getCurrentInstance, onMounted } from 'vue';
import ListItem from '@/components/order/ListItem.vue';
import GoodsList from '@/components/order/GoodsList.vue';
import { upData } from '@/api/index'
const { proxy } = getCurrentInstance() as any
// 当前订单座位号
const seatNum = ref(0)
// 订单列表
const orderList = ref([]) as any
// 当前订单菜品列表
const goodsList = ref([]) as any
// 优惠活动对象
const discountObj = ref({}) as any
// 表单数据
const formData = ref({
    discountPrice: ''
}) as any
// 是否优惠
const isDiscount = ref(false) as any
// 特殊活动弹出层是否显示
const discountDialogVisible = ref(false)
// 
const formRules = ref({
    discountPrice: [
        {
            required: true,
            message: '请输入减免价格',
            trigger: 'blur',
        },
    ],
})
onMounted(() => {
    getOrderList()
    getDiscount()
})
// 获取当前订单总价
const getTotalPrice = computed(() => {
    let totalPrice = 0
    goodsList.value.forEach((item: any) => totalPrice += Math.floor(item.goodsPrice * item.goodsNum * 100) / 100)
    console.log(totalPrice)
    // 判断是否有优惠和是否满足优惠条件
    if (
        discountObj.value &&
        Object.keys(discountObj.value).length > 0
        && discountObj.value.type === 0
        && totalPrice >= discountObj.value.discountCondition
    ) {
        totalPrice -= parseFloat(discountObj.value.discountPrice)
        totalPrice = Math.floor(totalPrice * 100) / 100
        isDiscount.value = true
    }
    return totalPrice
})
// 确认订单
const confirmOrder = async () => {
    if (goodsList.value.length <= 0) return proxy.$message.warning('没有订单可以确认！')
    if (discountObj.value &&
        Object.keys(discountObj.value).length > 0
        && discountObj.value.type === 1) {
        discountDialogVisible.value = true
        return
    }
    handleConfirmOrder()
}
// 处理确认订单
const handleConfirmOrder = async () => {
    goodsList.value = goodsList.value.filter((item: any) => item.goodsNum > 0)
    // 判断是否优惠
    goodsList.value.forEach((item: any) => item.discountPrice = 0)
    const goodsNum = goodsList.value.length
    // 判断是否优惠
    if (isDiscount.value || (discountObj.value &&
        Object.keys(discountObj.value).length > 0
        && discountObj.value.type === 1)) {
        // 获取优惠价格
        let discountPrice = isDiscount.value ? discountObj.value.discountPrice : formData.value.discountPrice
        // 解决js除法出现多位小数，获取平均价格
        discountPrice = discountPrice * 100000 / (goodsNum * 100000)
        // 保留两位小数
        discountPrice = Math.floor(discountPrice * 100) / 100
        // 每个菜减这个评价价格
        goodsList.value.forEach((item: any) => item.discountPrice = discountPrice)
    }
    console.log(goodsList.value);
    const res = await upData('/order/confirmOrder', { goodsList: goodsList.value }) as any
    console.log(res);
    if (res.code === 200) {
        discountDialogVisible.value = false
        formData.value.discountPrice = ''
        // 订单确认后删除订单
        deleteOrder('订单确认')
        return
    }
    proxy.$message.error('订单确认失败！')
}
// 删除订单
const deleteOrder = async (tip: string) => {
    if (goodsList.value.length <= 0) return proxy.$message.warning('没有订单可以删除！')
    const res = await upData('/order/deleteOrder', { seat: seatNum.value }) as any
    console.log(res);
    if (res.code === 200) {
        proxy.$message.success(tip + '成功!')
        seatNum.value = 0
        getOrderList()
        return
    }
    proxy.$message.error(tip + '失败！')
}
// 点击侧边栏订单获取订单数据
const clickOrder = (obj: any) => {
    const { seat } = obj
    seatNum.value = seat
    getGoodsList()
}
// 获取优惠
const getDiscount = async () => {
    const res = await upData('/discount/getDiscountListByTime', {}) as any
    console.log(res);
    if (res.code === 200) {
        discountObj.value = res.data
        return
    }
    proxy.$message.error('优惠活动获取失败！')
}
// 获取左侧订单信息
const getOrderList = async () => {
    const res = await upData('/order/getOrderList', {}) as any
    console.log(res);
    if (res.code === 200) {
        if (res.data.length > 0) {
            res.data.forEach((item: any) => {
                item.createTime = formatDataTime(item.createTime)
            })
            seatNum.value = res.data[0].seat
        }
        orderList.value = res.data
        getGoodsList()
        return
    }
    proxy.$message.error('订单获取失败！')
}
// 根据左侧座位号获取订单菜品
const getGoodsList = async () => {
    const res = await upData('/order/getGoodsList', { seat: seatNum.value }) as any
    console.log(res);
    if (res.code === 200) {
        goodsList.value = res.data
        return
    }
    proxy.$message.error('订单获取失败！')
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
            padding: 0 100px;
            span {
                font-size: 20px;
                color: #666;
            }
            .btn {
                margin-right: 30px;
            }
        }
        .goods {
            .goods_num {
                margin-top: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 50px;
                height: 60px;
                background-color: #ccc;
            }
        }
    }
}
// 隐藏滚动条
.order_list::-webkit-scrollbar {
    display: none;
}
:deep(.el-card) {
    width: 300px;
}
</style>
