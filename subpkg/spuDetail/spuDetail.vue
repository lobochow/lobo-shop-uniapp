<template>
	<view>
		<swiper class="swiperArea"
				indicator-dots>
			<swiper-item v-for="item in spuInfo.swipers"
						 :key="item._id">
				<image :src="item.url"
					   mode="heightFix"></image>
			</swiper-item>
		</swiper>

		<view class="saleAttrArea">
			<view class="saleAttrItem"
				  v-for="item in attrs"
				  :key="item.attrName">
				<view class="saleAttrName">{{item.attrName}}</view>
				<text v-for="(attrValueItem, index) in item.values"
					  :key="index"
					  @tap="attrClick(item.attrName, attrValueItem.value, !attrValueItem.selectable)"
					  class="saleAttrValueItem"
					  :class="{'disableSelect': !attrValueItem.selectable, 'selectedAttr' :
					isAttrSelected(item.attrName, attrValueItem.value) }">{{attrValueItem.value}}</text>
			</view>
		</view>

		<uni-goods-nav :options="goods_nav_options"
					   :buttonGroup="goods_nav_buttonGroup"
					   @click="buyNavCilckHandler"
					   @buttonClick="buyNavButtonClick" />

		<view class="footer"></view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	
	export default {
		data() {
			return {
				goods_nav_options: [{
					icon: 'cart',
					text: '购物车',
					info: 2
				}],
				goods_nav_buttonGroup: [{
					text: '加入购物车',
					backgroundColor: '#ff0000',
					color: '#fff'
				}],
				selectedAttr: [],
				sku_id: '',
				spu_id: '',
				skuInfo: {},
				spuInfo: {}
			};
		},
		computed: {
			...mapState('cartStore', ['goodsList']),
			attrs() {
				let attrMap = new Map();
				this.skuInfo.attrList?.forEach(attrName => {
					attrMap.set(attrName, new Set());
				})

				this.skuInfo.spuList?.forEach(spu => {
					spu.attrList.forEach(spuAttr => {
						attrMap.get(spuAttr.attrName).add(spuAttr.attrValue);
					})
				})

				let attrArray = [];

				for (let [attrName, valuesSet] of attrMap) {

					let tmpObj = {
						attrName,
						values: []
					};

					for (let value of valuesSet ?? []) {
						tmpObj.values.push({
							value,
							selectable: true
						})
					}

					attrArray.push(tmpObj);
				}

				return attrArray.filter(item => item.values.length !== 0);
			}
		},
		watch: {
			selectedAttr() {
				this.attrFilter();
			},
			spuInfo(spuInfo) {
				this.selectedAttr = [...spuInfo.attrList];
			},
			spu_id() {
				this.spuInfo = this.skuInfo.spuList.find(item => item._id === this.spu_id);
			}
		},
		methods: {
			async init(spu_id) {
				let result = await uni.lobo.request({
					url: '/v1/sku?sku_id=' + this.sku_id
				});

				this.skuInfo = result.data.data[0];
				this.spu_id = spu_id;
			},

			//可选属性筛选
			attrFilter() {
				//设定测试条件
				//this.selectedAttr = [{ attrName: '机身内存', attrValue: '128G' }];
				let { attrs, skuInfo, selectedAttr } = this;

				//所有属性设置为不能选择
				attrs.forEach(attrItem => {
					attrItem.values.forEach(attrValueItem => {
						attrValueItem.selectable = false;
					})
				})

				//this.attrList.splice(0, 0);

				//获取本地spu列表信息
				let spuList = skuInfo.spuList;
				//符合要求的spu
				let filterSpus = skuInfo.spuList;
				//筛选spu
				selectedAttr.forEach(selectedAttrItem => {
					//循环每个被选属性，筛选符合的spu
					filterSpus = filterSpus.filter(item => {
						//只要其中一个销售属性等于被选属性就为真
						return item.attrList.some(spuAttrItem => {
							//销售属性名和值相同时为真
							return selectedAttrItem.attrName === spuAttrItem.attrName &&
								selectedAttrItem.attrValue === spuAttrItem.attrValue;
						})
					})
				})

				//符合筛选的spu的attr
				let okAttrMap = new Map();
				filterSpus.forEach(spuItem => {
					spuItem.attrList.forEach(spuAttrItem => {
						if (okAttrMap.has(spuAttrItem.attrName)) {
							okAttrMap.get(spuAttrItem.attrName).add(spuAttrItem.attrValue);
						} else {
							let tmpSet = new Set();
							tmpSet.add(spuAttrItem.attrValue);
							okAttrMap.set(spuAttrItem.attrName, tmpSet);
						}
					})
				})
				//设置可选属性的状态
				for (let [attrName, attrValues] of okAttrMap) {
					for (let value of attrValues) {
						attrs.find(item => item.attrName === attrName).values.find(item => item.value === value)
							.selectable = true;
					}
				}

				if (filterSpus.length === 1) {
					this.spu_id = filterSpus[0]._id;
				}

				this.skuInfo = skuInfo
				this.selectedAttr = selectedAttr
			},

			attrClick(attrname, attrvalue, disable) {
				let selectedAttr = this.selectedAttr;

				let isSelected = this.isAttrSelected(attrname, attrvalue, selectedAttr);

				if (disable) {
					//禁用的选项,什么都不做
				} else if (isSelected) {
					let deleteIndex = selectedAttr.findIndex(selectedAttrItem => selectedAttrItem.attrName === attrname);
					selectedAttr.splice(deleteIndex, 1);
				} else {
					selectedAttr.push({
						attrName: attrname,
						attrValue: attrvalue
					})
				}

			},

			isAttrSelected(attrName, attrValue) {
				let result = false;
				let attrItem = this.selectedAttr.find(item => item.attrName === attrName);
				if (attrItem && attrItem.attrValue === attrValue) {
					result = true;
				}
				return result;
			},
			buyNavCilckHandler({ index, content }) {
				//content: {icon, text, info}
				if (content.text === '购物车') {
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			},
			async buyNavButtonClick({ index, content }) {
				if (content.text === '加入购物车') {
					let goodsList = this.goodsList.map(item => {
						return {
							count: item.count,
							spu_id: item.spuInfo._id
						}
					})
					let index = goodsList.findIndex(item => {
						return item.spu_id === this.spu_id
					});
					if(index === -1){
						goodsList.push({
							count: 1,
							spu_id: this.spu_id
						})
					}else{
						goodsList[index].count++
					}
					
					let result = await this.$store.dispatch('cartStore/acUpdateCart', {goodsList});
					if(result === 200){
						uni.showToast({
							title:'添加成功!',
							duration:1500
						})
					}else if(result === 201){
						uni.showToast({
							title: '请先登陆',
							duration:1500
						})
					}else{
						uni.showToast({
							title: '添加失败',
							duration:1500
						})
					}
				}
			}
		},
		onLoad(options) {
			this.init(options._id);
		},
	}
</script>

<style lang="less">
	/* 轮播图区域 */
	.swiperArea {
		text-align: center;
	}

	.swiperArea image {
		height: 100%;
	}

	/* 销售属性选择区域 */
	.saleAttrArea {

		.saleAttrItem {
			padding: 0 20rpx;
			margin-bottom: 30rpx;

			.saleAttrName {
				padding: 10rpx;
				font-weight: bold;
				margin-bottom: 20rpx;
			}

			.saleAttrValueItem {
				padding: 10rpx 20rpx;
				margin: 0 20rpx;

				border: 2rpx solid transparent;
				border-radius: 30rpx;

				background-color: #eee;

				&.selectedAttr {
					color: #E1251B;
					border: #E1251B 2rpx solid;
					background-color: rgba(225, 37, 27, 0.1);
				}

				&.disableSelect {
					color: #ccc;
					text-decoration: line-through;
				}
			}
		}
	}

	.uni-goods-nav {
		position: absolute;
		bottom: 0;

		width: 100%;
	}
</style>
