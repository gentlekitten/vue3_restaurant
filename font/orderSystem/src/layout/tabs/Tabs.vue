<template>
    <el-tabs v-model="activeTab" type="card" @tab-remove="removeTab" @tab-click="clickTab">
        <el-tab-pane
            v-for="item in tabsList"
            :key="item.path"
            :label="item.title"
            :name="item.path"
            :closable="item.path === '/' ? false : true"
        ></el-tab-pane>
    </el-tabs>
</template>
<script setup lang="ts">
import router from '@/router';
import { store } from '@/store';
import { ITabe } from '@/store/type';
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router';

onMounted(() => {
    // 解决刷新vuex数据丢失
    beforeRefresh()
    setActiceTab()
    addTabs()
})

const route = useRoute()
const activeTab = ref('')
// 获取tabs列表
let tabsList = computed(() => store.getters.tabsList)

// 点击tab设置被选中的tab
const setActiceTab = () => {
    activeTab.value = route.path
}
// 添加tab
const addTabs = () => {
    const { path, meta } = route
    if (!meta || !meta.title || meta.title === '404') return
    const tab: ITabe = {
        path: path,
        title: meta.title as string
    }
    store.commit('ADD_TABS', tab)
}
// 删除tab
const removeTab = (targetName: any) => {
    // 选项卡列表
    const tabs = store.getters.tabsList
    // 当前激活的选项卡
    let activeName = activeTab.value
    if (activeName === targetName) {
        tabs.forEach((tab: ITabe, index: number) => {
            if (tab.path === targetName) {
                // 获取删除后下个激活的tab路径
                const nextTab = tabs[index + 1] || tabs[index - 1]
                if (nextTab) {
                    activeName = nextTab.path
                }
            }
        })
    }
    // 重新设置当前激活卡
    activeTab.value = activeName
    // 重新设置当前数据
    const tabsList = tabs.filter((tab: ITabe) => tab.path !== targetName)
    store.commit('SET_TABS', tabsList)
    router.push(activeName)
}
// 点击tab跳转界面
const clickTab = (tab: any) => {
    const { props } = tab
    router.push(props.name)
}
// 解决刷新数据丢失
const beforeRefresh = () => {
    window.addEventListener('beforeunload', () => {
        window.sessionStorage.setItem('tabsList', JSON.stringify(tabsList.value))
    })
    //在页面加载时读取sessionStorage里的状态信息
    const tabSession = JSON.parse(sessionStorage.getItem('tabsList') as any)
    if (tabSession && tabSession.length > 0) {
        store.commit('SET_TABS', tabSession)
    }
}
// 监听路由的改变
watch(() => route.path, () => {
    setActiceTab()
    addTabs()
})

</script>
<style lang="scss" scoped>
:deep(.el-tabs__header) {
    margin: 0;
}
:deep(.el-tabs__item) {
    height: 26px !important;
    line-height: 26px !important;
    text-align: center !important;
    border: 1px solid #d8dce5 !important;
    margin: 0px 3px !important;
    color: #495060;
    font-size: 12px !important;
    padding: 0px 10px !important;
    margin: 5px !important;
    border-radius: 4px !important;
}
:deep(.el-tabs__nav) {
    border: none !important;
}
:deep(.is-active) {
    border-bottom: 1px solid transparent !important;
    border: 1px solid #42b983 !important;
    background-color: #42b983 !important;
    color: #fff !important;
}
:deep(.el-tabs__item:hover) {
    color: #495060 !important;
}
:deep(.is-active:hover) {
    color: #fff !important;
}
</style>
