<template>
	<view >
		<uni-list v-if="inputContent">		   
		    <uni-list-item  
			:title="'找人：'+inputContent"
			:show-extra-icon="true"
			@tap="search"
			 :extra-icon="{color: '#4cd964',size: '22',type: 'person'}"/>	    
		    <uni-list-item  
			:title="'找群：'+inputContent"
			:show-extra-icon="true"
			@tap="search"
			 :extra-icon="{color: '#4cd964',size: '22',type: 'contact'}"/>
		</uni-list>
		<view class="u-f-ajc u-f-colum">
			<text style="color: #BEBEBE;">搜索指定内容</text>
			<view v-if="exist" class="res">					
					<uni-card  
					mode="title"
					:title="searchUser.username" 
					:thumbnail="searchUser.avatar"
					note="Tips"
					:extra="searchUser.signature">
						<image v-if="searchUser.gender == ''" src="../../static/img/zhaobenshan.png"
						mode="widthFix" lazy-load/>
						 <image v-if="searchUser.gender == '男'" src="../../static/img/fanfan.jpg" 
						 mode="widthFix" lazy-load/>
						<image v-if="searchUser.gender == '女'"  src="../../static/img/chengguo.jpeg"
						 mode="widthFix" lazy-load/>
						<template v-slot:footer>
								<view class="foot-box u-f-ajc u-f-jsb">
									<view @tap="addFriend"
									v-if="user.username != searchUser.username&&
										 !isFriend">加好友</view>					           
									<view v-if="isFriend" @tap="siliao">私聊</view>
								</view>
							</template>
					</uni-card>		
			</view>
		</view>
		
	</view>
	
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import uniCard from "@/components/uni-card/uni-card.vue"
	export default {
		onNavigationBarSearchInputChanged(e) {
			this.inputContent = e.text
		},
		 components: {uniCard},	
		 computed:mapState(['user','friends']),
		data() {
			return {
				//输入框内容
				inputContent:"",
				exist:false,
				searchUser:{},
				isFriend:false
			}
		},
		methods: {
			search(){
				uni.showLoading({
					title:"搜索"
				});
				setTimeout(()=>{
					uni.hideLoading();
					this.judgeRelationship(this.inputContent,this.friends);
					//如果查询到结果显示卡片，没有就文字提示	
					// 如果是本人好友，则去好友表查找，如果不是则去用户表查找
					let user = {tel:this.user.tel,
								friTel:this.inputContent,
								isFriend:this.isFriend};
						
					this.$http.post("/users/searchUser",user).then(res=>{
						this.exist = true;
						// console.log(res.data);
						this.searchUser = res.data;
					}).catch(e=>{						
						if(e.status == 404){
							uni.showToast({
								title: '没有查找到该用户',
								icon:"none"
							});
						}
					})
						
					
					
				},3000)
			},
			siliao(){
				let friendInfo ={
					...this.searchUser,
					friName:this.searchUser.username,
					friAvatar:this.searchUser.avatar,
					friTel:this.searchUser.tel
				} 
				uni.navigateTo({
					url: "../chat/chat?friendInfo="+ encodeURIComponent(JSON.stringify(friendInfo))				
				});
			},
			addFriend(){
				uni.navigateTo({
					url:"addFriend?user="+encodeURIComponent(JSON.stringify(this.searchUser))
				})
			},
			 judgeRelationship(item,arr){
					for(let tel of arr){
						if(tel == item){
							this.isFriend =true;
						}
					}				
				}
			}
	}
</script>

<style scoped>
.search{
	background-color: #eee;
	width: 90%;
	padding: 10upx;
	border-radius: 30upx;
}
.search-holder{	 
	text-align: center;
}
.foot-box{
	color: #007AFF;
}
</style>
