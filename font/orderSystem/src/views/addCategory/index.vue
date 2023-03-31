<template>
    <el-form ref="ruleForm" :model="formData" :rules="formRules" class="form">
        <el-form-item label="类别名" label-width="120px" prop="categoryName">
            <el-input
                v-model="formData.categoryName"
                autocomplete="off"
                width="100"
                clearable
                placeholder="请输入类别名"
            ></el-input>
        </el-form-item>
        <el-form-item>
            <el-button class="add_btn" type="primary" @click="addCatetory">添加</el-button>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue';
import { upData } from '@/api';
const { proxy } = getCurrentInstance() as any
const ruleForm = ref('') as any
const formData = ref({
    categoryName: ''
})
// 表单验证规则
const formRules = ref({
    categoryName: [
        {
            required: true,
            message: '请输入类别名',
            trigger: 'blur',
        },
        {
            min: 2,
            max: 10,
            message: '类别名长度在2~10个字符',
            trigger: 'blur',
        },
    ],
})
// 添加类别
const addCatetory = () => {
    ruleForm.value.validate(async (valid: any) => {
        if (valid) {
            const res = await upData('goods/addCategory', formData.value) as any
            if (res.code === 200) {
                formData.value.categoryName = ''
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
.form {
    display: flex;
    .add_btn {
        margin-left: 20px;
    }
}
:deep(.el-form-item__content) {
    width: 300px !important;
}
</style>
