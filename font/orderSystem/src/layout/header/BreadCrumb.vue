<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in tabs" :to="{ path: item.path }">{{ item.meta.title }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { useRoute, RouteLocationMatched } from 'vue-router'

const route = useRoute()
let tabs: Ref<RouteLocationMatched[]> = ref([])
const getBreadCrumb = () => {
    // 获取所有的meta和title
    let mached = route.matched.filter(item => item.meta && item.meta.title)
    // 判断第一个是不是首页，不是就构造一个
    const first = mached[0]
    if (first && first.path !== '/') {
        mached = [{ path: '/', meta: { title: '首页' } } as any].concat(mached)
    }
    tabs.value = mached
}
getBreadCrumb()
watch(() => route.path, getBreadCrumb)


</script>
<style lang="scss" scoped>
</style>
