<template>
	<view>
		<my-login v-if="!token"></my-login>
		<my-userInfo v-else></my-userInfo>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data() {
			return {

			};
		},
		computed: {
			...mapState('userStore', ['token']),
			...mapState('cartStore', ['goodsList']),
		},
		watch: {
			goodsList() {
				uni.setTabBarBadge({
					index: 1,
					text: this.goodsList.length + ''
				})
			}
		},
		methods: {

		},
		created() {
			this.$store.dispatch('userStore/acGetUserInfo');
			this.$store.dispatch('cartStore/acGetCartInfo');
		},
		mounted() {

		}
	}
</script>

<style lang="less">

</style>
