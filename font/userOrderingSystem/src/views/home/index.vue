<template>
  <van-nav-bar title="商品列表">
    <template #right>
      <van-icon class="search_icon" name="search" @click="searchPopupShow = true" />
    </template>
  </van-nav-bar>
  <div class="container">
    <!-- 头部区域 -->
    <header-vue :seat="seat" />
    <!-- 滚动广告 -->
    <van-notice-bar style="margin: 1rem 0;" scrollable text="到前台办理会员消费打九折哦~" />
    <!-- 优惠广告 -->
    <van-notice-bar
      style="margin: 1rem 0;"
      v-if="discountObj &&
      Object.keys(discountObj).length > 0"
      scrollable
      :text="discountObj.discountContent"
    />
    <!-- 单选框 -->
    <van-radio-group class="radio_group" v-model="memberRadio.member" direction="horizontal">
      <van-radio :name="0" checked-color="#f47920">普通用户</van-radio>
      <van-radio :name="1" checked-color="#f47920">会员用户</van-radio>
    </van-radio-group>
    <template v-if="memberRadio.member === 1">
      <van-form @submit="submitOrder">
        <van-cell-group inset>
          <van-field v-model="memberId" label="会员号：" placeholder="请输入会员号" clearable required />
        </van-cell-group>
      </van-form>
    </template>
    <!-- 商品列表 -->
    <van-tree-select
      class="goods_list"
      v-model:main-active-index="categoryActiveIndex"
      :items="categoryList"
      @click-nav="categoryChange"
    >
      <template #content>
        <div
          v-if="categoryList[categoryActiveIndex] && categoryList[categoryActiveIndex].children.length > 0"
        >
          <van-card
            class="goods"
            v-for="item in categoryList[categoryActiveIndex].children"
            :key="item.id"
            :price="item.goodsPrice"
            :title="item.goodsName"
            :thumb="'http://localhost:3000/' + item.goodsImg"
          >
            <template #footer>
              <van-button class="add_btn" icon="plus" type="primary" @click="addGoods(item)" />
            </template>
          </van-card>
        </div>
      </template>
    </van-tree-select>
  </div>
  <!-- 搜索弹出层 -->
  <van-popup v-model:show="searchPopupShow" position="top" round :style="{ height: '8rem' }">
    <van-cell-group class="search_input" inset>
      <van-field v-model="searchValue" center clearable label="商品名：" placeholder="请输入商品名">
        <template #button>
          <van-button type="primary" round @click="searchGoods">搜索</van-button>
        </template>
      </van-field>
    </van-cell-group>
  </van-popup>
  <!-- 底部提交订单 -->
  <submit
    :cartList="cartList"
    :cartListShow="cartListShow"
    :totalPrice="totalPrice"
    @show-cart-list="cartListShow = !cartListShow"
    @submit-order="submitOrder"
  />
  <!-- 购物车列表 -->
  <cart-list
    :cartList="cartList"
    :cartListShow="cartListShow"
    @delete-goods="deleteGoods"
    @clear-cart-list="cartList = []"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, getCurrentInstance, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import { upData } from '@/api';
