<template>
	<view>
		<!-- 消息对话框 -->
		<scroll-view scroll-y="true"
		 :show-scrollbar="false" 
		 :scroll-with-animation = "true"
		 :scroll-top="style.bottom"
		 :style="{height:style.contentH+'px'}">
			<block v-for="(item,index) in list" :key=index>
				<chat-list :item="item" :ufrom=1  :index="index"></chat-list>
				
			</block>
			
		</scroll-view>
		
		<!-- 消息输入框 -->
		<chat-input @send = "send"></chat-input>
		
		

		
	</view>
</template>

<script>
	import chatList from "../../components/chat/chat-list.vue"
	import chatInput from "../../components/chat/chat-input.vue"
	import Time from '../../utils/time.js';
	import {
		mapState,
		mapMutations
	} from 'vuex'	
	var self;
	
	export default {	
		components:{chatList,chatInput},
		computed:mapState(['user']),
		onLoad(option) {
			self = this;
			this.initData(option);				
		},	
		onNavigationBarButtonTap(e) {		
			if(e.index == 0){
				uni.navigateTo({
					url:"./chat-group-userList?userInfo="+encodeURIComponent(JSON.stringify(self.member))
				})
			}
		},
		updated() {
			this.style.bottom = this.list.length*100;	
			// 设置消息已读			
			this.setRead();
		},
		onBackPress() {		
			this.left();
		},
		data() {
			return {
				message:"",
				groupName:"",					
				style:{
					contentH:"",
					bottom:0					
				},
				list:[],
				member:[],
				groupAvatar:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1583232194422&di=5ba5b3ecc83fb6743d49973af504c109&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fq_70%2Cc_zoom%2Cw_640%2Fimages%2F20200201%2F43d42a8c4ae64ae8b10e6189d7ab6b1c.jpeg"
			}
		},
		
		updated() {			
			this.style.bottom = this.list.length*120;			
		},
		sockets:{
			joined(name){			
									
					let note = {						
						type:'note',						
						note:`欢迎${name}加入聊天室`						
					}					
					self.list.push(note);					
				
			},
			leave(name){
				let note = {
					type:'note',						
					note:`${name}离开了聊天室`						
				}
				console.log("leave")
				self.list.push(note);
			},
			receiveMsg(msg){
				msg.isme = false;
				self.list.push(msg);
			}
		},
		methods: {
			initData(option){
				try {
				    const res = uni.getSystemInfoSync();				   
				    this.style.contentH =  res.windowHeight-uni.upx2px(130);				
				   
				} catch (e) {	 	}
			
				
				this.groupName = option.groupName;
				// 将导航栏切换成对应用户的昵称
				uni.setNavigationBarTitle({
					title: option.groupName
				});	
				this.getMsg(this.groupName);
				this.welcome();
			},	
			getMember(groupName){
				this.$http.post("/users/group/getMember",{groupName}).then(res=>{
					this.member = res.data;					
				})
				return Promise.resolve(this.member)
			},
			
			setRead(){
				let both = {					
					userTel:this.user.tel,
					groupName:this.groupName
				}
				this.$http.put('/users/group/setRead',both).then(res=>{
					// console.log(`与${this.groupName}的消息已设为已读`);
				})
			},
			getMsg(groupName){
				this.$http.post("/users/group/getMsg",{groupName}).then(res=>{					
					let tmp =res.data;					
					for(let item of tmp){
						// 如果是发给自己的 将isme设为false，表明是别人发的
						if(item.type == 'text'&& item.username!= self.user.username){
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
			welcome(){
				let info = {
					groupName:this.groupName,
					type:"join",
					username:this.user.username,
					userTel:this.user.tel,
					avatar:this.user.avatar
				}
				this.$socket.emit('groupDeal',info,(status)=>{
					if(status == 200){
						// 加入成功
						self.$http.post("/users/group/join",info).then(res=>{
							// console.log("加入成功");							
						});
						// 记录提示信息
						// let sendTime = new Date().getTime();
						// let note = {
						// 	msg:{
						// 		type:'note',
						// 		note:`欢迎${self.user.username}加入聊天室`,
						// 		time:sendTime,
						// 	},						
						// 	groupName:self.groupName
						// }	
						// self.uploadMsg(note);
					}
				});
			},
			left(){
				let info = {
					groupName:this.groupName,
					type:"leave",
					username:this.user.username,
					userTel:this.user.tel
				}
				this.$socket.emit('groupDeal',info,(status)=>{
					// if (status == 200) {
						// 记录提示信息
						// let sendTime = new Date().getTime();
						// let note = {
						// 	msg:{
						// 		type:'note',
						// 		note:`${self.user.username}离开了聊天室`,
						// 		time:sendTime,
						// 	},						
						// 	groupName:self.groupName
						// }	
						// self.uploadMsg(note);
						
					// }
					
				});
				// 调用服务端 用户退出
				self.$http.post("/users/group/leave",info).then(res=>{
					// console.log("退出成功");
				})
			},
			send(data){
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
						username:this.user.username,
						type:'text',
						time:sendTime,
						data,	
						gsTime,
						isRead:false//初始设置消息未读										
				};
				let info = {
					msg,
					type:"chat",
					groupName:this.groupName,
				}
				
				this.$socket.emit("groupDeal",info,async(status,feedback="")=>{
					if(status == 200){
						self.list.push(msg);
						// 保存消息记录
						// this.saveRec(msg)
						// 上传本条消息
						await this.uploadMsg(info);		
						// 向好友的最近列表添加本群
						self.appendUserToRecent(data,sendTime)
						
					}else{
						// console.log(status+feedback);
					}
				});
			},
			// 自动添加到数据库最近联系人列表里
			async appendUserToRecent(data,sendTime){	
				
				let ruser = {
						// memberInfo:res,				
						groupName:self.groupName,					
						lastChatTime:sendTime,
						lastMsg:data,
						groupAvatar:self.groupAvatar,
						type:"group",
						userTel:this.user.tel
					}				
				
				self.uploadRecentUser(ruser);
			},
			// 向数据库上传本用户的最近联系人
			uploadRecentUser(user){
				this.$http.post("/users/group/setRecentUser",user).then(res=>{
					// console.log(res);
				})
			},
			// 向数据库上传聊天内容
			uploadMsg(msg){
				this.$http.post("/users/group/uploadGroupMsg",msg).then(res=>{		
				
				})
			},
			
			
		}
	}
</script>

<style scoped>
	
	
</style>
