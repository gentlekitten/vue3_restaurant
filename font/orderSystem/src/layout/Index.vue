<template>
    <el-container class="layout">
        <el-aside class="aside" width="auto">
            <menu-bar></menu-bar>
        </el-aside>
        <el-container>
            <el-header class="header">
                <Header></Header>
            </el-header>
            <tabs-item />
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>
<script setup lang="ts">
import Header from '@/layout/header/Header.vue'
import MenuBar from '@/layout/menu/MenuBar.vue'
import TabsItem from '@/layout/tabs/Tabs.vue'

</script>
<style lang="scss" scoped>
.layout {
    height: 100%;
    .aside {
        background-color: #304156;
    }
    .header {
        height: 50px;
        border-bottom: 1px solid #e5e5e5;
    }
}
</style>
