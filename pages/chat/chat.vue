<template>
	<view>
		<!-- 消息对话框 -->
		<scroll-view scroll-y="true"
		 :show-scrollbar="false" 
		 :scroll-with-animation = "true"
		 :scroll-top="style.bottom"
		 :style="{height:style.contentH+'px'}">
			<block v-for="(item,index) in list" :key=index>
				<chat-list :item="item" :index="index"></chat-list>
			</block>
		</scroll-view>
		
		<!-- 消息输入框 -->
		<chat-input @send = "send"></chat-input>
		
		

		
	</view>
</template>

<script>
	import chatList from "../../components/chat/chat-list.vue"
	import chatInput from "../../components/chat/chat-input.vue"
	import storage from '../../utils/service.js';
	import Time from '../../utils/time.js';
	import {
		mapState,
		mapMutations
	} from 'vuex'
	var socket = null;
	var self;
	
	export default {	
		components:{chatList,chatInput},
		computed:mapState(['user']),
		onLoad(option) {
			self = this;			
			this.initData(option)
		
		},	
		onBackPress() {			
			this.isHere = false;			
			// 更新最后一条消息
			if(this.list.length>0){
				let latesetMsg = this.list.slice(-1)[0].data;
				let lastChatTime = this.list.slice(-1)[0].time;
				// this.updateLatestMsg(latesetMsg);
				this.appendUserToRecent(true,latesetMsg,lastChatTime)
			}
			
		},
		data() {
			return {
				message:"",
				style:{
					contentH:"",
					bottom:0					
				},
				isHere:false,//检测用户是否在当前页面，来判断已读未读
				friendInfo:{},
				weidu:0,
				list:[/*{
					isme:false,
					userPic:"../../static/img/logo.png",
					type:'text',
					time:"1580122414",
					data:"ajsdkljas",					
				},{
					isme:true,
					userPic:"../../static/img/logo.png",
					type:"image",
					time:"1580122550",
					src:"../../static/img/fengjing.jpg"
				}*/],
				
			}
		},
		updated() {
			this.style.bottom = this.list.length*100;	
			// 设置消息已读			
			this.setRead();
		},
		// #ifdef H5
		sockets:{
			receiveMsg(data){				
				data.isme = false;
				self.list.push(data);	
				if(self.isHere){
					self.weidu = 0
				}else{
					self.weidu++;
					// 将最近联系人处的未读消息加1
					
				}
				// console.log(this.weidu);
				
			}
		},
		// #endif
		methods: {
			 initData(option){
				try {
				    const res = uni.getSystemInfoSync();				   
				    this.style.contentH =  res.windowHeight-uni.upx2px(90);				
				   
				} catch (e) {	 	}
				this.isHere = true;
				this.weidu = 0;
				// 获取好友的信息
				
				this.friendInfo = JSON.parse(option.friendInfo);				
					// 获取聊天记录
					this.getMsg()	
					
				// 将导航栏切换成对应用户的昵称
				uni.setNavigationBarTitle({
					title: this.friendInfo.beizhu? this.friendInfo.beizhu:this.friendInfo.friName
				});				
			},
			setRead(){
				let both = {					
					username:this.user.username,
					toId:this.friendInfo.friTel,
					fromId:this.user.tel
				}
				// 只有当前用户为被发送方，则设为已读，因为只有被发送方点开才能设为已读
				this.$http.put('/users/setRead',both).then(res=>{
					// console.log(`与${this.friendInfo.beizhu}的消息已设为已读`);
					
				})
			},
			 getMsg(){					
				this.$http.post("/users/getMsgRec",{
					fromId:this.user.tel,
					toId:this.friendInfo.friTel
				}).then(res=>{
					let tmp =res.data;
					for(let item of tmp){
						// 如果是发给自己的 将isme设为false，表明是别人发的
						if(item.to == self.user.username){
							item.isme = false;
						}						
					}
					
					this.list = tmp;
					// 按时间升序排列
					this.list.sort(function(a,b){
						return a.time-b.time;
					})
					let len = this.list.length;
					if(len>30){
						let cha = len -30;
						this.list.splice(0,cha);
					}					
					
				})
			},
			updateLatestMsg(msg){
				this.$http.put("/users/latestMsg",{userTel:this.user.tel,msg}).then(res=>{
					// console.log(res.data);
				})
			},
			// 向数据库上传本用户的最近联系人
			uploadRecentUser(user){
				this.$http.post("/users/setRecentUser",user).then(res=>{
					console.log(res);
				})
			},
				// 向数据库上传聊天内容
			uploadMsg(msg){
				this.$http.post("/users/uploadMsg",
					{
						msg,
						fromId:self.user.tel,
						toId:self.friendInfo.friTel
					}).then(res=>{				
				})
			},
			 send(data){
				/**
				 * 将聊天对象在最近联系人处置顶，同时在对方那里将自己置顶（用uni.$emit传递）
				 * 
				 * 同时检测对方有没有在聊天界面内，有的话不做操作，没有则将未读数++
				 */
				
				let sendTime = new Date().getTime();
				// 人性化时间
				let gsTime = null;
				let lastTime = null;
				let len = this.list.length;
				if(len>1){
					lastTime = this.list[len-1].time
					gsTime = Time.gettime.getChatTime(sendTime,lastTime);
				}
				let msg = {					
						isme:true,
						userPic:this.user.avatar,
						type:'text',
						time:sendTime,
						data,	
						gsTime,
						to:this.friendInfo.friName,
						isRead:false//初始设置消息未读										
				};
			
				 self.$socket.emit("sayTo",msg,async(status,feedback)=>{
					if(status == 200){
						self.list.push(msg);
						// 保存消息记录
						// this.saveRec(msg)
						// 上传本条消息
						await self.uploadMsg(msg)		
						// 向好友的最近列表添加我
						self.appendUserToRecent(false,data,sendTime)
						
					}else{
						// console.log(status+feedback);
					}
				});
			},			
			// 自动添加到数据库最近联系人列表里
			appendUserToRecent(isme,data,sendTime){				
				let ruser = {};
				if(isme){
					ruser = {
						userTel:self.user.tel,
						friTel:self.friendInfo.friTel,					
						friName:self.friendInfo.friName,
						beizhu:self.friendInfo.beizhu,
						lastChatTime:sendTime,
						lastMsg:data,
						weidu:0,						
						friAvatar:self.friendInfo.friAvatar,
						type:"person",
						myName:self.user.username
					}	
				}else{//往好友处添加最近联系人
					ruser = {
						friTel:self.user.tel,
						userTel:self.friendInfo.friTel,					
						friName:self.user.username,						
						lastChatTime:sendTime,
						lastMsg:data,
						friAvatar:self.user.avatar,
						type:"person",
						myName:self.friendInfo.friName
					}	
				}
				
				this.uploadRecentUser(ruser);
			}
			
		}
	}
</script>

<style scoped>
	
	
</style>
