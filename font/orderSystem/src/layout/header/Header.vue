<template>
    <div class="container">
        <div class="left">
            <collapse />
            <bread-crumb class="bread_crumb" />
        </div>
        <avatar-item class="avatar_item" />
    </div>
</template>
<script setup lang="ts">
import Collapse from './Collapse.vue';
import BreadCrumb from './BreadCrumb.vue';
import AvatarItem from './AvatarItem.vue';

</script>
<style lang="scss" scoped>
.container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
        display: flex;
        align-items: center;
        .bread_crumb {
            margin-left: 10px;
        }
    }
}
</style>
