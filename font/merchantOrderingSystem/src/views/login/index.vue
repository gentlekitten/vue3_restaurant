<template>
    <div class="container">
        <el-form
            ref="ruleForm"
            :model="loginForm"
            :rules="formRules"
            label-width="100px"
            class="form"
        >
            <avtaor title="商家点餐系统" />
            <login-vue :loginForm="loginForm" @login="login" @resetForm="resetForm" />
        </el-form>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { upData } from '@/api';
import LoginVue from '@/components/login/Login.vue';
import Avtaor from '@/components/login/Avtaor.vue';
import useLogin from '@/hooks/useLogin'
const { proxy } = getCurrentInstance() as any
// formData注册表单数据，formRules表单规则验证
const { formRules } = useLogin()
// 组件的refs
const ruleForm = ref('') as any
const router = useRouter()

// 登录表单
const loginForm = reactive({
    username: 'admin',
    password: '123456'
})
// 重置表单
const resetForm = () => {
    ruleForm.value.resetFields()
}
// 登录
const login = () => {
    ruleForm.value.validate(async (valid: any) => {
        if (valid) {
            const res = await upData('login', loginForm) as any
            console.log(res)
            if (res.code === 200) {
                sessionStorage.setItem('user', JSON.stringify({ user: res.data.username, id: res.data.id }))
                router.push('/')
                return
            }
            proxy.$message.error('账号或者密码错误！')
        }
    })
}

</script>
<style lang="scss" scoped>
.container {
    height: 100%;
    width: 100%;
    background: url("../../assets/image/logo_bg.jpg") no-repeat 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .form {
        position: relative;
        text-align: center;
        margin: auto;
        width: 550px;
        height: 400px;
        background-color: #fff;
        border-radius: 5px;
        box-sizing: border-box;
        padding: 50px;
        box-shadow: 0px 0px 10px 5px #ddd;
    }
}
</style>
