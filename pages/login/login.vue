<template>
	<view class="content u-f-ac u-f-colum">
		<image class="logo" src="../../static/img/logo.png" mode="widthFix" lazy-load></image>
		<view class="login">
			<input type="number" maxlength="11" v-model="tel" placeholder="请输入账号" focus=true confirm-type="next" />
			<input type="password" v-model="pwd" placeholder="请输入密码" confirm-type="done" />
			<text class="h-font u-f u-f-jend" @tap="regist">注册</text>
		</view>
		<button type="primary" @tap="login">登录</button>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import jwt from "../../utils/jwt.js"
	import storage from "../../utils/service.js"
	var self;
	var socket = null;
	export default {
		data() {
			return {
				tel: "",
				pwd: ""
			}
		},
		onLoad() {
			self = this;
		},
		onNavigationBarButtonTap(e) {
			if(e.index == 0){
				uni.navigateTo({
					url:"../home/home"
				})
			}
		},
		computed:mapState(['hasLogin']),
		methods: {
			...mapMutations(['loginX','setUser']),
			regist() {
				uni.navigateTo({
					url: "./register"
				})
			},
			login() {
				
				if (this.validate()) {
					let user = {
						tel:this.tel,
						password:this.pwd
					}			
					
					self.$http.post("/users/login",user).then((res)=> {
							
							let {token,username} = res.data;
							// 将token存入到本地							
							storage.save(storage.tokenKey,token);						
							// 将socket以自己的用户名命名	
							//#ifdef H5
							self.$socket.close();
							self.$socket.open();
							self.$socket.emit("setName",username);
							// #endif 
							//#ifdef APP-PLUS
							// self.$chat.open();
							// #endif
							this.loginSuccessfully();
							
							
						})
						.catch((err)=> {							
							if(err.status == 404){
								uni.showToast({
									title: '该用户不存在！',
									icon:"none"
								});
							}else if(err.status == 400){
								uni.showToast({
									title: '密码错误',
									icon:"none"
								});
							}else{return;}
						});
				}


			},
			loginSuccessfully(){				
				uni.showToast({
					title: "登录成功",
					icon: "success"
				});
				setTimeout(function() {
					uni.hideToast();
					uni.showLoading({
						title: "正在跳转...",
						mask: true,
					});
				}, 1000);
				setTimeout(function() {
				
					uni.hideLoading();
					uni.reLaunch({
						url:"../home/home?first="+1
					})
				}, 2000);
			},
			validate() {
				// 手机号
				if (this.tel.length != 11) {
					uni.showToast({
						title: "手机号不符合格式",
						icon: "none"
					})
					return false;
				} else if (this.pwd == "") {
					uni.showModal({
						title: '',
						content: '请输入密码',
						showCancel: false,
						confirmText: '确定'
					});
					return false;
				} else {
					// 向服务器验证账号密码是否存在且匹配
					return true;
				}
			},
			
		}
	}
</script>

<style>
	.content {
		width: 700upx;
		padding: 0 20upx;
		position: relative;
		top: 150upx;
	}

	.content>image {
		width: 300upx;
		height: 300upx;
	}

	.login input {
		width: 680upx;
		height: 70upx;
		border-bottom: 1upx solid #007AFF;
		margin-top: 50upx;
	}

	/* 注册 */
	.login text {
		margin-top: 20upx;
	}

	.content>button {
		width: 100%;
		margin-top: 40upx;
		color: #fff;
		box-shadow: 0 0.08rem 0.16rem #f7c7b1;
		border-radius: 50upx;
	}
</style>
