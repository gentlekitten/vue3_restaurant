<template>
    <template v-for="menu in routes" :key="routes.path">
        <div v-if="menu.children && menu.children.length > 0">
            <el-menu-item v-for="child in menu.children" :index="child.path">
                <icon class="icon" :icon="child.meta.icon" />
                <template #title>{{ child.meta.title }}</template>
            </el-menu-item>
        </div>
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


</script>
<style lang="scss" scoped>
.el-menu-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 180px;
    margin-top: 50px;
}
.icon {
    margin-right: 5px;
    width: 22px;
    text-align: center;
    font-size: 18px;
    vertical-align: middle;
}
</style>
