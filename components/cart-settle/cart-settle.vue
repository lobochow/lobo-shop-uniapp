<template>
	<view class="root">
		<label>
			<radio :checked="checked" @click="radioChange"
				   color="#E1251B" /><text>全选</text>
		</label>
		<view class="account">
			合计：¥9299
		</view>
		<view class="settleButton">
			结算(1)
		</view>
	</view>
</template>

<script>
	export default {
		name: "cart-settle",
		props: {
			checked:{
				type: Boolean
			}
		},
		data() {
			return {

			};
		},
		methods:{
			radioChange(){
				this.$emit('selectAll')
			}
		}
	}
</script>

<style lang="scss">
	.root {
		display: flex;
		align-items: center;
		justify-content: space-between;

		border: 2rpx solid #ddd;
		
		>label{
			padding-left: 20rpx;
		}

		.settleButton {
			padding: 24rpx 30rpx;
			
			color: white;
			
			background-color: #E1251B;
			
			transition: 0.1s ease;
			
			&:active{
				background-color: #a91b13
			}
		}
	}
</style>
