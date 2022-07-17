<template>
	<view class="root">

		<radio :checked="goodInfo.checked"
		@tap="selectedChange"
			   color="#E1251B" />

		<view class="imgWrap">
			<image :src="goodInfo.spuInfo.swipers[0].url"
			mode="aspectFit"
				   ></image>
		</view>
		<view class="column">
			<view class="title">{{title}}</view>
			<view class="row">
				<view class="price">¥{{goodInfo.spuInfo.price}}</view>
				<uni-number-box @change="buyNumChange" :value="buyNum" :min="1" :max="10"></uni-number-box>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "cart-goods",
		props:{
			goodInfo:{
				type: Object,
				default: {},
				required: true
			}
		},
		data() {
			return {
				selected: true,
				buyNum: this.goodInfo.count
			};
		},
		computed:{
			title(){
				return this.goodInfo.skuInfo.description + this.goodInfo.spuInfo.attrList.reduce( (pre, cur) => pre + ' ' + cur.attrValue, '');
			}
		},
		watch: {
			goodInfo(){
				this.buyNum = this.goodInfo.count;
			}
		},
		methods: {
			selectedChange(){
				this.$emit('selectedChange');
			},
			buyNumChange(value){
				this.$emit('numChange', value);
			}
		}
	}
</script>

<style lang="scss">
	.root {
		display: flex;
		align-items: center;

		padding: 20rpx;
		box-shadow: 0 0 10rpx rgba(0,0,0,0.3);
		
		background-color: white;
		

		checkbox {
			border-radius: 50%;
		}

		.imgWrap {
			width: 300rpx;
			height: 200rpx;
			
			display: flex;
			justify-content: center;
			align-items: center;
			

			image {
				max-width: 100%;
				max-height: 100%;
			}
		}

		.column {
			display: flex;
			flex-direction: column;
			
			flex-grow: 1;

			.title {
				font-size: 24rpx;
				margin-bottom: 40rpx;
			}

			.row {
				display: flex;
				justify-content: space-between;

				.price {
					color: #E1251B;
				}
			}
		}
	}
</style>
