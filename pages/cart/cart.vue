<template>
	<view class="root">
		<view class="hasCartInfo"
			  v-if="goodsList.length !== 0">
			<my-address></my-address>
			<cart-goods v-for="(item, index) in goodsInfo"
						:key="index"
						:goodInfo="item"
						:checked="item.checked"
						@selectedChange="goodSelect(item)"
						@numChange="value => {buyNumUpdate(item, value)}"></cart-goods>
			<cart-settle @selectAll="selectAll = !selectAll"
						 :checked="selectAll"></cart-settle>
		</view>
		<view class="emptyPage" v-else>
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
				goodsInfo: [],
				test: { name: 'haha' }
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
			}
		},
		watch: {
			goodsList() {
				this.goodsInfo = [...this.goodsList];
				this.goodsInfo.forEach(item => this.$set(item, 'checked', true));
			}
		},
		mounted() {

		},
		onShow() {
			this.$store.dispatch('cartStore/acGetCartInfo');
			uni.setTabBarBadge({
				index: 1,
				text: this.goodsList.length + ''
			})
		},
		methods: {
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

			}
		}
	}
</script>

<style lang="scss">
	.root {
		background-color: white;

		cart-settle {
			position: fixed;
			bottom: 0;

			width: 750rpx;
		}
	}
	
	.emptyPage{
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
