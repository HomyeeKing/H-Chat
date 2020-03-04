<template>
	<view>
		<view class="selfInfo u-f u-f-jsb">
			<block v-for="(item,index) in homeData" :key=index>
				<view class="u-f-ajc u-f-colum">
					<view>{{item.num}}</view> 
					{{item.name}}
				</view>
			</block>				
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			homeData:Array
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped>
	/* 信息展示 */
	.selfInfo{
		margin-top: 30upx;
		padding: 0 180upx;
	}
</style>
