<template>
    <div class="container">
        <div class="card_group">
            <card-item :cardData="cardData" />
        </div>
        <!-- 折线图表 -->
        <echarts-item :echarts-option="lineEchartsOption" :echarts-data="lineEchartsData" />
        <div class="echarts_group">
            <!-- 柱形图表 -->
            <echarts-item
                id="column"
                :echarts-option="columnEchartsOption"
                :echarts-data="lineEchartsData"
                width="31%"
            />
            <!-- 饼形图表 -->
            <echarts-item
                id="pie"
                title="近一周热卖菜品"
                :echarts-option="pieEchartsOption"
                :echarts-data="pieEchartsData"
                width="31%"
            />
            <!-- 雷达图表 -->
            <echarts-item
                id="radar"
                title="近一周热卖菜品"
                :echarts-option="radarEchartsOption"
                :echarts-data="radarEchartsData"
                width="31%"
            />
        </div>
        <el-table class="table" :data="tableData" highlight-current-row stripe style="width: 100%">
            <el-table-column type="index" label="#" width="50" />
            <el-table-column prop="goodsName" label="菜品名" />
            <el-table-column prop="categoryName" label="类别" width="180" />
            <el-table-column prop="goodsPrice" label="价格" width="180" />
            <el-table-column prop="sale" label="销量" width="300" />
            <el-table-column prop="state" label="状态" width="100">
                <template #default="scope">{{ scope.row.state === 1 ? '上架' : '下架' }}</template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue'
import CardItem from '@/components/common/Card.vue'
import EchartsItem from '@/components/common/EchartsItem.vue'
import money from '@/assets/image/money.png'
import number from '@/assets/image/number.png'
import order from '@/assets/image/order.png'
import { upData } from '@/api'
import { useRouter } from 'vue-router'

