<template>
    <header>
        <div class="info">
            <div class="title">佩奇小餐厅</div>
            <div class="seat">座位号：{{ seat }}号</div>
        </div>
    </header>
</template>
<script setup lang="ts">
defineProps({
    seat: {
        type: Number,
        defalut: 0
    },
})
</script>
<style lang="scss" scoped>
header {
    width: 100%;
    height: 10%;
    background-color: #e89b29;
    .info {
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem;
        color: #fff;
    }
}
</style>
