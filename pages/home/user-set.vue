<template>
	<view>
		<view>
			<navigator :url="'profiles/selfie?selfie='+user.avatar">
				<uni-combox label="头像" labelWidth="80px" arrowType="arrowright" emptyTips="" />				
			</navigator>
			<uni-combox
			label="签名" 
			labelWidth="80px" 
			v-model="signature"
			:value="checkSig"
			arrowType="arrowright" 
			emptyTips="" />
		</view>
		<view>
			<uni-combox label="账号" labelWidth="80px" :showArrow=false :value="user.tel" disableValue="true" emptyTips="" />
			<uni-combox label="昵称" labelWidth="80px" disableValue=true :showArrow="false" :value="user.username" emptyTips="" />
			<picker :range="genders" @change="bindPickerChange">
				<uni-combox label="性别" labelWidth="80px" :value="user.gender" arrowType="arrowright" emptyTips="" />
			</picker>
			<navigator :url="'profiles/birthday?date='+this.user.birthday">
				<uni-combox label="生日" labelWidth="80px" :value="user.birthday" arrowType="arrowright" emptyTips="" />
			</navigator>
			<navigator url="profiles/address">
				<uni-combox label="地址" labelWidth="80px" :value="user.address" arrowType="arrowright" emptyTips="" />
			</navigator>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	var self;
	import storage from "../../utils/service.js"
	export default {
		onLoad() {
			self = this;
		},
		onBackPress() {
			// 保存当前页面的所有信息，保存到数据库
			this.saveProfile()			;
		},	
		data() {
			return {				
				genders: ['男', '女'],
				signature:"这个人很懒，什么都没留下"
			}
		},
		computed:{
			 ...mapState(['user']),
			 checkSig(){		
				 // this.signature = this.user.signature;
				 if(this.user.signature !=''){
					 self.signature = this.user.signature;				  
				 }
				return this.signature
			 }
		},
		methods: {
			...mapMutations(['setProfile','setUser']),
			
			
			bindPickerChange(e) {
				// console.log(this.user);
				this.setProfile({gender:this.genders[e.target.value]});				
			},
			saveProfile(){
				this.setProfile({signature:this.signature});
				//更新用户信息				
				// console.log(this.user);
				this.$http.post("/users/updateProfile",this.user).then(res=>{
					// console.log(res);
				})
			}
		}
	}
</script>

<style scoped>
	page {
		background-color: #f4f4f4;
	}

	page>view>view {
		margin-top: 30upx;
	}
</style>
