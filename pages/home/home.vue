<template>
	<view class="homeContainer">
		<view class="searchArea">
			<view class="searchBar" @click="goSearchPage">
				<text>搜索</text>
			</view>
		</view>

		<view class="homeSwiperArea">
			<swiper indicator-dots
					indicator-active-color="#FFF">
				<swiper-item v-for="(item, index) in homeSwipers"
							 :key="index">
					<image :src="item.url"></image>
				</swiper-item>
			</swiper>
		</view>

		<view class="categorysArea">
			<scroll-view class="C1Area"
						 scroll-y>
				<view class="c1Item"
					  :class="{'selected' : c1SelectedIndex === index}"
					  @tap="c1TapHandler(index)"
					  v-for="(item, index) in categorysInfo.categorys"
					  :key="item._id">{{item.names}}</view>
			</scroll-view>

			<scroll-view class="subCategorysArea"
						 scroll-y>
				<view class="C2Area"
					  v-for="(item, index) in categorysInfo.categorys[c1SelectedIndex].children"
					  :key="item._id">
					<view class="C2Item">{{item.c2name}}</view>

					<view class="C3Area">
						<view class="C3Item"
							  v-for="c3item in item.children"
							  :key="c3item._id"
							  @tap="c3ItemTapHandler(c3item.c3name)">
							{{c3item.c3name}}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				c1SelectedIndex: 0,
				homeSwipers: [],
				categorysInfo: {}
			};
		},
		methods: {
			async getHomeSwipers() {
				let result = await uni.lobo.request({
					url: '/v1/homeSwiper',
					method: 'GET'
				});
				if (result.statusCode === 200) {
					this.homeSwipers = result.data;
				} else {
					console.log('获取首页轮播图失败');
				}
			},

			async getCategorys() {
				let result = await uni.lobo.request({
					url: '/v1/categorys',
					method: 'GET'
				});
				if (result.statusCode === 200) {
					//数据处理
					result.data.categorys.forEach(item => {
						item.names = item.c1names.join('/');
					})

					this.categorysInfo = result.data
				} else {
					console.log('获取总分类列表失败');
				}
			},

			keywordChangeHandler(e) {
				this.keyword = e.detail.value
			},

			goSearchPage() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			},

			c1TapHandler(index) {
				this.c1SelectedIndex = index;
			},
			
			c3ItemTapHandler(c3name) {
				uni.navigateTo({
					url: '/subpkg/searchResult/searchResult?keyword=' + c3name
				})
			},
		},
		onLoad(options) {
			this.getHomeSwipers();
			this.getCategorys();
		},

	}
</script>

<style lang="less">
	/* 搜索区域 */
	.searchArea {
		display: flex;
		align-items: center;
		justify-content: center;

		height: 100rpx;

		text-align: center;
		background-color: #E1251B;

		.searchBar{
			display: flex;
			justify-content: center;
			align-items: center;
			
			height: 60rpx;
			width: 80%;
			
			background-color: white;
			border-radius: 30rpx;
		}
	}

	/* 轮播图区域 */
	.homeSwiperArea {
		height: 30vh;
	}

	swiper-item {
		text-align: center;

		>image {
			width: 100%;
			height: 100%;
		}
	}

	/* 分类区域 */
	.categorysArea {
		display: flex;

		height: 60vh;
	}

	/* 一级分类 */
	.C1Area {
		flex-shrink: 0;

		width: 380rpx;
		height: 100%;

		font-size: 30rpx;
	}

	.c1Item {
		width: 90%;
		padding: 10rpx;

		text-align: center;

		&.selected {
			background-color: #ececec;
		}
	}

	.subCategorysArea {
		height: 100%;
	}

	.C2Area {
		box-sizing: border-box;

		padding: 0 10px;
		margin-bottom: 10px;

		width: 400rpx;
	}

	.C2Item {
		flex-shrink: 0;
		font-weight: bold;
	}

	.C3Area {
		display: flex;
		flex-wrap: wrap;
	}

	.C3Item {
		flex-shrink: 0;
		padding: 10px 10px 0 0;
		font-size: 14px;
	}
</style>