import { Dialog } from 'vant';
import HeaderVue from '@/components/common/Header.vue';
import Submit from '@/components/common/Submit.vue';
import CartList from '@/components/common/CartList.vue';
import _ from 'lodash'
const { proxy } = getCurrentInstance() as any
const router = useRouter()
// 座位号
let seat = Math.ceil(Math.random() * 10) === 0 ? 25 : Math.ceil(Math.random() * 10)
// 是否显示搜索弹出层
const searchPopupShow = ref(false)
// 搜索值
const searchValue = ref('')
// 购物车列表是否显示
const cartListShow = ref(false)
// 类别索引
const categoryActiveIndex = ref(0)
// 总价格
const totalPrice = ref(0)
// 会员单选框 0不是会员1是会员
const memberRadio = ref({
  member: 0
})
// 会员号
const memberId = ref('')
// 优惠活动对象
const discountObj = ref({}) as any
// 是否优惠
const isDiscount = ref(false) as any
// 菜品数据
const categoryList = ref([
  {
    text: '热卖菜品',
    id: -1,
    children: [],
    badge: 'hot'
  }
]) as any
// 菜品数据克隆
const categoryListClone = ref([]) as any
// 购物车列表
const cartList = ref([]) as any
// 支付中动画
let loading = '' as any
// 监听购物车列表和会员选择框，计算总价
watch([() => cartList.value, memberRadio.value], () => {
  totalPrice.value = 0
  cartList.value.forEach((i: any) => {
    if (memberRadio.value.member === 1) return totalPrice.value += Math.floor((i.goodsPrice * 100000 * 0.9 / 100000) * i.goodsNum * 100) / 100
    totalPrice.value += Math.floor(i.goodsPrice * i.goodsNum * 100) / 100
  })

  // 判断是否有优惠和是否满足优惠条件
  // type === 0条件活动1特殊活动
  if (
    discountObj.value &&
    Object.keys(discountObj.value).length > 0
    && discountObj.value.type === 0
    && totalPrice.value >= discountObj.value.discountCondition
  ) {
    totalPrice.value -= parseFloat(discountObj.value.discountPrice)
    totalPrice.value = Math.floor(totalPrice.value * 100) / 100
    isDiscount.value = true
  }
}, {
  deep: true,
  immediate: true
})
onMounted(() => {
  getCategoryList()
  getDiscount()
})
// 搜索商品
const searchGoods = () => {
  if (!searchValue.value) return Toast.fail('请输入商品名');
  categoryList.value = _.cloneDeep(categoryListClone.value)
  let goodsList = categoryList.value[categoryActiveIndex.value].children
  // 过滤数据
  categoryList.value[categoryActiveIndex.value].children = goodsList.filter((i: any) => i.goodsName.indexOf(searchValue.value) !== -1)
  searchPopupShow.value = false
  searchValue.value = ''


}
// 添加商品到购物车
const addGoods = (item: any) => {
  // 判断列表中是否已经存在该商品
  if (cartList.value.some((i: any) => i.id === item.id)) {
    const index = cartList.value.findIndex((i: any) => i.id === item.id)
    cartList.value[index].goodsNum++
    return
  }
  item.goodsNum = 1
  cartList.value.push(item)
}
// 删除商品
const deleteGoods = (id: number) => {
  const index = cartList.value.findIndex((i: any) => i.id === id)
  cartList.value.splice(index, 1)
}
// 商品类别改变
const categoryChange = (index: number) => {
  categoryList.value = _.cloneDeep(categoryListClone.value)
  getGoodsList(categoryList.value[index].text, categoryList.value[index].id)
}
// 获取优惠
const getDiscount = async () => {
  const res = await upData('/discount/getDiscountListByTime', {}) as any
  console.log(res);
  if (res.code === 200) {
    discountObj.value = res.data
    return
  }
  proxy.$message.error('优惠活动获取失败！')
}
// 获取菜品类别列表
const getCategoryList = async () => {
  const res = await upData('/goods/categoryList', {}) as any
  console.log(res)
  if (res.code === 200) {
    if (res.data.length > 0) {
      res.data.forEach((item: any) => {
        const data = {} as any
        data.text = item.categoryName
        data.id = item.id
        data.children = []
        categoryList.value.push(data)
      })
      getGoodsList(categoryList.value[0].categoryName, categoryList.value[0].id)
    }
    return
  }
  proxy.$toast.fail('菜品类别获取失败！')
}
// 获取菜品列表
const getGoodsList = async (categoryName: string, id: number) => {
  // 判断当前类别里有无菜品信息，有就不获取了
  if (categoryList.value[categoryActiveIndex.value].children.length > 0) return
  // 热卖菜品
  let url = id === -1 ? '/goods/getRotGoods' : '/goods/getGoodsBycategory'
  const res = await upData(url, { categoryName }) as any
  console.log(res);
  if (res.code === 200) {
    const index = categoryList.value.findIndex((item: any) => item.id === id)
    categoryList.value[index].children = res.data
    categoryListClone.value = _.cloneDeep(categoryList.value)
    return
  }
  proxy.$toast.fail('菜品类别获取失败！')
}
// 将添加订单封装
const handleAddOrder = async (type: number) => {
  console.log(type)
  const goodsList = _.cloneDeep(cartList.value)
  // 将字符串中\\换为/
  goodsList.forEach((item: any) => {
    item.goodsImg = item.goodsImg.replace(/\\/g, "/")
    // 默认优惠为0
    item.discountPrice = 0
    // 优惠活动方式
    item.discountType = discountObj.value && Object.keys(discountObj.value).length > 0 ? discountObj.value.type : 0
    if (type === 1) item.goodsPrice = Math.floor((item.goodsPrice * 100000 * 0.9 / 100000) * 100) / 100
  })
  const goodsNum = goodsList.length
  // 判断是否优惠
  if (isDiscount.value) {
    // goodsList[0].discountPrice = discountObj.value.discountPrice
    // 获取优惠价格
    let discountPrice = discountObj.value.discountPrice
    // 解决js除法出现多位小数，获取平均价格
    discountPrice = discountPrice * 100000 / (goodsNum * 100000)
    // 保留两位小数
    discountPrice = Math.floor(discountPrice * 100) / 100
    // 每个菜减这个评价价格
    goodsList.forEach((item: any) => item.discountPrice = discountPrice)
  }
  const res = await upData('/order/addOrder', { seat, goodsList: goodsList, type }) as any
  console.log(res);
  if (res.code === 200) {
    proxy.$toast.success('提交成功！');
    // loading.clear()
    console.log(totalPrice.value)
    goodsList[0].totalPrice = totalPrice.value
    goodsList[0].discountContent = discountObj.value && Object.keys(discountObj.value).length > 0 ? discountObj.value.discountContent : '无'
    sessionStorage.setItem('cartList', JSON.stringify(goodsList))
    router.push('/orderInfo?seat=' + seat)
    return
  }
  proxy.$toast.fail('提交成功！');
}
// 提交订单
const submitOrder = async () => {
  console.log(totalPrice.value)
  // loading = Toast.loading({
  //   message: '支付中...',
  //   forbidClick: true,
  //   loadingType: 'spinner',
  // });
  // 不是会员
  if (memberRadio.value.member === 0) {
    handleAddOrder(0)
    return
  }
  if (!memberId.value) return proxy.$toast.fail('请填写会员号！');
  // 是会员，验证会员号是否存在或者有效
  const res = await upData('/member/checkMember', { memberId: Number(memberId.value) }) as any
  console.log(res);
  if (res.data.num > 0) {
    handleAddOrder(1)
    return
  }
  proxy.$toast.fail('该会员号不正确或已过期！');
}
</script>
<style lang="scss" scoped>
.search_input {
  margin-top: 2rem;
}
.search_icon {
  color: #e89b29 !important;
  font-size: 1.5rem !important;
}
.container {
  height: 94%;
  .radio_group {
    height: 4rem;
    margin: 0 1rem;
  }
  .goods_list {
    height: 85% !important;
    .goods {
      font-size: 1rem;
      height: 7.5rem;
      margin: 0 !important;
      background-color: #fff !important;
      position: relative;
      .add_btn {
        position: absolute;
        bottom: 2.5rem;
        right: 1rem;
        border-radius: 50%;
        width: 1.5rem !important;
        height: 1.5rem !important;
        background-color: #e89b29 !important;
        color: #fff !important;
      }
    }
  }
}
:deep(.van-nav-bar__content) {
  height: 3rem;
}
:deep(.van-nav-bar__title) {
  font-size: 1.2rem;
  font-weight: 600;
  height: 100%;
  display: flex;
  align-items: center;
}
:deep(.van-field__label, .van-field__value, .van-button) {
  font-size: 1rem;
}
:deep(.van-button) {
  height: 2rem;
  width: 3.5rem;
  background-color: coral;
  border: none;
}
:deep(.van-sidebar-item) {
  font-size: 0.95rem;
}
:deep(.van-icon) {
  font-size: 1rem;
  color: #fff;
}
:deep(.van-image__img) {
  border-radius: 0.5rem !important;
}
:deep(.van-card__title) {
  font-weight: 600;
  max-height: 4rem !important;
  line-height: 1.2rem;
  display: flex;
  align-items: center;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
:deep(.van-card__price-integer) {
  font-size: 1rem;
}
:deep(.van-card__price) {
  font-size: 1rem;
  color: #df3131 !important;
  font-weight: 600;
}
:deep(.van-card__content) {
  justify-content: space-around;
}
:deep(.van-stepper__input) {
  color: #fff !important;
}
:deep(.van-badge--fixed) {
  transform: translate(100%, -50%) !important;
}
:deep(.van-field__control) {
  font-size: 0.9rem;
}
:deep(.van-tree-select__content) {
  padding-bottom: 3rem;
}
</style>
