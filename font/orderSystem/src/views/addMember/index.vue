<template>
    <el-form ref="ruleForm" :model="formData" :rules="formRules" class="form">
        <el-form-item label="会员号：" label-width="120px" prop="memberId">
            <el-input
                v-model.number="formData.memberId"
                autocomplete="off"
                width="100"
                clearable
                placeholder="请输入会员号"
            ></el-input>
        </el-form-item>
        <el-form-item label="用户名：" label-width="120px" prop="username">
            <el-input
                v-model="formData.username"
                autocomplete="off"
                width="100"
                clearable
                placeholder="请输入用户姓名"
            ></el-input>
        </el-form-item>
        <el-form-item label="有效期" prop="time" label-width="120px">
            <el-select v-model="formData.time" placeholder="选择有效期">
                <el-option
                    v-for="item in timeSelect"
                    :key="item.id"
                    :label="item.time"
                    :value="item.time"
                ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button class="add_btn" type="primary" @click="addMember">添加</el-button>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue';
import { upData } from '@/api';
const { proxy } = getCurrentInstance() as any
const ruleForm = ref('') as any
const formData = ref({
    memberId: '',
    username: '',
    time: ''
})
// 时间列表
const timeSelect = ref([
    {
        id: 1,
        time: '一年'
    },
    {
        id: 2,
        time: '半年'
    },
    {
        id: 3,
        time: '一季度'
    }
]
) as any
// 表单验证规则
const formRules = ref({
    memberId: [
        {
            required: true,
            message: '请输入会员号',
            trigger: 'blur',
        }
    ],
    username: [
        {
            required: true,
            message: '请输入会员号',
            trigger: 'blur',
        },
        {
            min: 2,
            max: 10,
            message: '用户名长度在2~10个字符',
            trigger: 'blur',
        },
    ],
    time: [
        {
            required: true,
            message: '请选择有效期',
            trigger: 'blur',
        },
    ],
})
// 添加会员
const addMember = () => {
    ruleForm.value.validate(async (valid: any) => {
        if (valid) {
            const res = await upData('member/addMember', formData.value) as any
            if (res.code === 200) {
                formData.value.memberId = ''
                formData.value.username = ''
                formData.value.time = ''
                proxy.$message.success('添加成功！')
                return
            }
            proxy.$message.error(res.msg)
            return
        }
    })

}

</script>
<style lang="scss" scoped>
.add_btn {
    margin-left: 120px;
}
:deep(.el-form-item__content) {
    width: 300px !important;
}
</style>
