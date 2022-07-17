const state = {
	goodsList: []
}

const actions = {
	async acGetCartInfo(context) {
		let result = await uni.lobo.request({
			url: '/v1/cart',
			method: 'GET'
		})

		if (result.code === 200) {
			context.commit('muGetCartInfo', result.data);
		}

	},

	async acUpdateCart(context, data) {
		/* data数据结构
		{
		    user_id: mongoose.Types.ObjectId,
		    goodsList: {
		        type: [{
		            count: Number,
		            spu_id: mongoose.Types.ObjectId
		        }]
		    }
		}
		 */
		let result = await uni.lobo.request({
			url: '/v1/cart',
			method: 'POST',
			data
		})

		if (result.code === 200) {
			context.dispatch('acGetCartInfo');
		}

		return result?.code;
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
