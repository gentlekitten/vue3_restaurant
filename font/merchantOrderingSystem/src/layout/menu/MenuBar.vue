<template>
    <el-menu
        active-text-color="#4091ff"
        background-color="#304156"
        :default-active="activeIndex"
        text-color="#fff"
        class="el-menu-vertical-demo"
        router
        :collapse-transition="true"
    >
        <menu-item :routes="routes" />
    </el-menu>
</template>
<script setup lang="ts">
import MenuItem from '@/layout/menu/MenuItem.vue'

import { reactive, ref, computed, Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { store } from '@/store';

// 获取路由数组
const router = useRouter()
const routes: Ref = ref([])
// 过滤不需要展示的路由
routes.value = router.options.routes.filter(item => item.children)

// 获取当前路由
const route = useRoute()
const activeIndex = computed(() => {
    const { path } = route
    return path
})


</script>
<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
.el-menu {
    border-right: none;
}
:deep(.is-opened .el-menu-item) {
    background-color: #1f2d3d !important;
}
:deep(.el-menu-item) {
    font-size: 30px;
    display: flex;
    align-items: center;
}
:deep(.icon) {
    width: 40px !important;
}
:deep(.el-menu-item:hover) {
    background-color: #001528 !important;
}
</style>
