<template>
	<view>
		<view class="other-login u-f-ac u-f-jsb">
			<block v-for="(item,index) in icons" :key=index>
				<view>
					<view :class="item" class="iconfont u-f-ajc"></view>
				</view>
			</block>			
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			icons:Array
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
.other-login {
		padding: 20upx 80upx;
	}

	.other-login>view>view {
		width: 100upx;
		height: 100upx;
		border: 1upx solid;
		border-radius: 100%;
		font-size: 55upx;
		color: #fff;
	}

	.other-login .icon-weixin {
		background-color: #2bd19b;
	}

	.other-login .icon-qq {
		background-color: #2caefc;
	}

	.other-login .icon-wode {
		background-color: #fc7729;
	}

</style>
