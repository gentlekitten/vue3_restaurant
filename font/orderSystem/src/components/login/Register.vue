<template>
    <el-form-item label="用户名：" prop="registerUsername">
        <el-input v-model="registerForm.registerUsername" clearable placeholder="输入用户名"></el-input>
    </el-form-item>
    <el-form-item label="密码：" prop="registerPassword">
        <el-input
            v-model="registerForm.registerPassword"
            clearable
            show-password
            placeholder="输入密码"
        ></el-input>
    </el-form-item>
    <el-form-item label="确认密码：" prop="checkPassword">
        <el-input v-model="registerForm.checkPassword" clearable show-password placeholder="再次输入密码"></el-input>
    </el-form-item>
    <div class="btn_item_register">
        <el-button type="primary" @click="register">{{ btnText }}</el-button>
        <el-button @click="login">去登录</el-button>
    </div>
</template>
<script setup lang="ts">
defineProps({
    registerForm: {
        type: Object,
        default: () => { }
    },
    btnText: {
        type: String,
        default: ''
    }
})
const emit = defineEmits(['register', 'login'])
const login = () => {
    emit('login')
}
const register = () => {
    emit('register')
}
</script>
<style lang="scss" scoped>
.btn_item_register {
    margin-top: 30px;
    display: flex;
    justify-content: space-evenly;
}
</style>
