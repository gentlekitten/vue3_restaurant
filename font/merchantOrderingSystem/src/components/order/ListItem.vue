<template>
    <div
        class="list"
        :class="[item.id === index ? 'blank' : '']"
        v-for="item in orderList"
        :key="item.id"
        @click="clickOrder(item.id, item.seat, item.categoryName)"
    >
        <template v-if="from === 'order'">
            <div class="seat">座位：{{ item.seat }}号</div>
            <div class="time">下单时间：{{ item.createTime }}</div>
        </template>
        <template v-else>
            <div class="category">{{ item.categoryName }}</div>
        </template>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
const props = defineProps({
    orderList: {
        type: Array as () => Array<any>,
        defalut: () => []
    },
    from: {
        type: String,
        defalut: 'order'
    }
})
// 记录当前index
let index = ref(1) as any
const setIndex = () => {
    if (props.orderList && props.orderList.length > 0) {
        index.value = props.orderList[0].id
    }
}
watch(() => props.orderList, setIndex, {
    immediate: true
})
const emits = defineEmits(['clickOrder'])
const clickOrder = (id: number, seat: number, categoryName: string) => {
    index.value = id
    emits('clickOrder', { id, seat, categoryName })
}
</script>
<style lang="scss" scoped>
.list {
    font-size: 20px;
    line-height: 40px;
    height: 90px;
    border-bottom: 1px solid#eee;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
}
.blank {
    background-color: #ffce8c;
}
.list:hover {
    background-color: #afd6fe;
}
</style>
