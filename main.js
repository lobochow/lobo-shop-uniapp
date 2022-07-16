//云托管初始化
wx.cloud.init();



//封装请求函数
uni.lobo = {};
uni.lobo.request = async function({
	url,
	method,
	data,
	query,
	header
}) {
	uni.showLoading({
		title: '请求数据中'
	})
	
	let result = {};
	//获取token
	let token = uni.getStorageSync('token');

	//判断是不是本地开发测试
	if (url.indexOf('127.0.0.1') !== -1) {
		//请求拦截
		console.log('本地请求');

		result = await new Promise((resolve, reject) => {
			uni.request({
				url,
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
					console.log('本地请求成功')
				},
				fail: err => console.log('本地请求失败:', url, err),
				complete: () => console.log('本地请求结束了')
			})
		})
		
		console.log('返回响应');
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
		if (result.data.code === 201) {
			store.commit('userStore/muSetToken', '')
			uni.showToast({
				title: '请先登陆',
				icon: 'none',
				duration:1500
			})
			setTimeout( () => {
				uni.switchTab({
					url: '/pages/user/user'
				})
			}, 500)
		}

	}
	
	uni.hideLoading();
	
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
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
