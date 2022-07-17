<template>
	<cover-view class="root">
		<!-- <label>
			<radio :checked="checked"
				   @click="radioChange"
				   color="#E1251B" /><text>全选</text>
		</label> -->
		<cover-view class="selectAll"
					:class="{'selected': checked}"
					@click="radioChange">
			<!-- <uni-icons type="checkmarkempty"
					   :class="{'selected': checked}"
					   @click="radioChange"
					   size="20"></uni-icons> -->
			全选
		</cover-view>
		<cover-view class="account">
			合计：¥{{totalCost}}
		</cover-view>
		<cover-view class="settleButton"
					@tap="paySuccess">
			结算({{totalCount}})
		</cover-view>
	</cover-view>
</template>

<script>
	export default {
		name: "cart-settle",
		props: {
			checked: {
				type: Boolean
			},
			totalCount: {
				type: Number,
				default: 0
			},
			totalCost: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				show_pay: false
			};
		},
		methods: {
			radioChange() {
				this.$emit('selectAll')
			},
			paySuccess() {
				this.$emit('paySuccess')
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

		>label {
			padding-left: 20rpx;
		}

		.selectAll {
			padding-left: 20rpx;

			&.selected {
				color: #E1251B;
			}

			uni-icons {

				margin-right: 5px;

				>text {
					display: inline-block;
					width: 24px;
					height: 24px;
					background-color: white;
					border: 1px solid #CCC;
					border-radius: 50%;
					color: white !important;
				}

				&.selected {
					>text {
						background-color: #E1251B;
					}
				}
			}
		}

		.settleButton {
			padding: 24rpx 30rpx;

			color: white;

			background-color: #E1251B;

			transition: 0.1s ease;

			&:active {
				background-color: #a91b13
			}
		}
	}
</style>
