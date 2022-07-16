<template>
	<view>
		<uni-search-bar v-model="keyword"
						@confirm="searchBarConfirmHandler"
						@focus="searchBarFocus"
						@blur="searchBarBlur"></uni-search-bar>
		<view class="hasList"
			  v-if="spuList.length !== 0">

			<scroll-view class="attrNameList"
						 scroll-x
						 :hidden="hiddenSaleAttrList"
						 enable-flex>
				<view class="saleAttrItem"
					  :class="{'selected-attrName': index === selectedAttrIndex && !hideAttrListPanel}"
					  v-for="(item, index) in attrList"
					  :key="index"
					  @tap="selectAttr(index)">
					{{item.selectedValue ? item.attrName + '-' + item.selectedValue : item.attrName}}
				</view>
			</scroll-view>


			<my-drawer :show="!hideAttrListPanel">
				<view class="saleAttrVauleArea">
					<view class="attrValueItem"
						  :class="{'selectedValue': isSelectedAttrValue(selected_attrName, item)}"
						  v-for="(item, index) in selected_attr_values"
						  :key="index"
						  @tap="selectAttrValue(index)">{{item}}</view>
				</view>
			</my-drawer>


			<view class="spuListArea">
				<view class="spuItem"
					  v-for="item in spuList"
					  :key="item._id"
					  @tap="goDetail(item._id, item.skuInfo._id)">
					<view class="imgWrap">
						<image :src="item.swipers[0].url"
							   mode="widthFix"></image>
					</view>
					<view class="spuItemDes">
						<text>{{item.skuInfo.description}}</text>
						<text>{{item.attrValueString}}</text>
						<text class="spuPrice">¥{{item.price}}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="emptyResult">
			<u-empty mode="search"
					 icon="http://cdn.uviewui.com/uview/empty/search.png">
			</u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//搜索栏
				keyword: '',

				//销售属性筛选
				selectedAttrIndex: -1,
				selectedAttrValueIndex: -1,
				hideAttrListPanel: true,
				selectedAttrList: [],
				selected_attrName: '',
				//请求原始数据
				keyWordSpuList: [],
				spuList: [],
			}
		},
		computed: {
			attrList() {
				let tmpAttrList = []
				let attrListMap = new Map();
				this.keyWordSpuList.forEach(spuItem => {
					spuItem.attrList.forEach(spuAttrItem => {
						let attrValueSet = undefined;
						if (attrListMap.has(spuAttrItem.attrName)) {
							attrValueSet = attrListMap.get(spuAttrItem.attrName);
						} else {
							attrValueSet = new Set();
							attrListMap.set(spuAttrItem.attrName, attrValueSet);
						}

						attrValueSet.add(spuAttrItem.attrValue);
					})
				})
				for (let pair of attrListMap) {
					tmpAttrList.push({
						attrName: pair[0],
						values: Array.from(pair[1])
					})
				}

				return tmpAttrList;
			},
			hiddenSaleAttrList() {
				return this.spuList.length === 0;
			},
			selected_attr_values() {
				if (this.selectedAttrIndex !== -1) {
					return this.attrList[this.selectedAttrIndex].values;
				} else {
					return []
				}
			}
		},
		watch: {
			spuList() {
				//拼接销售属性得到商品描述
				this.spuList.forEach(item => {
					item.attrValueString = item.attrList.reduce((pre, cur) => pre + cur.attrValue + ' ', '')
				})
			}
		},
		methods: {
			searchBarFocus() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			},

			//searchBar-confirm事件处理函数
			async searchBarConfirmHandler(e) {
				/* 
				 **	e={value:String}
				 */

				//请求更新数据
				this.spuList = this.keyWordSpuList = await this.reqSpuList({ keyword: e.value });
			},

			async goDetail(spu_id, sku_id) {
				uni.navigateTo({
					url: `/subpkg/spuDetail/spuDetail?_id=${spu_id}&sku_id=${sku_id}`,
				})
			},

			selectAttr(index) {
				//更新组件状态
				if (this.hideAttrListPanel === true) {
					this.hideAttrListPanel = false
				} else if (this.selectedAttrIndex === index) {
					this.hideAttrListPanel = true
				}
				//更新数据
				this.selectedAttrIndex = index
				this.selected_attrName = this.attrList[index].attrName
			},

			//销售属性值事件处理函数
			selectAttrValue(index) {
				let { selectedAttrList, selectedAttrIndex, attrList } = this

				let attrName = attrList[selectedAttrIndex].attrName
				let attrValue = attrList[selectedAttrIndex].values[index]

				let targetSelectedAttrIndex = selectedAttrList.findIndex(item => item.attrName === attrName)
				if (selectedAttrList[targetSelectedAttrIndex]) {
					if (selectedAttrList[targetSelectedAttrIndex].attrValue === attrValue) {
						selectedAttrList.splice(targetSelectedAttrIndex, 1)
						attrList[selectedAttrIndex].selectedValue = ''
						this.selectedAttrValueIndex = -1
					} else {
						selectedAttrList[targetSelectedAttrIndex].attrValue = attrValue
						attrList[selectedAttrIndex].selectedValue = attrValue
						this.selectedAttrValueIndex = index
					}
				} else {
					selectedAttrList.push({
						attrName: attrName,
						attrValue: attrValue
					})

					attrList[selectedAttrIndex].selectedValue = attrValue
					this.selectedAttrValueIndex = index
				}

				this.selectedAttrList = selectedAttrList
				this.hideAttrListPanel = true

				let query = {}
				query.keyword = this.keyword
				selectedAttrList.forEach(item => {
					query[item.attrName] = item.attrValue
				})

				this.updateSpuInfo(query)
			},

			async initSpuInfo(query) {
				//请求spu列表数据
				let data = await this.reqSpuList(query);

				this.keyWordSpuList = this.spuList = data;
			},

			async updateSpuInfo(query) {
				let result = await uni.lobo.request({
					url: '/v1/search',
					method: 'GET',
					query
				})

				//数据处理
				result.data.data.forEach(item => {
					item.attrValueString = item.attrList.reduce((pre, cur) => pre + cur.attrValue + ' ', '')
				})

				this.spuList = result.data.data
			},

			//请求spu列表数据
			async reqSpuList(queryObj) {
				let result = await uni.lobo.request({
					url: '/v1/search',
					method: 'GET',
					query: queryObj
				})

				return result.data.data;
			},

			isSelectedAttrValue(attrName, attrVaule) {
				return this.selectedAttrList.some(item => item.attrName === attrName && item.attrValue === attrVaule);
			},

		},
		onLoad(options) {
			console.log(options)
			this.keyword = options.keyword
			this.initSpuInfo({ keyword: this.keyword })
		},
	}
