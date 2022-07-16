<template>
	<view>
		<uni-search-bar v-model="keyword"
						@confirm="searchBarConfirmHandler"
						@focus="searchBarFocus"
						@blur="searchBarBlur"
						:focus="true"></uni-search-bar>

		<my-drawer :show="showHistory">
			<view class="searchHistory">
				<view class="title">
					<text>搜索历史</text>
					<i class="iconfont lajitong"></i>
				</view>
				<view class="content">
					<text v-for="(text, index) in searchHistory"
						  :key="text"
						  @tap="historyTap(text)">{{text}}</text>
				</view>
			</view>
		</my-drawer>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//搜索栏
				keyword: '',

				//搜索历史数据
				showHistory: false,
				searchHistory: ['手机', '耳机', '垃圾桶', '收音机', '拖鞋'],
			}
		},

		methods: {
			searchBarFocus() {
				this.showHistory = true;
			},
			searchBarBlur() {
				this.showHistory = false;
			},

			//searchBar-confirm事件处理函数
			async searchBarConfirmHandler(e) {
				/* 
				 **	e={value:String}
				 */

				uni.navigateTo({
					url: '/subpkg/searchResult/searchResult?keyword=' + this.keyword
				})
			},

			//历史搜索记录点击事件
			async historyTap(text) {
				uni.navigateTo({
					url: '/subpkg/searchResult/searchResult?keyword=' + text
				})
			}
		},
	}
</script>

<style lang="scss">
	/* 搜索历史区域 */
	.searchHistory {
		position: relative;
		z-index: 3;
		padding: 0 20rpx;

		.title {
			>text {
				font-weight: bold;
			}
		}

		.content {
			>text {
				display: inline-block;

				margin: 12rpx;
				padding: 8rpx 16rpx;

				border-radius: 20rpx;

				background-color: white;
			}
		}
	}
</style>
