import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

export default function useLogin() {
    // 是否是登录界面
    const router = useRouter()

    // 再次输入密码自定义检验规则
    const checkPasswordVal = (rule: any, value: any, callback: any) => {
        if (value === '') {
            callback(new Error('请再次输入密码'))
        } else if (value.length < 3 || value.length > 6) {
            callback(new Error('密码长度在3~6个字符'))
        } else if (value !== formData.registerPassword) {
            callback(new Error("两次密码不一致!"))
        } else {
            callback()
        }
    }
    // 注册表单
    const formData = reactive({
        registerUsername: '',
        registerPassword: '',
        checkPassword: '',
    })
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
        ],
        registerUsername: [
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
        registerPassword: [
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
        ],
        checkPassword: [{ validator: checkPasswordVal, trigger: 'blur' }],
    })
    // 去登录
    const toLogin = () => {
        router.push('/login')
    }
    return {
        formData, formRules, toLogin
    }
}