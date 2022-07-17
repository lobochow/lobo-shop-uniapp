<template>
	<view>
		<view class="userInfo">
			<u-avatar :src="userInfo.avatarUrl"
					  class="avatar"
					  size="100"></u-avatar>
			<text>{{userInfo.nickName}}</text>
		</view>

		<view class="favPanel">
			<view class="favItem">
				<text>8</text>
				<text>收藏的店铺</text>
			</view>
			<view class="favItem">
				<text>8</text>
				<text>收藏的商品</text>
			</view>
			<view class="favItem">
				<text>8</text>
				<text>关注的商品</text>
			</view>
			<view class="favItem">
				<text>8</text>
				<text>足迹</text>
			</view>
		</view>

		<view class="billPanel">
			<view class="title">我的订单</view>
			<u-line></u-line>
			<view class="billIconsContainer">
				<view class="billPanelItem" @tap="goBillPage">
					<i class="iconfont icon-daifukuan"></i>
					<text>待付款</text>
				</view>
				<view class="billPanelItem" @tap="goBillPage">
					<i class="iconfont icon-huoche"></i>
					<text>待收货</text>
				</view>
				<view class="billPanelItem" @tap="goBillPage">
					<i class="iconfont icon-tuikuan"></i>
					<text>退款/退货</text>
				</view>
				<view class="billPanelItem" @tap="goBillPage">
					<i class="iconfont icon-dingdan"></i>
					<text>全部订单</text>
				</view>
			</view>
		</view>

		<uni-list>
			<uni-list-item title="收货地址"
						   link></uni-list-item>
			<uni-list-item title="联系客服"
						   link></uni-list-item>
			<uni-list-item title="退出登陆"
						   link @tap='logout'></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import {mapState} from "vuex"
	
	export default {
		name: "my-userInfo",
		data() {
			return {

			};
		},
		computed:{
			...mapState('userStore', ['userInfo'])
		},
		mounted(){
			console.log('userInfo',this.userInfo);
		},
		methods: {
			logout(){
				this.$store.dispatch('userStore/acLogout');
			},
			goBillPage(){
				uni.navigateTo({
					url:"/subpkg/bill/bill"
				})
			}
		}
	}
</script>

<style lang="scss">
	.userInfo {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		height: 400rpx;

		background-color: #E1251B;

		>text {
			margin-top: 20rpx;
			color: white;
		}
	}

	.favPanel {
		display: flex;
		justify-content: space-around;

		width: 700rpx;

		margin: 0 auto;
		margin-top: -30rpx;
		padding: 20rpx 0;

		border-radius: 10rpx;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.3);

		background-color: white;

		.favItem {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			font-size: 26rpx;
		}
	}

	.billPanel {
		width: 700rpx;
		margin: 20rpx auto;

		border-radius: 10rpx;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.3);

		background-color: white;

		.title {
			padding: 20rpx;
		}

		.billIconsContainer {
			display: flex;
			justify-content: space-around;

			padding: 20rpx 0;

			.billPanelItem {
				display: flex;
				flex-direction: column;
				align-items: center;

				.iconfont {
					font-size: 60rpx;
					color: #E1251B;
				}

				>text {
					margin-top: 6rpx;
					font-size: 24rpx;
				}
			}
		}
	}

	uni-list {
		//穿透shadow-root
		>view {
			width: 700rpx;
			margin: 0 auto;
			
			border-radius: 10rpx;
			box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.3);
			
			overflow: hidden;
			
			//消除上下边线
			>view{
				display: none;
			}
		}
		
		uni-list-item {
			//穿透shadow-root
			>view{
				background-color: transparent;
			}
		}
	}
</style>
