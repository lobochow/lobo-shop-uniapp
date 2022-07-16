<template>
	<view class="root">
		<view class="chooseAddress"
			  v-if="!addressInfo.userName">
			<button @click="chooseAddr">选择地址</button>
		</view>
		<view class="showAddress"
			  v-else>
			<view class="row">
				<text class="recevier">收货人：{{addressInfo.userName}}</text>
				<text class="phone">电话：{{addressInfo.telNumber}}</text>
			</view>
			<view class="row">
				<view class="address">收货地址：{{addressInfo.provinceName + addressInfo.cityName + addressInfo.countyName + addressInfo.detailInfo}}</view>
			</view>
			<view class="bottom-line">
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		name: "my-address",
		data() {
			return {

			};
		},
		computed: {
			...mapState('userStore', ['addressInfo'])
		},
		watch: {
			addressInfo(){
				console.log(this.addressInfo);
			}
		},
		methods: {
			chooseAddr() {
				this.$store.dispatch('userStore/acGetAddress');
			}
		}
	}
</script>

<style lang="scss">
	.root {
		padding: 20rpx;

		.row {
			display: flex;
			justify-content: space-between;

			margin: 20rpx 0;
		}

		.bottom-line {
			height: 20rpx;

			background: repeating-linear-gradient(-45deg, red 0, red 45rpx, white 45rpx, white 50rpx, blue 50rpx, blue 95rpx, white 95rpx, white 100rpx, );
		}
	}
</style>
