//云托管初始化
wx.cloud.init();

//封装请求函数
uni.lobo = {};

//配置全局url
uni.lobo.env = 'pro';
if (uni.lobo.env === 'dev') {
	uni.lobo.baseURL = 'http://127.0.0.1:8088'
} else {
	uni.lobo.baseURL = ''
}

uni.lobo.request = async function({ url, method, data, query, header }) {
	let result = {};
	//获取token
	let token = uni.getStorageSync('token');

	//判断是不是本地开发测试
	if (uni.lobo.env === 'dev') {
		//请求拦截

		result = await new Promise((resolve, reject) => {
			uni.request({
				url: uni.lobo.baseURL + url + (query ? ('?' + uni.lobo.urlEndcode(query)) : ''),
				method,
				data,
				header: { token },
				success: res => {
					//响应拦截
					if (res.data.code === 201) {
						store.commit('userStore/muSetToken', '')
						uni.switchTab({
							url: '/pages/user/user'
						})
						resolve({})
					} else {
						resolve(res.data);
					}
				}
			})
		})
	} else {
		//请求拦截

		result = await wx.cloud.callContainer({
			"config": {
				"env": "prod-8gmhhtejbb2f1d96"
			},
			"path": url + (query ? ('?' + uni.lobo.urlEndcode(query)) : ''),
			"header": {
				"X-WX-SERVICE": "lobo-shop",
				"content-type": "application/json",
				"token": token
			},
			data,
			"method": method,
		})

		//响应拦截
		//登陆超时
		result = result.data;
		if (result.code === 201) {
			store.commit('userStore/muSetToken', '')
			uni.showToast({
				title: '请先登陆',
				icon: 'error',
				duration: 1500
			})
			setTimeout(() => {
				uni.switchTab({
					url: '/pages/user/user'
				})
			}, 500)
		}

	}

	return result;
}

//query参数urlEncode
uni.lobo.urlEndcode = query => {
	let params = Object.keys(query).map(key => {
		return encodeURIComponent(key) + '=' + encodeURIComponent(query[key])
	}).join('&')
	return params;
}

// #ifndef VUE3
import Vue from 'vue'
import App from './App'

//引入Uview
import uView from '@/uni_modules/uview-ui'

//引入vuex
import store from './store/index.js'

Vue.use(uView)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
import res from 'express/lib/response';
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
