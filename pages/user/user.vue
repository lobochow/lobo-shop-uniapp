<template>
	<view >
		<my-login v-if="!token"></my-login>
		<my-userInfo v-else></my-userInfo>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {

			};
		},
		computed:{
				...mapState('userStore', ['token'])
		},
		methods: {
	
		},
		mounted(){
			
		}
	}
</script>

<style lang="less">
	
</style>
