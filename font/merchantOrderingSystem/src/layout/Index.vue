<template>
    <el-container class="layout">
        <el-aside class="aside" width="200px">
            <menu-bar />
        </el-aside>
        <el-main>
            <router-view />
        </el-main>
    </el-container>
</template>
<script setup lang="ts">
import MenuBar from '@/layout/menu/MenuBar.vue'

</script>
<style lang="scss" scoped>
.layout {
    height: 100%;
    .aside {
        background-color: #304156;
    }
}
:deep(.el-main) {
    padding: 0;
}
</style>
