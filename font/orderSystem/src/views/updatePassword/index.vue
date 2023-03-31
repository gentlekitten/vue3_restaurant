<template>
    <div class="container">
        <el-form
            ref="ruleForm"
            :model="formData"
            :rules="formRules"
            label-width="100px"
            class="form"
        >
            <avtaor-vue title="修改密码" />
            <register-vue
                :registerForm="formData"
                btn-text="确认"
                @login="toLogin"
                @register="updatePassword"
            />
        </el-form>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref, getCurrentInstance } from 'vue'
import { upData } from '@/api/index'
import RegisterVue from '@/components/login/Register.vue';
import AvtaorVue from '@/components/login/Avtaor.vue';
import useLogin from '@/hooks/useLogin'
const { proxy } = getCurrentInstance() as any
const { formData, formRules, toLogin } = useLogin()
// 组件的refs
const ruleForm = ref('') as any
// 完成修改
const updatePassword = () => {
    ruleForm.value.validate(async (valid: any) => {
        if (valid) {
            const res = await upData('login/update', formData) as any
            if (res.code !== 200) {
                proxy.$message.error(res.msg)
                return
            }
            formData.registerUsername = ''
            formData.registerPassword = ''
            formData.checkPassword = ''
            sessionStorage.removeItem('user')
            proxy.$message.success('修改成功！')
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
