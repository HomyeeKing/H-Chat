<template>
	<view>
		<uni-list>
			<navigator url="./user-set">
				<uni-list-item title="个人资料" 
				:show-extra-icon="true"
				:extra-icon="{color: '#4cd964',size: '22',type: 'paperclip'}"
				titleStyle="fontWeight:Bold;"
				show-arrow=true></uni-list-item>		
			</navigator>		
		</uni-list>
		
		<!-- 清除缓存 -->
		<view>
			<button style="margin-bottom: 10upx;" type="primary" @tap="clearCache">清除缓存</button>
			<button class="logout" @tap="exit" type="warn">退出登录</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import storage from "../../utils/service.js"
	export default {		
		computed:{
			 ...mapState(['user'])			
		},
		methods: {
			...mapMutations(["logout"]),

			exit() {
				storage.remove(storage.tokenKey).then((res)=>{
					this.logout()
					this.$socket.emit('disconnect');
					this.$socket.close();
				})
				uni.navigateBack()
			},
			clearCache() {

				uni.showLoading({
					mask: true,
				});

				setTimeout(function() {
					uni.hideLoading();
					try {
						uni.clearStorageSync();
						uni.showToast({
							title: "清除成功",
							icon: "success"
						});
						setTimeout(function() {

							uni.hideToast();
							uni.reLaunch({
								url: "./home"
							})
						}, 2000);

					} catch (e) {
						// error
						uni.showToast({
							title: "清除失败",
							icon: "none"
						});
					}

				}, 2000);
			},
			
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
