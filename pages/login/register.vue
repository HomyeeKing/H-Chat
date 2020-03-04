<template>
	<view>
		<view class="content u-f-ac u-f-colum">
			<image class="logo" src="../../static/img/logo.png" mode="widthFix" lazy-load></image>
			<view class="register">
				<input type="text" v-model="username" placeholder="请输入用户名" focus=true confirm-type="next" />
				<input type="number" maxlength="11" v-model="tel" placeholder="请输入手机号" confirm-type="next" />
				<input type="password" v-model="pwd" placeholder="请输入密码" confirm-type="done" />
				<text class="h-font u-f u-f-jend" @tap="login">已有帐号，返回登录</text>
			</view>
			<button type="primary" @tap="register">注册</button>
		</view>
	</view>
</template>

<script>
	var self;
	export default {
		onLoad() {
			self = this;
		},
		data() {
			return {
				tel: "",
				pwd: "",
				username: ""
			}
		},
		methods: {
			login() {
				uni.navigateTo({
					url: "./login"
				})
			},
			validate() {
				let len = this.pwd.length;

				let reg = /^[0-9a-zA-z_]{3,16}$/;
				if (this.number == "" || this.tel.length != 11) {
					uni.showModal({
						title: '',
						content: '请输入手机号',
						showCancel: false,
						confirmText: '确定'
					});
				} else if (this.pwd == "" || (len < 6 || len > 30)) {
					uni.showModal({
						title: '',
						content: '密码长度不规范',
						showCancel: false,
						confirmText: '确定'
					});
				} else if (this.username == "" || !reg.test(this.username)) {
					uni.showModal({
						title: '',
						content: '用户名不规范',
						showCancel: false,
						confirmText: '确定'
					});
				} else {
					return true;
				}

			},
			register() {
				if (this.validate()) {
					/**
					 * 向服务器验证账号密码是否存在且匹配
					 * 验证用户名是否已经存在 验证用户名是否合法
					 */
					let user = {
						tel:this.tel,
						password:this.pwd,
						username:this.username
					}
					this.$http.post("/users/register",user).then((res)=> {
							self.registeSuccessfully();
						})
						.catch((err)=> {
							// console.log(err);
							if(err.status == 409){
								uni.showToast({
									title: '昵称已被注册',
									icon:"none"
								});
							}else if(err.status == 400){
								uni.showToast({
									title: '账户已被注册',
									icon:"none"
								});
							}else{return;}
						});
					
				}

			},
			registeSuccessfully(){
				uni.showToast({
					title: "注册成功",
					icon: "success"
				});
				setTimeout(function() {
					uni.hideToast();
					uni.showLoading({
						title: "正在跳转到登录页...",
						mask: true,
					});
				}, 1000);
				setTimeout(function() {
				
					uni.hideLoading();
					uni.navigateTo({
						url: "login"
					})
				}, 2000);
			}
		}

	}
</script>

<style>
	.content {
		width: 700upx;
		padding: 0 20upx;
		margin-top: 100upx;
	}

	.content>image {
		width: 300upx;
		height: 300upx;
	}

	.register input {
		width: 680upx;
		height: 70upx;
		border-bottom: 1upx solid #007AFF;
		margin-top: 50upx;
	}

	/* 返回登录 */
	.register text {
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
