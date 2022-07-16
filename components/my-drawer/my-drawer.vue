<template>
	<view class="drawerWrap"
		  :class="{'show': show}">
		<view class="drawer"
			  :class="{'show': show}">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-drawer",
		props: {
			show: {
				tyep: Boolean,
				default: false
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.drawerWrap {
		position: absolute;
		overflow: hidden;

		padding-bottom: 0;

		transform-origin: 0 0;
		transform: scaleY(0);
		transition: 1s ease;

		.drawer {
			position: relative;
			z-index: 1;


			transition: 0.3s ease;
			transform: translateY(-100%);

			&.show {
				transform: translateY(0);
			}
		}

		&.show {
			padding-bottom: 20rpx;
			transition: 0s ease;
			transform: scaleY(1);
		}
	}
</style>
