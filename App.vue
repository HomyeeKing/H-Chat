<script>
	var self;
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {

		onLaunch: function() {
			self = this;
			// console.log('App Launch');
				this.initUserData()
			// 如果用户登陆过，且token未过期，一开始就获取用户信息存入vuex中
			// this.$http.post("/users/current").then(res => {

			// }).catch(err => {
			// 	console.log(err);
				// if (err.status == 401) {
				// 	uni.showModal({
				// 		content: '身份已过期，请重新登录',
				// 		showCancel: false,
				// 		confirmText: '确定',
				// 		success: res => {
				// 			if (res.confirm) {
				// 				uni.navigateTo({
				// 					url: "/pages/login/login"
				// 				})
				// 			}
				// 		},

				// 	});
				// }
			// })

		},		
		computed:mapState(['reqCount','msgWeidu','user','hasLogin']),
		data() {
			return {
				weidu:0
			}
		},
		methods: {
			...mapMutations(['loginX',
			 'setUser','updateReqCount',"clearReqCount","setFromUser","addMsgWeidu"]),
			initUserData() {
				if(this.hasLogin){
					self.$socket.close();
					self.$socket.open();				
					self.$socket.emit("setName",self.user.username);
				}
				// uni.onNetworkStatusChange(function (res) {
				//    if(!res.isConnected){
					   
				//    }
				// });
				
			}

		},
		sockets:{			
			// 接收好友请求
			rcvFriReq(user){
				// console.log(user);				
				this.setFromUser(user);
				this.updateReqCount();//将验证请求的个数更新到vuex中
				// 如果有验证消息，tabBar上出小红点且更新个数
				console.log(this.reqCount);
				if(this.reqCount>0){
					uni.showTabBarRedDot({
						index:1				
					})
				}else{
					uni.hideTabBarRedDot({
						index:1				
					})
				}
			},
			reconnect(){
				self.$socket.close();
				self.$socket.open();				
				self.$socket.emit("setName",self.user.username);
			}
		},
	}
</script>

<style>
	/*每个页面公共css */
	@import url("./common/uni.css");
	/* 引入图表库 */
	@import "./common/icon.css";
	/* 引入动画库 */
	@import "./common/animate.css";
	/* 引入flex布局 */
	@import url("./common/flex.css");
	/* 引入常用字体格式 */
	@import url("./common/font.css");
	
</style>
