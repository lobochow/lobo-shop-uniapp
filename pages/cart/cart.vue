<template>
	<view class="root">
		<view class="hasCartInfo"
			  v-if="goodsList.length !== 0">
			<my-address></my-address>
			<view class="goodsListArea">
				<uni-swipe-action>
					<template v-for="(item, index) in goodsInfo">
						<uni-swipe-action-item :right-options="swipe_options"
											   @click="e => swipeClick(index, e)">
							<cart-goods class="cart-goods"
										:key="index"
										:goodInfo="item"
										:checked="item.checked"
										@selectedChange="goodSelect(item)"
										@numChange="value => {buyNumUpdate(item, value)}"></cart-goods>
						</uni-swipe-action-item>
					</template>
				</uni-swipe-action>
			</view>

			<cart-settle class="cart-settle"
						 @selectAll="selectAll = !selectAll"
						 @paySuccess="settleBill"
						 :checked="selectAll"
						 :totalCount="totalCount"
						 :totalCost="totalCost"></cart-settle>
		</view>
		<view class="emptyPage"
			  v-else>
			<u-empty mode="car"
					 icon="http://cdn.uviewui.com/uview/empty/car.png"> </u-empty>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		data() {
			return {
				swipe_options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				showSettle: false,
				goodsInfo: []
			};
		},
		computed: {
			...mapState('userStore', ['token']),
			...mapState('cartStore', ['goodsList']),
			selectAll: {
				get() {
					console.log('获取selectAll');
					return this.goodsInfo.every(item => item.checked === true);
				},
				set(value) {
					this.goodsInfo.forEach(item => item.checked = value);
				}
			},
			totalCount() {
				return this.goodsInfo.filter(item => item.checked).reduce((pre, cur) => pre + cur.count, 0);
			},
			totalCost() {
				return this.goodsInfo.filter(item => item.checked).reduce((pre, cur) => pre + cur.count * cur.spuInfo
					.price, 0);
			}
		},
		watch: {
			goodsList() {
				this.goodsInfo = [...this.goodsList];
				this.goodsInfo.forEach(item => this.$set(item, 'checked', true));
				uni.setTabBarBadge({
					index: 1,
					text: this.goodsList.length + ''
				})
			}
		},
		mounted() {
			this.showSettle = true;
		},
		onShow() {
			this.reqCartInfo();
		},
		methods: {
			async swipeClick(itemIndex, e) {

				//console.log('点击了' + (e.position === 'left' ? '左侧' : '右侧') + e.content.text + '按钮')
				if (e.position === 'right' && e.content.text === '删除') {
					//获取更新购物车的参数
					let goodsList = this.goodsInfo.filter((item, index) => index !== itemIndex).map(item => {
						return {
							count: item.count,
							spu_id: item.spuInfo._id
						}
					});

					uni.showLoading();
					//发起更新购物车请求
					await this.$store.dispatch('cartStore/acUpdateCart', { goodsList });
					uni.hideLoading();
				}
			},
			goodSelect(item) {
				console.log(item);
				item.checked = !item.checked;
			},
			buyNumUpdate(item, value) {
				let goodsList = this.goodsInfo.map(item => {
					return {
						count: item.count,
						spu_id: item.spuInfo._id
					}
				});

				goodsList.find(good => good.spu_id === item.spuInfo._id).count = value;

				this.$store.dispatch('cartStore/acUpdateCart', { goodsList });

			},
			async reqCartInfo() {
				uni.showLoading();
				await this.$store.dispatch('cartStore/acGetCartInfo');
				uni.hideLoading();
			},
			async settleBill() {
				//收集选中的商品
				let selectedGoods = this.goodsInfo.filter(good => good.checked);

				//整理成api要的参数形式
				/* {
					finishTime: String,
					spuList: [{
						buyNum: Number,
						spu_id: mongoose.Types.ObjectId
					}]
				} */
				let billInfo = {};
				let timeNow = new Date();
				billInfo.finishTime = timeNow.toLocaleDateString() + ' ' + timeNow.getHours() + ':' + timeNow
					.getMinutes() + ':' + timeNow.getSeconds();
				billInfo.spuList = selectedGoods.map(item => {
					return {
						buyNum: item.count,
						spu_id: item.spuInfo._id
					}
				});

				//请求接口
				uni.showLoading({
					title: '支付中'
				})
				let result = await uni.lobo.request({
					url: '/v1/bill',
					method: 'post',
					data: billInfo
				})
				uni.hideLoading();
				if (result.code === 200) {
					uni.showToast({
						title: '支付完成',
						duration: 1500
					})

					//成功后删除选中的商品，即更新购物车
					let goodsList = [];
					goodsList = this.goodsInfo.filter(item => !item.checked).map(item => {
						return {
							buyNum: item.count,
							spu_id: item.spuInfo._id
						}
					});
					this.$store.dispatch('cartStore/acUpdateCart', { goodsList });
					uni.navigateTo({
						url: "/subpkg/bill/bill"
					})

				} else {
					uni.showToast({
						title: '支付失败',
						duration: 1500
					})
				}
				console.log(result);

				//失败后什么都不做
			}
		}
	}
</script>

<style lang="scss">
	.root {

		.hasCartInfo {
			.goodsListArea {
				padding-bottom: 100rpx;
			}
		}

		.cart-settle {
			>cover-view {
				position: fixed;
				bottom: 0;

				width: 750rpx;
			}
		}
	}

	.emptyPage {
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