const { proxy } = getCurrentInstance() as any
const router = useRouter()
// console.log(router.getRoutes())
// Cart数据
const cardData = ref([
    {
        title: '今日交易金额',
        number: '0',
        imgUrl: money,
        class: 'red'
    },
    {
        title: '今日交易量',
        number: '0',
        imgUrl: number,
        class: 'blank'
    },
    {
        title: '菜品数',
        imgUrl: order,
        number: '0',
        class: 'yellow'
    }
])
// 折线图表配置
const lineEchartsOption: any = ref({
    dataset: {
        // 提供一份数据。
        source: []
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            top: 10,
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data: [
            '金额',
            '份数',
        ]
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        height: '80%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                // 坐标轴线
                show: true,
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#666',
                    width: 1,
                    type: 'solid'
                }
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            axisLine: {
                // 坐标轴线
                show: true,
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#666',
                    width: 1,
                    type: 'solid'
                }
            }
        }
    ],
    series: [
        {
            name: '金额',
            type: 'line',
            areaStyle: {
                color: '#b6a2de'
            },
            stack: '总量',
            emphasis: {
                focus: 'series'
            },
            itemStyle: {
                color: '#846ab7',
                lineStyle: {
                    color: '#846ab7',
                    width: 2
                },
            },
            datasetIndex: 0
        },
        {
            name: '份数',
            type: 'line',
            areaStyle: {
                color: '#5ab1ef'
            },
            stack: '总量',
            emphasis: {
                focus: 'series'
            },
            datasetIndex: 1,
            itemStyle: {
                color: '#3888fa',
                lineStyle: {
                    color: '#3888fa',
                    width: 2
                }
            },
        }
    ]
})
// 柱形图配置
const columnEchartsOption = ref({
    dataset: {
        // 提供一份数据。
        source: []
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category'
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '金额',
            type: 'bar',
            emphasis: {
                focus: 'series'
            },
            itemStyle: {
                color: '#2ec7c9',
            },
            datasetIndex: 0
        },
        {
            name: '份数',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
                focus: 'series'
            },
            datasetIndex: 1,
        },

    ]
})
// 饼图配置
const pieEchartsOption = ref({
    dataset: {
        // 提供一份数据。
        source: []
    },
    legend: {
        top: 'bottom'
    },
    toolbox: {
        show: true,
        feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: false },
            saveAsImage: { show: true }
        }
    },
    series: [
        {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [20, 80],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
                borderRadius: 8
            }
        }
    ]
})
// 雷达图配置
const radarEchartsOption = ref({
    dataset: {
        // 提供一份数据。
        source: []
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    radar: {
        radius: '66%',
        center: ['50%', '42%'],
        splitNumber: 8,
        splitArea: {
            areaStyle: {
                color: 'rgba(127,95,132,.3)',
                opacity: 1,
                shadowBlur: 45,
                shadowColor: 'rgba(0,0,0,.5)',
                shadowOffsetX: 0,
                shadowOffsetY: 15
            }
        },
        indicator: [
            { name: '红烧牛肉', max: 10 },
            { name: '爆炒鸡丁', max: 10 },
            { name: '鸡腿', max: 10 },
            { name: '可乐', max: 10 },
            { name: '炸鸡', max: 10 },
        ]
    },
    legend: {
        left: 'center',
        bottom: '10'
    },
    series: [{
        type: 'radar',
        symbolSize: 0,
        areaStyle: {
            shadowBlur: 13,
            shadowColor: 'rgba(0,0,0,.2)',
            shadowOffsetX: 0,
            shadowOffsetY: 10,
            opacity: 1
        }
    }]
})
// 折线图数据
const lineEchartsData = ref([
    {
        source: [
        ]
    },
    {
        source: [
        ]
    }
])
// 饼图数据
const pieEchartsData = ref([
    {
        source: [
        ]
    }
])
// 雷达图数据
const radarEchartsData = ref([
    {
        source: [[], [], [], [], []] as any
    }
])
// 菜品表格排行数据
const tableData = ref([])
onMounted(() => {
    getGoodsNum()
    getTodayNum()
    getWeekData()
    getWeekGoods()
    getWeekGoodsInfo()
})
// 获取菜品数量
const getGoodsNum = async () => {
    const res = await upData('analysis/getGoodsNum', {}) as any
    // console.log(res);
    if (res.code === 200) {
        cardData.value[2].number = res.data
        return
    }
    proxy.$message.error('菜品数量获取失败！')
}
// 获取今日交易金额和订单数
const getTodayNum = async () => {
    const res = await upData('analysis/getTodayNum', {}) as any
    // console.log(res);
    if (res.code === 200) {
        cardData.value[0].number = res.data.totalPrice ? '￥' + res.data.totalPrice : '￥0'
        cardData.value[1].number = res.data.sale ? res.data.sale : '0'
        return
    }
    proxy.$message.error('今日交易金额和订单数获取失败！')
}
// 获取近一周订单和金额
const getWeekData = async () => {
    let arrPrice = [[], [], [], [], [], [], []] as any
    let arrNum = [[], [], [], [], [], [], []] as any
    const res = await upData('analysis/getWeekData', {}) as any
    console.log(res);
    if (res.code === 200) {
        // 设置图表数据源格式
        res.data.forEach((item: any, index: number) => {
            arrPrice[index].push(item.time)
            arrNum[index].push(item.time)
            arrPrice[index].push(item.totalPrice)
            arrNum[index].push(item.sale)
        })
        lineEchartsData.value[0].source = arrPrice
        lineEchartsData.value[1].source = arrNum
        return
    }
    proxy.$message.error('订单和金额获取失败！')
}
// 获取近一周菜品销量排行
const getWeekGoods = async () => {
    let arrNum = [[], [], [], [], []] as any
    const res = await upData('analysis/getWeekGoods', {}) as any
    // console.log(res);
    if (res.code === 200) {
        // 添加日期
        res.data.forEach((item: any, index: number) => {
            arrNum[index].push(item.goodsName)
            arrNum[index].push(item.sale)
            radarEchartsData.value[0].source[0].push(item.sale)
            radarEchartsOption.value.radar.indicator[index].name = item.goodsName
        })
        pieEchartsData.value[0].source = arrNum
        return
    }
    proxy.$message.error('菜品销量排行获取失败！')
}
// 获取近一周菜品销量排行信息
const getWeekGoodsInfo = async () => {
    let arrNum = [[], [], [], [], []] as any
    const res = await upData('analysis/getWeekGoodsInfo', {}) as any
    console.log(res);
    if (res.code === 200) {
        tableData.value = res.data
        return
    }
    proxy.$message.error('菜品销量排行信息获取失败！')
}
</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    background-color: #f0f2f5;
    padding: 40px;
    box-sizing: border-box;
    .card_group {
        display: flex;
        justify-content: space-around;
    }
    .echarts_group {
        display: flex;
        justify-content: space-between;
    }
    .table {
        margin-top: 40px;
    }
}
</style>
