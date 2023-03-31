<template>
    <!-- <div class="container">
        <el-button type="primary" @click="toLogin">退出登录</el-button>
    </div>-->
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
// 退出登录
const toLogin = () => {
    sessionStorage.removeItem('user')
    router.push('/login')
}
toLogin()
</script>
<style lang="scss" scoped>
.container {
    padding: 10px;
}
</style>
