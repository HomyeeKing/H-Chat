<template>
	<view>				
		<!-- 未登录 -->
		<template v-if="!hasLogin">
			<view class="u-f-ajc wodeFont">登录HoChat,体验更多功能🤭</view>
			<!-- 第三方登录 -->
			<disanfang-login :icons="icons"></disanfang-login>
			<!-- 账号密码登录 -->
			<view class="u-f-ajc wodeFont" @tap="gotoLogin">
				<text>账号密码登录</text>
				<view class="icon iconfont icon-youjiantou"></view>
			</view>

		</template>

		<template v-else>
			<!-- 登录后 -->
			<view class="header u-f-ac" @tap="profile">
				<image :src="user.avatar" mode="widthFix" lazy-load></image>
				<view class="u-f-ac u-f1 u-f-jsb">
					<view class="info">
						<text class="wodeFont">{{user.username}}</text>
						<view class="u-f-ajc">
							<view>总访客 0</view>
							<view>今日 0</view>
						</view>
					</view>
					<view class="iconfont icon-youjiantou"></view>
				</view>
			</view>
		</template>


		<!-- 信息展示 -->
		<home-infoshow :homeData="homeData"></home-infoshow>
		<!-- 图片 -->
		<view class="ximg u-f-ajc">
			<image src="../../static/img/ad4.png" mode="widthFix" lazy-load></image>
		</view>

		<!-- 广告位 -->
		<ads-item :items="ads"></ads-item>
	

	</view>
</template>

<script>
	import homeInfoshow from "../../components/home/home-infoshow"
	import adsItem from "../../components/home/lunbo"
	import disanfangLogin from "../../components/home/disanfang"
	import {
		mapState,
		mapMutations
	} from 'vuex'	
	export default {
		components: {
			homeInfoshow,
			adsItem,
			disanfangLogin
		},		
		computed:mapState(['hasLogin','user']),
		onLoad(e) {
			if( e.first){
				this.welcome();
			}
		},
		onShow() {				
			this.init();
		},
		onNavigationBarButtonTap(e) {
			if(e.index == 0){
				uni.switchTab({				
					url: '../tab/recentConcats'					
				});
			}
		},
		data() {
			return {	
				username:"",
				avatar:"",
				
				// 广告图
				ads: ["../../static/img/ad1.jpg",
					"../../static/img/ad2.jpg",				
					"../../static/img/ad3.jpg"
				],
				// 信息展示
				homeData: [{
						num: 0,
						name: "动态"
					},
					{
						num: 0,
						name: "评论"
					},
					{
						num: 0,
						name: "收藏"
					}
				],
				// 第三方登录图标
				icons:["icon-qq","icon-weixin","icon-wode"]
			}
		},
		methods: {
			...mapMutations(['loginX','setUser']),
			init(){	
				this.$http.post("/users/current").then(res=>{					
					this.initUserData(res.data)					
				})
			},			
			initUserData(userInfo){
				this.loginX();			
				this.setUser(userInfo);				
			},
			
			gotoLogin() {
				uni.navigateTo({
					url: "../login/login"
				})
			},
			profile(){
				uni.navigateTo({
					url: './profile',					
				});
			},
			 welcome(){					
				 uni.showModal({
					title:"欢迎使用",
					content:`欢迎来到HoChat，快来完善个人信息吧，这样能将可以帮助你和其他小伙伴拥有更好的体验🤪`,
					confirmText:`确认`,
					showCancel:false,
					success: function (res) {
							if (res.confirm) {
							   uni.navigateTo({
								url: './profile'					           	
							   })
							}
					}
				 })
		    }
			
		}
	}
</script>

<style scoped>
	/* 已登录 */
	.header {
		padding: 20upx;
		box-sizing: border-box;
		border-bottom: 1upx solid #EEEEEE;
	}

	.header>image {
		width: 120upx;
		height: 120upx;
		flex-shrink: 0;
		border-radius: 100%;
	}

	.header .info>view>view {
		color: #BEBEBE;
	}

	.wodeFont {
		font-size: 35upx;
	}
	
	/* 没用的图 */
	.ximg {
		padding: 20upx;
	}
	
	.ximg>image {
		height: 100upx;
		box-sizing: border-box;
		border-radius: 20upx;
	}
	
	
</style>
