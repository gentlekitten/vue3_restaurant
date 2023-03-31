<template>
    <el-form-item label="用户名：" prop="username">
        <el-input v-model="loginForm.username" clearable placeholder="输入用户名"></el-input>
    </el-form-item>
    <el-form-item label="密码：" prop="password">
        <el-input v-model="loginForm.password" clearable show-password placeholder="输入密码"></el-input>
    </el-form-item>
    <div class="btn_item">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
    </div>
</template>
<script setup lang="ts">
defineProps({
    loginForm: {
        type: Object,
        default: () => { }
    }
})
const emit = defineEmits(['resetForm', 'login'])
const login = () => {
    emit('login')
}
const resetForm = () => {
    emit('resetForm')
}
</script>
<style lang="scss" scoped>
.btn_item {
    margin-top: 60px;
    display: flex;
    justify-content: space-evenly;
}
</style>
