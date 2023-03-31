<template>
    <div class="logo">
        <el-tooltip class="item" effect="dark" content="点餐管理系统" placement="right" :offset="30">
            <img src="../../assets/image/logo.jpg" />
        </el-tooltip>
        <span v-show="isCollapse" class="title">点餐管理系统</span>
    </div>
</template>
<script setup lang="ts">
defineProps({
    isCollapse: {
        type: Boolean,
        require: true,
        defalut: false
    }
})
</script>
<style lang="scss" scoped>
.logo {
    background-color: #304156;
    height: 50px;
    border: none;
    line-height: 50px;
    display: flex;
    align-items: center;
    margin-left: -5px;
    color: #fff;
    img {
        width: 32px;
        height: 32px;
        margin-right: 12px;
        border-radius: 50%;
    }
    span {
        font-weight: 600;
        line-height: 50px;
        font-size: 16px;
        vertical-align: middle;
    }
}
.logo:hover {
    background-color: #001528;
}
</style>
