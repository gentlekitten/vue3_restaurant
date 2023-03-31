<template>
    <template v-for="menu in routes" :key="routes.path">
        <el-sub-menu
            v-if="menu.children && menu.children.length > 0 && noChildren.indexOf(menu.path) === -1"
            :index="menu.path"
        >
            <template #title>
                <i
                    v-if="menu.meta.icon && menu.meta.icon.includes('el-icon')"
                    :class="menu.meta.icon"
                ></i>
                <icon v-else class="icon" :icon="menu.meta.icon" />
                <span>{{ menu.meta.title }}</span>
            </template>
            <menu-item :routes="menu.children" />
        </el-sub-menu>
        <el-menu-item v-else :index="menu.path">
            <i v-if="menu.meta.icon && menu.meta.icon.includes('el-icon')" :class="menu.meta.icon"></i>
            <icon v-else class="icon" :icon="menu.meta.icon" />
            <template #title>{{ menu.meta.title }}</template>
        </el-menu-item>
    </template>
</template>
<script setup lang="ts">
defineProps({
    routes: {
        type: Array as () => Array<any>,
        require: true,
        default: () => []
    }
})
// menu不需要名单
const noChildren = ['/', '/runningWater']


</script>
<style lang="scss" scoped>
.icon {
    margin-right: 5px;
    width: 22px;
    text-align: center;
    font-size: 18px;
    vertical-align: middle;
}
</style>
