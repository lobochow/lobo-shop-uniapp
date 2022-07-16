const state = {
	goodsList: []
}

const actions = {
	async acGetCartInfo(context) {
		let result = await uni.lobo.request({
			url: '/v1/cart',
			method: 'GET'
		})

		if (result.data.code === 200) {
			context.commit('muGetCartInfo', result.data.data);
		}

	},

	async acUpdateCart(context, data) {
		let result = await uni.lobo.request({
			url: '/v1/cart',
			method: 'POST',
			data
		})
		
		if(result.statusCode === 200 && result.data.code === 200){
			context.dispatch('acGetCartInfo');
		}
		
		return result?.data?.code;
	}
}

const mutations = {
	muGetCartInfo(state, goodsList) {
		state.goodsList = goodsList;
	}
}

const getters = {}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
