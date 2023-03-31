<template>
    <el-dropdown @command="handleClickMenu">
        <span class="el-dropdown-link">
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item disabled>U：{{ username }}</el-dropdown-item>
                <el-dropdown-item divided command="login">退出登录</el-dropdown-item>
                <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';

const username = JSON.parse(sessionStorage.getItem('user') as any).user

const router = useRouter()
// 处理下拉残端点击事件
const handleClickMenu = (path: string) => {
    if (path === 'login') {
        sessionStorage.removeItem('user')
        router.push('/login')
        return
    }
    router.push('/updatePassword')
}
</script>
<style lang="scss" scoped>
</style>
