<template>
	<view class="body">
		<view class="index-one u-f-ac u-f-jsb">
			<image :src="toUser.avatar" mode="widthFix" lazy-load></image>
			<view class="u-f1">
				
				<view class="u-f u-f-jsb username">{{toUser.username}} </view>				
				<view class="u-f-ac note">
					<text>{{toUser.gender}}</text>
					<text>{{toUser.age}}</text>
					<text>{{toUser.address}}</text>
				</view>
			</view>
		</view>
		<view class="index-two">
			<text class="note">填写验证信息</text>
			<textarea v-model="text" />
			</view>
		<view class="index-three">
			<text class="note">设置备注和分组</text>
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
		</view>
		<uni-popup ref="popup" type="top">
			<view class="popUp u-f-ajc">
				<text class="iconfont icon-sound">{{status}}</text>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	var self;
	export default {		
		computed:mapState(['user','groupList']),
		onLoad(option) {
			self = this;
			this.toUser = JSON.parse(option.user);
			// console.log(this.toUser);
			this.init();
			
		},
		onNavigationBarButtonTap(e) {
			if(e.index == 0){
				this.sendReq();
			}
		},
		data() {
			return {
				beizhu:"",
				text:"",
				toUser:{},
				//分组名称
				groupName:[],	
				fenzu:"我的好友",
				status:""//记录发送状态
			}
		},		
		methods: {
			init(){
				this.toUser.age = this.jsGetAge(this.toUser.birthday)
				this.text = "我是" + this.user.username;
				// 获取好友分组名称
				this.groupName = this.groupList;
			},
			
			sendReq(){	
				let toUser = {
					...this.toUser,		
					to:this.toUser.username,
					fromInfo:{
						...this.user,
						text:this.text,
						beizhu:this.beizhu,
						fenzu:this.fenzu
					}
				}
				
				// 传入要添加的好友的信息和本人信息
				this.$socket.emit("dealFriStuf",toUser);
				this.status = "发送成功";
				 this.$refs.popup.open();
				 setTimeout(()=>{
					 this.$refs.popup.close();		
					  uni.switchTab({
						url:"./friends"						
					  })
				 },2000)	
			},
			jsGetAge(strBirthday) {
				var strBirthdayArr = strBirthday.split("-");
				var d = new Date();
				var yearDiff = d.getFullYear() - strBirthdayArr[0];
				var monthDiff = d.getMonth() + 1 - strBirthdayArr[1];
				var dayDiff = d.getDate() - strBirthdayArr[2];
				var age = monthDiff < 0 || (monthDiff == 0 && dayDiff < 0) ? yearDiff - 1 : yearDiff; //判断有没有到生日,没到就减1
				return age = age < 0 ? 0 : age;
			},
			
		}
	}
</script>

<style scoped>
	page {		
		padding: 20upx;
		background-color: #f4f4f4;
	}
	.body>view{
		margin-bottom: 50upx;
	}
	.index-one{
	}
	.index-one>image {
		width: 70upx;
		height: 70upx;
		flex-shrink: 0;
		border-radius: 100%;
		margin-right: 10upx;
	}

	.note {
		color: #b0b0b0;
	}
	.index-one .note>text{
		margin-right: 10upx;
	}
	.index-one .username{
		font-size: 18px;
	}
	
	.index-two>textarea{
		height: 150upx;
		width: 100%;
		background-color: #fff;
	}
	.popUp{
		height: 80upx;
		background-color: #fff;
	}
	.popUp>text{
		font-size: 18px;
		color:#007AFF
	}
</style>
