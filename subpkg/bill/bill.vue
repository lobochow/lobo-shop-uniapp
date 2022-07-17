<template>
	<view>
		<my-billRecord v-for="(billItem, index) in showBillList"
					   :key="index"
					   :billInfo="billItem"></my-billRecord>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				billList: []
			};
		},
		computed: {
			showBillList() {
				let result = [];
				result = this.billList.map(billItem => {
					return {
						finishTime: billItem.finishTime,
						imgs: billItem.spuInfo.map(spuItem => spuItem.swipers[0].url),
						description: billItem.spuInfo.map(spuItem => spuItem.attrList.reduce((pre, cur) => pre +
							cur.attrValue + ' ', '')).join('-'),
						price: billItem.spuList.reduce((pre, cur) => pre + cur.buyNum * billItem.spuInfo.find(
							item => item._id === cur.spu_id).price, 0),
						count: billItem.spuList.reduce((pre, cur) => pre + cur.buyNum, 0)
					}
				});

				return result;
			}
		},
		created() {
			this.getBillList();
		},
		methods: {
			async getBillList() {
				let result = await uni.lobo.request({
					url: "/v1/bill",
					method: "GET"
				});
				if (result.code === 200) {
					this.billList = result.data;
				}
			}
		}
	}
</script>

<style lang="scss">

</style>
