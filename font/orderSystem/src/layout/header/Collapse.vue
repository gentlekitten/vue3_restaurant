<template>
    <icon class="icon" :icon="[isCollapse ? 'Fold' : 'Expand']" @click="changeCollapse" />
</template>
<script setup lang="ts">
import { store } from '@/store';
import { ref, computed, watch } from 'vue'

const isCollapse = computed(() => store.getters.isCollapse)

const changeCollapse = () => {
    store.commit('CHANGE_COLLAPSE', !isCollapse.value)
}

// 监听窗口大小设置菜单的收起/展开
window.onresize = () => {
    return (() => {
        if (document.body.clientWidth <= 1000 && store.state.isCollapse) {
            store.state.isCollapse = false
        }
        if (document.body.clientWidth >= 1000 && !store.state.isCollapse) {
            store.state.isCollapse = true
        }
    })();
};

</script>
<style lang="scss" scoped>
.icon {
    margin-right: 5px;
    width: 22px;
    height: 100%;
    font-size: 18px;
    display: flex;
    justify-items: center;
    cursor: pointer;
}
</style>
