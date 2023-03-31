import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

export default function useLogin() {
    // 表单检验规则
    const formRules = reactive({
        username: [
            {
                required: true,
                message: '请输入用户名',
                trigger: 'blur',
            },
            {
                min: 3,
                max: 6,
                message: '用户名长度在3~6个字符',
                trigger: 'blur',
            },
        ],
        password: [
            {
                required: true,
                message: '请输入密码',
                trigger: 'blur',
            },
            {
                min: 3,
                max: 6,
                message: '密码长度在3~6个字符',
                trigger: 'blur',
            },
        ]
    })
    return {
        formRules
    }
}