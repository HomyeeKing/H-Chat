<template>
	<view>
		<!-- 底部消息发送框 -->
		<view class="messageBox u-f-ac">
			<input class="u-f1" v-model="message" placeholder="请输入消息..."  />
			<view  class="icon iconfont icon-shandian u-f-ajc" :class="{disabled:checkEmpty}"  @tap="send"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				message: "",

			}
		},
		methods: {
			send() {
				if(this.message == ""){
					uni.showToast({
						title:"不能发送空消息哦",
						icon:"none"
						
					})
				}else{
					this.$emit('send', this.message);
					this.message = ""
				}
				
				
				

			}
		},
		computed: {
			checkEmpty() {
				return this.message ? false : true;

			}
		},
	}
</script>

<style scoped>
	/* 底部发送框 */
	.messageBox {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 120upx;
		background-color: #FFFFFF;
		padding: 0 20upx;
		border-top: 1upx solid #eee;
	}
	.messageBox>input{
		height: 70upx;
		background-color: #f7f7f7;
		margin-right: 20upx;
		padding: 10upx;
		border-radius: 10upx;
	}
	.messageBox>view{
		color:#fff;
		font-size: 45upx;
		width: 80upx;
		background-color: #007AFF;
	}
	.messageBox>view.disabled{
		background-color: #EEEEEE;
	}
</style>
