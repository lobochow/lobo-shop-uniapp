<template>
	<view class="container">
		<view class="title">
			<view class="shop-name">
				{{billInfo.finishTime}}
			</view>
			<view class="bill-status">
				已完成
			</view>
		</view>

		<view class="bill-content">
			<view class="good-info">
				<view class="img-wrap">
					<image :src="billInfo.imgs[0]"
						   alt="商品图片"
						   mode="aspectFit">
				</view>
				<view class="img-wrap"
					  v-if="billInfo.imgs[1]">
					<image :src="billInfo.imgs[1]"
						   alt="商品图片"
						   mode="aspectFit">
				</view>

				<view class="description"
					  v-else>{{billInfo.description}}
				</view>
			</view>

			<view class="pay-info">
				<view class="price">
					<text style="font-size: 22rpx;">¥</text>{{billInfo.price}}
				</view>
				<view class="buy-num">
					共{{billInfo.count}}件
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-billRecord",
		props: {
			billInfo: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;

		padding: 20rpx;
		margin: 20rpx;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.3);

		.title {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.bill-status {
				font-size: 24rpx;
				color: #ccc;
			}
		}

		.bill-content {
			display: flex;
			justify-content: space-between;

			margin-top: 40rpx;

			.good-info {
				display: flex;

				margin-right: 40rpx;

				.img-wrap {
					width: 250rpx;
					height: 200rpx;

					>image {
						max-height: 100%;
						max-width: 100%;
					}
				}

				.description {
					font-size: 28rpx;
				}

			}

			.pay-info {
				display: flex;
				flex-direction: column;
				align-items: flex-end;

				align-self: center;

				.buy-num {
					font-size: 24rpx;
				}
			}

		}
	}
</style>
