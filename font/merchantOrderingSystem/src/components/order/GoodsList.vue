<template>
    <div class="goods_list">
        <el-card
            v-for="item in goodsList"
            :key="item.id"
            class="goods_card"
            :body-style="{ padding: '0px' }"
        >
            <img :src="'http://localhost:3000/' + item.goodsImg" class="image" />
            <div class="goods_info">
                <div class="info">
                    <span>{{ item.goodsName }}</span>
                    <div v-if="item.memberPrice" class="price">
                        <span>{{ item.memberPrice }}￥</span>/份
                    </div>
                    <div v-else class="price">
                        <span>{{ item.goodsPrice }}￥</span>/份
                    </div>
                </div>
                <el-input-number
                    v-if="form === 'order'"
                    size="mini"
                    v-model="item.goodsNum"
                    :step="1"
                    :min="0"
                />
                <el-button
                    v-else
                    size="mini"
                    type="warning"
                    icon="el-icon-plus"
                    @click="addGoods(item)"
                    circle
                ></el-button>
            </div>
        </el-card>
    </div>
</template>
<script setup lang="ts">
defineProps({
    goodsList: {
        type: Array as () => Array<any>,
        defalut: () => []
    },
    // 来自点餐界面还是订单界面
    form: {
        type: String,
        defalut: 'order'
    }
})
const emits = defineEmits(['addGoods'])
const addGoods = (item: any) => {
    emits('addGoods', item)
}
</script>
<style lang="scss" scoped>
.goods_list {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    box-sizing: border-box;
}
.goods_card {
    width: 300px;
    justify-content: center;
    padding: 10px;
    margin: 0 10px 10px 7px;
    cursor: pointer;
    .image {
        width: 300px;
        height: 300px;
    }
    .goods_info {
        height: 60px;
        padding: 0 10px;
        text-align: center;
        .info {
            display: flex;
            align-items: center;
            justify-content: space-around;
            color: #666;
            margin: 10px 0;
            .price {
                span {
                    color: crimson;
                }
            }
        }
    }
}
.goods_card:hover {
    box-shadow: 0 0 10px 3px #ccc;
}
.goods_card::nth-child() .goods_card:hover {
    box-shadow: 0 0 10px 5px #ccc;
}
</style>
