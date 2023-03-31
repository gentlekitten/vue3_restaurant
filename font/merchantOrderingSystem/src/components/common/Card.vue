<template>
    <div v-for="item in cardData" :key="item.title">
        <el-card class="box-card" :class="item.class" shadow="hover">
            <template #header>
                <div class="card-header">
                    <span>{{ item.title }}</span>
                    <img class="icon" :src="item.imgUrl" />
                </div>
            </template>
            <div>{{ item.number }}</div>
        </el-card>
    </div>
</template>
<script setup lang="ts">
defineProps({
    cardData: {
        type: Array as () => Array<any>,
        default: () => []
    },
})
</script>
<style lang="scss" scoped>
.box-card {
    color: #fff;
    width: 400px;
    font-weight: 900;
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .icon {
        width: 50px;
        height: 50px;
    }
}
.red {
    background-color: rgb(249, 89, 89);
}
.blank {
    background-color: rgb(133, 149, 244);
}
.yellow {
    background-color: rgb(254, 187, 80);
}
:deep(.is-hover-shadow:hover) {
    box-shadow: 0 0 15px 5px #ddd;
}
</style>