</script>

<style lang="scss">
	/* 搜索结果为空 */
	.emptyResult {
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* 商品销售属性筛选区域 */

	.attrNameList {
		position: relative;
		z-index: 2;

		display: flex;

		height: 80rpx;
		background-color: #ececec;

		.saleAttrItem {
			display: flex;
			align-items: center;

			padding: 0 10rpx;
			margin: 0 10rpx;

			transition: 0.3s ease;

			&.selected-attrName {
				background-color: white;
				border-radius: 20rpx 20rpx 0 0;
			}
		}
	}

	.saleAttrVauleArea {
		display: flex;
		flex-wrap: wrap;

		width: 750rpx;

		background-color: white;

		.attrValueItem {
			padding: 20rpx;
			border: 2rpx solid transparent;
			flex-shrink: 0;

			&.selectedValue {
				color: #e1251b;
			}
		}
	}

	/* 商品列表区域 */
	.spuListArea {
		.spuItem {
			display: flex;

			.imgWrap {
				display: flex;
				justify-content: center;
				align-items: center;

				height: 200rpx;
				width: 350rpx;

				>image {
					width: 50%;

					box-shadow: 0 1rpx 5rpx rgba(0, 0, 0, 0.3);
				}
			}

			.spuItemDes {
				display: flex;
				flex-direction: column;
				justify-content: space-around;

				padding: 10rpx 0;

				.spuPrice {
					color: #e1251b;
					font-size: 40rpx;
				}
			}
		}
	}
</style>
