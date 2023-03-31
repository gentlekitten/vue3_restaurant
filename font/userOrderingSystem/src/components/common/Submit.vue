<template>
    <div v-if="cartList && cartList.length > 0" class="submit">
        <van-icon name="cart" class="icon" @click="showCartList" />
        <div class="center">
            合计:
            <span>
                ￥
                <span class="big">{{ totalPrice }}</span>
            </span>
        </div>
        <van-button class="btn" type="primary" round @click="submitOrder">提交订单</van-button>
    </div>
</template>
<script setup lang="ts">
defineProps({
    cartList: {
        type: Array as () => Array<any>,
        defalut: () => []
    },
    cartListShow: {
        type: Boolean,
        defalut: false
    },
    totalPrice: {
        type: Number,
        defalut: 0
    }
})
const emits = defineEmits(['showCartList', 'submitOrder'])
const showCartList = () => {
    emits('showCartList')
}
const submitOrder = () => {
    emits('submitOrder')
}
</script>
<style lang="scss" scoped>
.submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    height: 3.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    box-sizing: border-box;
    color: #fff;
    .icon {
        font-size: 2rem;
    }
    .center {
        display: flex;
        align-items: center;
        span {
            color: #df3131;
            display: flex;
            align-items: center;
            font-weight: 600;
            .big {
                font-size: 1.5rem;
                font-weight: 600;
            }
        }
    }
    .num {
        color: #ccc;
    }
    .btn {
        width: 8rem;
        background-color: #f11627;
        font-size: 1rem;
    }
}
</style>
