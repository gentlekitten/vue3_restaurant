<template>
    <div class="line_echarts" :style="{ width: width }">
        <div class="title">{{ title }}</div>
        <div :id="id" class="echarts_item" :style="{ width: '100%', height: height }"></div>
        <!-- <el-empty v-else :image-size="200"></el-empty> -->
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, getCurrentInstance } from 'vue'

const props = defineProps({
    echartsOption: {
        type: Object,
        default: () => { }
    },
    echartsData: {
        type: Array as () => Array<any>,
        default: () => []
    },
    width: {
        type: String,
        default: '100%'
    },
    height: {
        type: String,
        default: '300px'
    },
    title: {
        type: String,
        default: '近一周餐厅数据'
    },
    id: {
        type: String,
        default: 'line_main'
    },
})

const { proxy } = getCurrentInstance() as any;
onMounted(() => {
    initEcharts()
})
// 初始化图表
const initEcharts = () => {
    const lineChart = proxy.$echarts.init(document.getElementById(props.id))
    lineChart.showLoading()
    getEchartsList(lineChart)
}
// 获取图片数据
const getEchartsList = (myChart: any) => {
    setTimeout(() => {
        myChart.hideLoading()
        props.echartsOption.dataset = props.echartsData
        props.echartsOption && myChart.setOption(props.echartsOption)
    }, 1000)
}
</script>
<style lang="scss" scoped>
.line_echarts {
    background-color: #fff;
    box-sizing: border-box;
    padding: 1rem;
    margin-top: 50px;
    .title {
        font-weight: 900;
        margin-bottom: 1rem;
    }
    .echarts_item {
        margin-bottom: 1rem;
        cursor: pointer !important;
    }
}
</style>
