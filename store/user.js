const state = {
	userInfo: {},
	addressInfo: {},
	token: uni.getStorageSync('token')
}

const actions = {
	async acGetUserInfo(context) {
		let result = await uni.lobo.request({
			url: '/v1/userInfo'
		});

		if (result.statusCode === 200 && result.data.code === 200) {
			context.commit('muGetUserInfo', result.data.data.userInfo)
		}

	},
	async acLogin(context) {

		let { userInfo } = await new Promise((resolve, rej) => {
			uni.getUserProfile({
				desc: '个人测试',
				success: res => resolve(res),
				fail: err => rej(err)
			})
		})

		//非云托管版
		/* let { code } = await new Promise((resolve, rej) => {
			uni.login({
				success: res => resolve(res),
				fail: err => rej(err)
			})
		})		

		let token = await uni.lobo.request({
			url: '/mircoApp/login',
			method: "POST",
			data: {
				code,
				userInfo
			}
		}) */

		//云托管版本
		let res = await wx.cloud.callContainer({
			"config": {
				"env": "prod-8gmhhtejbb2f1d96"
			},
			"path": '/mircoApp/login',
			"header": {
				"X-WX-SERVICE": "lobo-shop",
				"content-type": "application/json",
			},
			"method": 'POST',
		})

		context.commit('muSetToken', res.data);
		context.commit('muGetUserInfo', userInfo);
	},
	acLogout(context) {
		context.commit('muSetToken', '');
	},
	acGetAddress(context) {
		uni.chooseAddress({
			success: res => {
				context.commit('muGetAddress', res);
			}
		})
	}
}

const mutations = {
	muGetUserInfo(state, userInfoObj) {
		state.userInfo = userInfoObj;
	},
	muSetToken(state, token) {
		state.token = token;
		uni.setStorageSync('token', token);
	},
	muGetAddress(state, addressInfo) {
		state.addressInfo = addressInfo;
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
