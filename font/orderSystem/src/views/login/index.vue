<template>
    <div class="container">
        <el-form
            ref="ruleForm"
            :model="isLgonView ? loginForm : formData"
            :rules="formRules"
            label-width="100px"
            class="form"
        >
            <avtaor :title="isLgonView ? '点餐系统' : '注册界面'" />
            <div v-if="isLgonView">
                <login-vue :loginForm="loginForm" @login="login" @register="register" />
            </div>
            <div v-else>
                <register-vue
                    :registerForm="formData"
                    btn-text="注册"
                    @login="login"
                    @register="register"
                />
            </div>
        </el-form>>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { upData } from '@/api/index'
import RegisterVue from '@/components/login/Register.vue';
import LoginVue from '@/components/login/Login.vue';
import Avtaor from '@/components/login/Avtaor.vue';
import useLogin from '@/hooks/useLogin'
const { proxy } = getCurrentInstance() as any
// formData注册表单数据，formRules表单规则验证
const { formData, formRules } = useLogin()
// 组件的refs
const ruleForm = ref('') as any
// 是否是登录界面
const isLgonView = ref(true)
const router = useRouter()

// 登录表单
const loginForm = reactive({
    username: 'admin',
    password: '123456'
})

// 登录
const login = () => {
    if (!isLgonView.value) {
        isLgonView.value = true
        return
    }
    ruleForm.value.validate(async (valid: any) => {
        if (valid) {
            const res = await upData('login', loginForm) as any
            if (res.code === 200) {
                sessionStorage.setItem('user', JSON.stringify({ user: res.data.username, id: res.data.id }))
                router.push('/')
                return false
            }
            proxy.$message.error(res.msg)
        }
    })
}
// 注册
const register = () => {
    if (isLgonView.value) {
        isLgonView.value = false
        return
    }
    ruleForm.value.validate(async (valid: any) => {
        if (valid) {
            const res = await upData('login/register', formData) as any
            if (res.code !== 200) {
                proxy.$message.error(res.msg)
                return
            }
            formData.registerUsername = ''
            formData.registerPassword = ''
            formData.checkPassword = ''
            proxy.$message.success('注册成功！')
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
