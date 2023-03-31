<template>
    <van-nav-bar title="订单详情" left-arrow @click-left="back" />
    <div class="container">
        <header>座位号：{{ seat }}号</header>
        <div class="order_info">
            <h3>菜品信息：</h3>
            <div class="order_item" v-for="item in orderList" :key="item.id">
                <div class="left">
                    <img :src="'http://localhost:3000/' + item.goodsImg" />
                </div>
                <div class="right">
                    <span>{{ item.goodsName }}</span>
                    <div class="price_num">
                        <span>￥{{ item.goodsPrice }}</span>
                        <span>x{{ item.goodsNum }}</span>
                    </div>
                    <div class="item">
                        <span>小计</span>
                        <span>{{ item.goodsPrice * item.goodsNum * 100000 / 100000 }}</span>
                    </div>
                    <div class="item">
                        <span>优惠</span>
                        <span>{{ item.discountPrice }}</span>
                    </div>
                </div>
            </div>
            <div class="total_price discount">
                优惠活动：
                <span>{{ orderList[0].discountContent }}</span>
            </div>
            <div class="total_price">
                合计：
                <span>￥{{ orderList[0].totalPrice }}</span>
            </div>
            <div
                v-if="orderList[0].discountType === 1"
                class="tip"
            >现有活动{{ orderList[0].discountContent }}，若满足具体价格请以前台价格为准。</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()
const seat = route.query.seat
// 订单列表
const orderList = JSON.parse(sessionStorage.getItem('cartList') as any)
// 返回上一界面
const back = () => {
    router.go(-1)
}
</script>
<style lang="scss" scoped>
.container {
    height: 93.5%;
    background-color: #eee;
    padding: 1rem;
    header {
        background-color: #fff;
        height: 3rem;
        line-height: 3rem;
        padding: 0 1rem;
        border-radius: 0.2rem;
    }
    .order_info {
        margin-top: 1rem;
        background-color: #fff;
        padding: 1rem;
        box-sizing: border-box;
        border-radius: 0.2rem;
        .total_price {
            text-align: right;
            font-weight: 600;
            span {
                font-size: 1.3rem;
                color: crimson;
            }
        }
        .discount {
            display: flex;
            justify-content: space-between;
            margin: 0.5rem 0;
            span {
                font-size: 1rem;
            }
        }
        .tip {
            font-size: 0.8rem;
            color: #999;
            text-align: center;
            line-height: 2rem;
        }
        .order_item {
            display: flex;
            margin-top: 1rem;
            .left {
                flex: 1;
                img {
                    width: 5rem;
                    height: 5rem;
                }
            }
            .right {
                flex: 4;
                margin-left: 1rem;
                span {
                    font-size: 1rem;
                    font-weight: 600;
                    line-height: 2rem;
                }
                .price_num {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    // padding: 0 1rem;
                    span:nth-child(1) {
                        color: crimson;
                    }
                    span:nth-child(2) {
                        font-size: 0.9rem;
                        color: #ccc;
                    }
                }
                .item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    span:nth-child(2) {
                        color: crimson;
                    }
                }
            }
        }
    }
}

:deep(.van-nav-bar__content) {
    height: 3rem;
}
:deep(.van-nav-bar__title) {
    font-size: 1.2rem;
    font-weight: 600;
}
:deep(.van-icon) {
    font-size: 1.5rem;
    color: coral;
}
</style>
