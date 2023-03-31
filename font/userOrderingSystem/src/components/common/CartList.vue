<template>
    <div v-show="cartListShow && cartList && cartList.length > 0" class="cart_list">
        <header>
            <span>所选菜品</span>
            <span @click="clearCartList">清空</span>
        </header>
        <div class="list_item" v-for="item in cartList" :key="item.id">
            <span>{{ item.goodsName }}</span>
            <van-stepper
                class="stepper"
                v-model="item.goodsNum"
                theme="round"
                button-size="22"
                disable-input
            />
            <span>￥{{ item.goodsPrice * item.goodsNum }}</span>
            <van-button class="btn" size="mini" type="primary" @click="deleteGoods(item.id)">删除</van-button>
        </div>
    </div>
</template>
<script setup lang="ts">
defineProps({
    cartListShow: {
        type: Boolean,
        dedalut: false
    },
    cartList: {
        type: Array as () => Array<any>,
        defalut: () => []
    }
})
const emits = defineEmits(['deleteGoods', 'clearCartList'])
const deleteGoods = (id: number) => {
    emits('deleteGoods', id)
}
const clearCartList = () => {
    emits('clearCartList')
}
</script>
<style lang="scss" scoped>
.cart_list {
    position: fixed;
    bottom: 3.5rem;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    box-sizing: border-box;
    padding: 0 1rem;
    header {
        display: flex;
        height: 3rem;
        justify-content: space-between;
        align-items: center;
    }
    .list_item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 3rem;
        .btn {
            height: 1.8rem;
            width: 3rem;
            font-size: 0.9rem;
        }
    }
}
</style>
