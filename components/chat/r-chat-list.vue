<template>
	<view>
		<view class="chatList">
			<template v-if="item.type=='person'">
				<view class="chatItem u-f-ac u-f-jsb" @tap="chat">
					<!-- 头像 -->
					<image :src="item.friAvatar" mode="widthFix" lazy-load></image>
					
					<view class="u-f1">
						<!-- 用户名和时间 -->
						<view class="u-f u-f-jsb">{{item.beizhu?item.beizhu:item.friName}} <view>{{item.lastChatTime}}</view></view>
						<!-- 消息和未读消息数量 -->
						<view class="u-f u-f-jsb">
							{{item.lastMsg}}
							<uni-badge :text="item.weidu" type="error"></uni-badge>
						</view>
					</view>
				</view>
			</template>
			<template v-else>
				<view class="chatItem u-f-ac u-f-jsb" @tap="chat">
					<!-- 头像 -->
					<image :src="item.groupAvatar" mode="widthFix" lazy-load></image>
					
					<view class="u-f1">
						<!-- 用户名和时间 -->
						<view class="u-f u-f-jsb">{{item.groupName}} <view>{{item.lastChatTime}}</view></view>
						<!-- 消息和未读消息数量 -->
						<view class="u-f u-f-jsb">
							{{item.lastMsg}}
							<uni-badge :text="item.weidu" type="error"></uni-badge>
						</view>
					</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	import uniBadge from '@/components/uni-badge/uni-badge.vue'
	export default {
		components:{uniBadge},
		props:{
			item:Object,			
			weidu:Number
		},
		data() {
			return {
				
			}
		},
		methods: {
			chat(){
				this.$emit('chat')
				
			}
		}
	}
</script>

<style scoped>
.chatList .chatItem{
	/* border-bottom: 1upx #E3DFDE solid; */
	margin-bottom: 20upx;
}
.chatList .chatItem>image{
	width: 70upx;
	height: 70upx;
	flex-shrink: 0;
	border-radius: 100%;
	margin-right: 10upx;
}


.chatItem view>view:first-child>view{
	color:#cbcbcb;
	font-size: 30upx;
}
.chatItem view>view:last-child{
	color:#999;
	font-size: 27upx;
}

</style>
