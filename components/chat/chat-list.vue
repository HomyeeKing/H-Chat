<template>
	<view>
		<template v-if="item.type=='note'">
			<view  class="u-f-ajc">
				<view class="note u-f-ajc">
					{{item.note}}
				</view >
			</view>
		</template>
		<template v-else>
			<view class="u-f-ajc">
				<text v-if="item.gsTime">{{item.gsTime}}</text>
			</view>
			<view class="chatList u-f-at" :class="{me:item.isme}">
				<image v-if="!item.isme" :src="item.userPic" mode="widthFix" lazy-load></image>
				<view>
					<view v-if="ufrom" class="uname" :class="{me:item.isme}">{{item.username}}</view>
					<view class="chat-list-body u-f-ajc">					
						<!-- 文字信息 -->
						<text selectable="true" space="nbsp" v-if="item.type=='text'">{{item.data}}</text>
						
						<!-- 图片 -->
						<image v-if="item.type=='image'" :src="item.src" mode="aspectFit" lazy-load></image>			
					</view>
				</view>
				<image v-if="item.isme" :src="item.userPic" mode="widthFix" lazy-load></image>		
			</view>				
		</template>
		
	</view>
</template>

<script>
	export default {
		props:{
			item:Object,
			notes:Array,
			ufrom:{
				type:Number,
				default:0//0私聊 1 群聊
			}
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
	page{
		background-image: url(../../static/img/chatbg.jpg);
		background-size: 100% 100%;
	}
	/* 消息对话框 */
.chatList{
		margin-bottom: 50upx;
	}
	.chatList>image{
		width: 80upx;
		height: 80upx;
		flex-shrink: 0;
		border-radius: 100%;
	}
	.chatList .uname{
		color: gold;
		margin-left: 30upx;
	}
	.chatList .uname.me{
		margin-left: 70upx;
	}
	.chat-list-body{		
		position: relative;			
		border-radius: 20upx;
		background-color: #f4f4f4;
		padding: 8upx 20upx 8upx 10upx;
		margin-left: 20upx;
		top: 10upx;
	}
	.chat-list-body.isimg{
		
	}
	
	.chat-list-body:after{
		position: absolute;
		left: -29upx;
		content: "";
		top: 10upx;
		border: #f4f4f4 16upx solid;
		border-color:transparent  #f4f4f4  transparent transparent;
	}
	.chat-list-body text{
		max-width: 300upx;
		word-wrap: break-word;
	}
	.me{
		justify-content: flex-end;
	}
	.me .chat-list-body{
		margin-right: 20upx;
		background-color: #007AFF;
		color: #FFFF00;
	}	
	.me .chat-list-body:after{
		left: auto;
		right: -30upx;
		border-color:transparent  transparent transparent #007AFF ;
		
	}
	.chat-list-body>image{
		max-width: 150upx;
		max-height: 200upx;
	}
	
	/* 提示信息 */
	.note{
		width: 400upx;		
		background-color: #b8b8b8;
		color: #fff;
		border-radius: 20upx;
		margin-top: 30upx;
	}
</style>
