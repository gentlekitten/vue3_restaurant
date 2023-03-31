<template>
  <div class="container">
    <el-card class="box-card" shadow="hover">
      User：
      <span>{{ username }}</span>
    </el-card>
  </div>
</template>

<script setup lang="ts">
const username = JSON.parse(sessionStorage.getItem('user') as any).user
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  padding: 10px;
  .box-card {
    width: 200px;
    span {
      font-weight: 900;
    }
  }
}
</style>
