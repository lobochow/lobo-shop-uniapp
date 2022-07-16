<template>
	<view class="container">
		<u-avatar :src="none"
				  class="avatar"
				  size="100"></u-avatar>

		<button type="primary"
				class="loginButton"
				@click="login">一键登录</button>

		<text class="tipText">登陆后尽享更多权益</text>
	</view>
</template>

<script>
	export default {
		name: "my-login",
		data() {
			return {

			};
		},
		methods: {
			login() {
				this.$store.dispatch('userStore/acLogin');
			}
		}
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;

		margin-top: 200rpx;

		.loginButton {
			width: 600rpx;
			margin-top: 40rpx;

			border-radius: 60rpx;
		}

		.tipText {
			margin-top: 30rpx;

			font-size: 24rpx;

			&::before,
			&::after {
				content: ' ';

				display: inline-block;

				vertical-align: middle;

				height: 2rpx;
				width: 80rpx;
				margin: 0 10rpx;

				background-color: #CCC;
			}
		}
	}
</style>
