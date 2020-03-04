<template>
	<view>
		<!-- <view class="left-top-popup">
			<view><uni-icons type=""></uni-icons> 第一行</view>
			<view><view></view>第二行</view>
		</view> -->
		<navigator class="u-f-ajc" url="./search">
			<input class="search" disabled=true confirm-type="search" placeholder="搜索" placeholder-class="iconfont icon-sousuo search-holder" />
		</navigator>
		<uni-list>
			<navigator url="newFriends">
				<uni-list-item title="新朋友" showArrow="true" showBadge="true" :badgeText="badgeText" />
			</navigator>
		</uni-list>
		<uni-segmented-control :current="current" :values="tagList" @clickItem="onClickItem" style-type="text" active-color="#00aa7f"></uni-segmented-control>
		<view class="content">
			<view v-show="current === 0">
				<uni-collapse accordion="true" v-for="(group,index) in friendList" :key='group.name'>
					<uni-collapse-item :title="group.name"  @showTip="tips">
						<view style="padding:20rpx 50rpx;">
							<template v-if="group.users.length == 0">
								<view class="u-f-ajc">
									<image src="../../static/img/nothing.png" mode="widthFix" lazy-load></image>
								</view>
							</template>
							<template v-else>
								<!-- 列表中的好友 -->
								<uni-list v-for="(item) in group.users" :key='item.tel'>
									<navigator :url="'../chat/chat?friendInfo='+ encodeURIComponent(JSON.stringify(item))">
										<uni-list-item :thumb="item.friAvatar" :title="item.beizhu?item.beizhu:item.friName"></uni-list-item>
									</navigator>
								</uni-list>
							</template>
							

						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
			<view v-show="current === 1">
				<uni-collapse accordion="true">
					<uni-collapse-item title="我的群聊">
						<view style="padding:20rpx 50rpx;">
							<!-- 列表中的群 -->
							<uni-list v-for="(item,index) in groupList" :key='item.groupName'>
								<navigator :url="'../chat/chat-group?groupName='+item.groupName">
									<uni-list-item :thumb="item.groupPic" :title="item.groupName"></uni-list-item>
								</navigator>
							</uni-list>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
			<view v-show="current === 2">
				<uni-collapse accordion="true">
					<uni-collapse-item title="我最关心的人">
						<view style="padding:20rpx 50rpx;">
							<!-- 列表中的好友 -->
							<uni-list v-for="(item,index) in careList" :key='index'>

								<navigator :url="'../chat/chat?username='+item.username">
									<uni-list-item thumb="../../static/img/logo.png" :title="item.username"></uni-list-item>
								</navigator>
							</uni-list>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'

	import {
		mapState,
		mapMutations
	} from 'vuex'
	var self;
	export default {
		onLoad() {
			self = this;
			uni.$on('isToBeFriend',(fromUser)=>{
					this.setFromUser(fromUser);
				})
		},
		onShow() {	
			// 获取好友
			this.getFriendList();
			// 监听全局事件 传送分组名称
			this.uploadGroupName();
			// 如果有验证消息，tabBar上出小红点且更新个数
			
			if (this.reqCount > 0) {
				this.badgeText = this.reqCount.toString();
				uni.showTabBarRedDot({
					index:1				
				})
			}else{
				this.badgeText = "";
				uni.hideTabBarRedDot({
					index:1				
				})
				
			}
		},
		components: {
			uniSegmentedControl,
			uniCollapse,
			uniCollapseItem,
		},
		onNavigationBarButtonTap(e) {			
			if(e.index == 0){
				uni.showToast({
					title:"莫点我，添加好友要点中间的搜索框哦😁",
					icon:"none",
					duration:3000
				});				
			}
			
		},
		computed: mapState(['user', 'reqCount']),
		data() {
			return {
				current: 0,
				badgeText: "",
				tagList: ['好友', '群聊', '我关心的人'], //上面标签段落名称
				friendList: [{ //好友分组
					name: "我的好友",
					users: []
				}],
				groupList: [{ //群聊分组
					groupPic: "../../static/img/quntou.jpg",
					groupName: "HoChat聊天室"
				}],
				careList: [{ //关心的人分组									
					userPic: "../../static/img/logo.png",
					username: "xxx",
				}]
			}
		},
		methods: {
			...mapMutations(['setGroupList','storeFriend','updateReqCount','setFromUser']),
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
				}
			},			
			tips() {
				uni.showActionSheet({
					itemList: ["创建分组"],
					success: function(res) {
						if (tes.tapIndex == 0) {
							// #ifdef APP-PLUS
							// 弹出输入对话框
							function showPrompt() {
								plus.nativeUI.prompt("Input your name: ", function(e) {
									// console.log(((e.index == 0) ? "OK: " : "Cancel") + e.value);
								}, "nativeUI", "your name", ["OK", "Cancel"]);
							}
							// #endif
						}
					}
				});
			},
			getFriendList() {
				let uid = this.user.tel
				
				this.$http.post("/users/getFriend", {
					uid
				}).then(res => {
					this.allot(this.friendList,res.data);	
									// console.log(this.friendList);
				})				
			},
			allot(arr1, arr2) {	
				let unii = new Set();
				let tels = [];//记录所有好友的Id
				for (let item1 of arr1) {
					let name = item1.name;//分组名
					for (let item2 of arr2) {
						tels.push(item2.tel);
						if (item2.fenzu == name ) {
							unii.add(item2)
						}
					}
					item1.users = Array.from(unii)
				}
				//存储所有好友的tel
				this.storeFriend(tels);
			},
			//想vuex里上传分组名称
			uploadGroupName(){
				let uni = new Set();
				this.friendList.forEach((item)=>{				
					this.setGroupList(item.name)					
				})						
			}
		}

	}
</script>

<style scoped>
	.left-top-popup{
		position: fixed;
		right: 0;
		top:80upx;
		z-index: 2000;
		border: 1upx solid gray;
		width: 100upx;
		
	}
	.search {
		background-color: #eee;
		width: 90%;
		padding: 10upx;
		border-radius: 30upx;
	}

	.search-holder {
		text-align: center;
	}
</style>
