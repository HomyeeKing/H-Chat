<template>
	<view>		
		<view class="index-one">
			<uni-list>
				<uni-list-item 
				:title="fromUser.username" 
				titleStyle="fontWeight:Bold;"
				:thumb="fromUser.avatar"
				showArrow="true"/>
			</uni-list>
		</view>
		<view>
			<uni-combox
			label="附加消息" 
			labelWidth="80px"		
			 :showArrow=false
			 :value="fromUser.text"
			 emptyTips=""/>		
		 </view>
		 <view class="u-f u-f-jsb index-3">
			 <button type="default"  @tap="refuse" style="background-color: #f4f4f4;">拒绝</button>
			 <button type="primary" @tap="agree">同意</button>			 
		 </view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import uniCombox from "@/components/uni-combox/uni-combox"
	export default {
		components: {uniCombox},		
		onLoad(e) {
			
			this.fromUser =JSON.parse(e.user);
			// console.log(this.fromUser);
		},
		data() {
			return {		
				fromUser:{}
			}
		},
		computed:mapState(['user']),
		methods: {
			agree(){
				uni.navigateTo({
					url:"afterAgree?user="+encodeURIComponent(JSON.stringify(this.fromUser))
				})
			},
			refuse(){
				// 给对方的提示
				let fromUser={
					to:this.fromUser.username,
					fromInfo:{
						username:this.user.username,
						note:"对方已拒绝",					
						avatar:this.user.avatar	,
						type:1,//表明是个返回，无需箭头
					}
							
				};	
				// 给自己的提示
				let fromUserMe={
					username:this.fromUser.username,
					type:1,//表明是个返回，无需箭头
					note:this.fromUser.text+"      已拒绝",					
					avatar:this.fromUser.avatar,
					showDot:false//自己的不必提示
				};				
				uni.$emit("isToBeFriend",fromUserMe);
				this.$socket.emit('dealFriStuf',fromUser)
				setTimeout(()=>{
					uni.navigateBack()
				},2000)
			}
		},
		
	
	}
</script>

<style scoped>
	
	
page>view>view{
	margin-bottom: 10upx;
	border-top: 1upx solid #d4d4d4;
}
.index-3{
	margin-top: 100upx;
	border-top: none;
}
.index-3>button{
	width: 300upx;
}
</style>
