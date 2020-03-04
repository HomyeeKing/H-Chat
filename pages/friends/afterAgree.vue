<!-- 同意添加好友后设置备注和分组 -->
<template>
	<view>
		<uni-combox
		label="备注" 
		labelWidth="80px"
		 v-model="beizhu"
		 :showArrow=false
		 emptyTips=""/>
		 <!-- 通过后台调用分组 -->
		 <uni-combox
		 label="分组" 
		 labelWidth="80px"
		 :candidates="groupName"
		 v-model="fenzu"/>
		 <button  style="margin-top: 30upx;"  type="primary" @tap="submit">确定</button>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		onLoad(e) {
			this.fromUser =JSON.parse(e.user);
			// console.log("afterAgree:  "+this.fromUser);
			this.groupName = this.groupList;
		},
		computed:mapState(['user','groupList']),
		data() {
			return {
				beizhu:"",
				fenzu:"我的好友",
				groupName:[],
				fromUser:{}
			}
		},
		methods: {			
			getGroupName(group){
				let uni = new Set();
				group.forEach((item)=>{					
					uni.add(item.name)					
				})
				self.groupName=Array.from(uni);				
			},
			submit(){
				let me = {
					...this.user,
					fenzu:this.fromUser.fenzu,
					beizhu:this.fromUser.beizhu,
					// 存储到对方的表中是，本人即对方好友，所以也要用fri为前缀
					friName:this.user.username,
					friTel:this.user.tel,
					friAvatar:this.user.avatar
				}
				let fromUser = {
					...this.fromUser,
					fenzu:this.fenzu,
					beizhu:this.beizhu,
					friName:this.fromUser.username,
					friTel:this.fromUser.tel,
					friAvatar:this.fromUser.avatar
				}
		
				this.$http.post('/users/addFriend',{me,friend:fromUser})
						  .then(res=>{		
							  this.noticeAgree();
							  uni.switchTab({
							  	url:"friends"
							  })
						  })
			},
			// 通知对方添加成功,同时将自己的好友请求更新为已同意
			noticeAgree(){				
				
				let fromUserMe={
					username:this.fromUser.username,
					note:this.fromUser.text+"      已同意",					
					avatar:this.fromUser.avatar,
					type:1,//表明是个返回，无需箭头
				};
				// 给对方的提示
				let fromUser={
					to:this.fromUser.username,
					fromInfo:{
						username:this.user.username,
						note:"对方已同意",					
						avatar:this.user.avatar,
						type:1,
					}
							
				};	
				uni.$emit("isToBeFriend",fromUserMe);
				this.$socket.emit('dealFriStuf',fromUser)
			}
		}
	}
</script>

<style>

</style>
