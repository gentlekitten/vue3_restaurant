<template>
    <el-form
        ref="ruleForm"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        class="demo-ruleForm"
    >
        <el-radio-group class="discount_radio" v-model="formData.discountType">
            <el-radio-button label="条件活动"></el-radio-button>
            <el-radio-button label="特殊活动"></el-radio-button>
        </el-radio-group>
        <el-form-item label="优惠时间">
            <el-date-picker
                v-model="formData.selectTime"
                type="daterange"
                unlink-panels
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"
                :shortcuts="timeList"
            ></el-date-picker>
        </el-form-item>
        <el-form-item label="活动内容" prop="discountContent">
            <el-input v-model="formData.discountContent" placeholder="如五一活动满100减10"></el-input>
        </el-form-item>
        <el-form-item v-if="formData.discountType === '条件活动'" label="优惠条件" prop="discountCondition">
            <el-input
                type="number"
                v-model.number="formData.discountCondition"
                placeholder="满多少的优惠价格"
            ></el-input>
        </el-form-item>
        <el-form-item v-if="formData.discountType === '条件活动'" label="优惠价格" prop="discountPrice">
            <el-input type="number" v-model.number="formData.discountPrice" placeholder="请输入减免多少钱"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="addDiscount">添加</el-button>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getData, upData } from '@/api/index'
import _ from 'lodash'
const { proxy } = getCurrentInstance() as any
// 时间快捷选项
const timeList = ref([
    {
        text: '上周',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: '上个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: '过去三个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
])
// 表单的ref
const ruleForm = ref('') as any
// 表单数据
const formData = ref({
    discountContent: '',
    discountPrice: '',
    discountCondition: '',
    selectTime: '',
    discountType: '条件活动'
})
// 表单检验规则
const formRules = reactive({
    discountContent: [
        {
            required: true,
            message: '请输入活动内容',
            trigger: 'blur',
        },
        {
            min: 2,
            max: 100,
            message: '活动内容长度在2~100个字符',
            trigger: 'blur',
        },
    ],
    discountPrice: [
        {
            required: true,
            message: '请输入优惠价格',
            trigger: 'blur',
        },
    ],
    discountCondition: [
        {
            required: true,
            message: '请输入优惠条件',
            trigger: 'blur',
        }
    ]
})
onMounted(() => {
})
// 添加优惠
const addDiscount = () => {
    ruleForm.value.validate(async (valid: any) => {
        if (valid) {
            if (!formData.value.selectTime) return proxy.$message.warning('请选择优惠时间！')
            const startTime = formatDataTime(formData.value.selectTime[0])
            const endTime = formatDataTime(formData.value.selectTime[1])
            formData.value.discountType = formData.value.discountType === '条件活动' ? 0 : 1 as any
            const res = await upData('/discount/addDiscount', {
                ...formData.value,
                startTime,
                endTime
            }) as any
            console.log(res);
            if (res.code === 200) {
                formData.value = {
                    discountContent: '',
                    discountPrice: '',
                    discountCondition: '',
                    selectTime: '',
                    discountType: '条件活动'
                }
                proxy.$message.success('添加成功！')
                return
            }
            formData.value.discountType = '条件活动'
            proxy.$message.error(res.msg)
        }
    })
}
// 格式化datatime
const formatDataTime = (time: any) => {
    const date = new Date(time)
    const value = date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' +
        date.getDate() + ' ' +
        date.getHours() + ':' +
        date.getMinutes() + ':' +
        date.getSeconds();
    return value
}

</script>
<style lang="scss" scoped>
.discount_radio {
    margin: 30px 50px;
}
</style>
