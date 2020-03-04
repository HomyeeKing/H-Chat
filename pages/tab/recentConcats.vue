<template>
	<view class="body">
		<uni-nav-bar statusBar="true" title="消息" >			
			<view slot="left">
				<navigator animation-type="slide-in-left" class="u-f-ac" url="../home/home">
					<image
					class="mypic" 
					:src="user.avatar"
					 mode="widthFix" 
					 lazy-load></image>
				</navigator>				
			</view>	
		</uni-nav-bar>
	<!-- 好友列表 -->
	<view v-show="userList.length == 0" class="u-f-ajc">
		<image src="../../static/img/nothing.png" mode="widthFix" lazy-load></image>
	</view>
	<block  v-for="(item,index) in userList" :key=index>
		<r-chat-list :item="item" @chat='chat(item)'></r-chat-list>
	</block>

	</view>


</template>

<script>
	var self;
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import rChatList from "../../components/chat/r-chat-list.vue"
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import Time from '../../utils/time.js';
	export default {
		computed:mapState(['user','hasLogin']),
		onLoad(){			
			self = this;			
		},	
		onShow() {			
			self.getRecUsers();	
			// 从数据库获取最近联系人列表
			const timer = setInterval(()=>{				
				self.getRecUsers()
			},3000)
			this.$once('hook:onHide',()=>{
				// console.log("定时器被清除");
				clearInterval(timer);				
			})
		},			
		updated() {	
			this.setAllWeidu();
		},
		data() {
			return {							
				allweidu:0,				
				userList: [/*{
					avatar: "../../static/img/logo.png",
					username: "Homy",
					type:"person",
					lastChatTime: "11:20",
					lastMessage: "lastMsg"
				},{
					avatar: "../../static/img/fengjing.jpg",
					groupName: "我是一个群",
					type:"group",
					lastChatTime: "11:20",
					lastMessage: "lastMsg"
				}*/]				
			}
		},
		components: {
			rChatList,
			uniNavBar
		},		
		
		methods: {			
			init(){				
				// 从数据库获取最近联系人列表				
				const timer = setInterval(()=>{
					self.getRecUsers()
				},8000)
				this.$once('hook:beforeDestroy',()=>{
					// console.log("定时器被清除");
					clearInterval(timer)
				})
			},
			setAllWeidu(){
				// 获取总的未读消息				
				if(this.allweidu>0){
					uni.setTabBarBadge({
						index:0,
						text:this.allweidu+""
					})
				}else{
					uni.removeTabBarBadge({	
						index:0						
					})
				}
			},
			getRecUsers(){
				
				this.$http.post("/users/getRecentUsr",{userTel:this.user.tel}).then(res=>{					
					this.userList = res.data;	
					this.userList =this.userList.sort(function(a,b){
						 return b.lastChatTime-a.lastChatTime;
					})
					this.countWeidu(this.userList);//获取未读和处理时间			
				});
			},
			countWeidu(arr){
				self.allweidu = 0;
				for(let item of arr){					
					item.lastChatTime = Time.gettime.gettime(item.lastChatTime);
					self.allweidu+=item.weidu
				}	
				
			},
			chat(item) {	
				if(item.type == 'person'){
					uni.navigateTo({
						url: "../chat/chat?friendInfo=" + encodeURIComponent(JSON.stringify(item))					
					})	
				}else{
					uni.navigateTo({
						url: "../chat/chat-group?groupName=" + item.groupName,
					
					})	
				}
						
				
			}
		}
	}
</script>

<style scoped>
	.body {
		padding: 0 20upx;
	}
	.mypic{
		width: 50upx;
		height: 50upx;
		border-radius: 100%;
	}
</style>
