<template>
    <el-form
        ref="ruleForm"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        class="demo-ruleForm"
    >
        <el-form-item label="商品图片" prop="goodsImgUrl">
            <el-upload
                ref="uploadRefs"
                :limit="1"
                action="http://localhost:3000/goods/upImg"
                :before-remove="beforeRemoveGoodsImg"
                :on-exceed="handleExceed"
                :on-success="imgUpSuccess"
                :on-error="imgUpError"
                list-type="picture"
                :auto-upload="true"
            >
                <el-button size="small" type="primary">点击选择图片</el-button>
                <template #tip>
                    <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
                </template>
            </el-upload>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
            <el-input v-model="formData.goodsName" placeholder="请输入商品名"></el-input>
        </el-form-item>
        <el-form-item label="商品类别" prop="category">
            <el-select v-model="formData.category" placeholder="菜品类别">
                <el-option
                    v-for="item in categoryList"
                    :key="item.id"
                    :label="item.categoryName"
                    :value="item.categoryName"
                ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="商品价格" prop="goodsPrice">
            <el-input type="number" v-model.number="formData.goodsPrice" placeholder="请输入商品价"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="addGoods">添加</el-button>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getData, upData } from '@/api/index'
import { reject } from 'lodash'
const { proxy } = getCurrentInstance() as any
// el-upload的ref
const uploadRefs = ref('') as any
// 表单的ref
const ruleForm = ref('') as any
// 表单数据
const formData = ref({
    goodsName: '',
    category: '',
    goodsImgUrl: '',
    goodsPrice: ''
})
// 表单检验规则
const formRules = reactive({
    goodsName: [
        {
            required: true,
            message: '请输入商品名',
            trigger: 'blur',
        },
        {
            min: 2,
            max: 10,
            message: '商品名长度在2~10个字符',
            trigger: 'blur',
        },
    ],
    category: [
        {
            required: true,
            message: '请选择类别',
            trigger: 'blur',
        },
    ],
    goodsPrice: [
        {
            required: true,
            message: '请输入价格',
            trigger: 'blur',
        }
    ],
    goodsImgUrl: [
        {
            required: true,
            message: '请上传图片',
            trigger: 'blur',
        }
    ]
})
// 商品类别列表
const categoryList = ref({}) as any
onMounted(() => {
    getCategoryList()
})
// 图片上传成功
const imgUpSuccess = (res: any, file: any, fileList: any) => {
    console.log(res)
    formData.value.goodsImgUrl = res.data
}
// 图片上传失败
const imgUpError = () => {
    proxy.$message.error('图片上传失败！')
}
// 删除图片之前弹出确认框
const beforeRemoveGoodsImg = (file: any) => {
    return ElMessageBox.confirm(
        `确定删除${file.name} 图片吗?`,
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            const res = await upData('/goods/deleteImg', { imgUrl: formData.value.goodsImgUrl }) as any
            console.log(res)
            if (res.code === 200) {
                formData.value.goodsImgUrl = ''
                proxy.$message.success(`${file.name} 图片删除成功！`)
                return
            }
            proxy.$message.error(`${file.name} 图片删除失败！`)
            return new Promise((resolve, reject) => {
                reject('取消')
            })
        })
        .catch(() => {
            return new Promise((resolve, reject) => {
                reject('取消')
            })
        })

}
// 处理文件超出个数限制
const handleExceed = () => {
    ElMessage({
        type: 'warning',
        message: '只能上传一张图片',
    })
}
// 获取菜品类别列表
const getCategoryList = async () => {
    const res = await upData('/goods/categoryList', {}) as any
    console.log(res);

    if (res.code === 200) {
        categoryList.value = res.data
        return
    }
    proxy.$message.error('菜品类别获取失败！')
}
// 添加商品
const addGoods = () => {
    // 获取商品图片列表 
    // let imgFileList = uploadRefs._rawValue.uploadFiles
    // if (imgFileList.length > 0) {
    //     formData.value = imgFileList[0].raw
    // }
    ruleForm.value.validate(async (valid: any) => {
        console.log(formData.value);
        if (valid) {
            console.log(formData.value);
            const res = await upData('/goods/addGoods', formData.value) as any
            console.log(res);
            if (res.code === 200) {
                formData.value = {
                    goodsName: '',
                    category: '',
                    goodsImgUrl: '',
                    goodsPrice: ''
                }
                // 设置图片列表为空
                uploadRefs._rawValue.uploadFiles = []
                proxy.$message.success('添加成功！')
                return
            }
            proxy.$message.error(res.msg)
        }
    })
}
</script>
<style lang="scss" scoped>
</style>
