<template>
	<view>
		<block v-for="(item,index) in list" :key=index>
				<pyq-list 
				:index="index" 
				:item="item" 
				@deleteMom = "deleteMom"
				@send="send"
				@dianzan="dianzan" 
				 @pinglun="pinglun"></pyq-list>
		</block>	
		<!-- 上拉加载 -->
		<view class="load-more">{{loadText}}</view>

		


	</view>
</template>

<script>
	var self;
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import pyqList from './pyq-list.vue'	
	export default {
		components: {
			pyqList		
		},
		onLoad(option) {
			self = this;		
		},
		computed:mapState(['user']),
		data() {
			return {
				comment:false,
				loadText: "上拉加载更多",				
				list: [/*{
					userPic: "../../../static/img/logo.png",
					username: "Homy",
					type: "img",
					content: "content",
					contImg: ["../../../static/img/fengjing.jpg","../../../static/img/fengjing.jpg"],
					isFollowed: false,
					isLike: false,
					isShared: false,
					time:13123
				}*/],
		
		
		
			}
		},
		onShow() {			
			this.getTweet();			
		},		
		// 下拉刷新
		onPullDownRefresh() {
			let lenb = this.list.length;
			setTimeout(() => {
				// 从服务器获取最新内容
				// let obj = {
				// 	userPic: "../../../static/img/logo.png",
				// 	username: "Homy",
				// 	type: "img",
				// 	content: "asdsa",
				// 	contImg: ["../../../static/img/fengjing.jpg"],
				// 	isFollowed: false,
				// 	isLike: false,
				// 	isShared: false,

				// });
				// console.log("获取动态");
				this.getTweet();
				let lena = this.list.length;
				if(lena == lenb){
					uni.showToast({
						title:"没有新动态",
						icon:"none"
					})
				}
				uni.stopPullDownRefresh();
			}, 1000);
			uni.hideToast()
			uni.startPullDownRefresh();
		},
		// 上拉加载
		onReachBottom() {
		
			this.loadText = "加载中..."
			setTimeout(() => {
				// 从服务器获取内容
				let obj = {
					
			
				};
				if(JSON.stringify(obj) !== '{}'){
					this.list.push(obj);
					this.loadText = "上拉加载更多";
				}else{
					this.loadText = "已经到底了，不能再拉了！"
				}
				
			}, 1000)
			
		},
		
		onNavigationBarButtonTap(e) {
			if (e.index == 0) {
				uni.navigateTo({
					url:"./pyq-edit"
				})				
			}
			
		},
		
		methods: {
			getTweet(){
				this.$http.post("/users/pyq/getTweet").then(res=>{
					this.list = res.data;	
					this.dealTwt(this.list)
					
				})
			},
			dealTwt(arr){
				if(arr.length <= 4){
					this.loadText = "动态太少啦，赶紧去叫小伙伴们来发动态吧！";
				}
				this.list.sort((a,b)=>{
					return b.time - a.time
				})
			},
			send(comment){
				self.$http.post("/users/pyq/giveComment",comment).then(res=>{					
					this.getTweet()
				})
			},
			dianzan({isLike,time}){	
				let info = {
					isLike,time,
					username:this.user.username,
					userTel:this.user.tel
				}
				self.$http.post("/users/pyq/isLike",info).then(res=>{
					this.getTweet()
				})
			},
			deleteMom(time){
				self.$http.post("/users/pyq/deleteMom",{time}).then(res=>{					
					this.getTweet()
				})
			}
		}
	}
</script>

<style scoped>
	.load-more {
		text-align: center;
		color: #aaa;
		padding: 20upx;
	}
</style>
