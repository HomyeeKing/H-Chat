<template>
	<view>
		<view class="card animated fadeInLeft">
			<!-- 第一行 头像和关注 -->
			<view class="list-1 u-f-jsb u-f-ac">
				<view class="user u-f-ac">
					<image :src="item.avatar" mode="widthFix"></image>
					<text>{{item.username}}</text>					
				</view>
				<view class="follow u-f-ac">
					<text>{{item.gsTime}}</text>
					<uni-icons v-if="item.userTel == user.tel" @tap='deleteMom(item.time)' type="trash"></uni-icons>					
					<!-- <view :class="[item.isFollowed?followed:follow]"></view>
					<text>关注</text> -->
				</view>
			</view>
			<view class="list-2">
				<text>{{item.content}}</text>
				<!-- 动态图片 -->
				<view v-if="item.imgs.length>0">
					<dongtai-pic :autoplay="false" :items="item.imgs"></dongtai-pic>
				</view>
				<!-- 如果是视频 则添加播放组件 -->
				<!-- <view class="index-list-play "></view>
				<view class="index-list-play-info"></view> -->

			</view>
			<view class="list-3 u-f u-f-jsb">
				<view class="like u-f-ac " @tap="dianzan(item.time)">
					<view :class="[isLike?like1:like]"></view>
					<text>喜欢{{likeCount>0?likeCount:""}}</text>
				</view>
				<view class="comment u-f-ac" @tap="pinglun">
					<view class="icon iconfont icon-pinglun"></view>
					<text>
						评论
					</text>
				</view>
				<view class="share u-f-ac">
					<view class="icon iconfont icon-fenxiang"></view>
					转发
				</view>
			</view>
			<!-- 评论框 -->
				<view v-if="comment" class="u-f-ac comment-box">
					<input type="text" v-model="comments" placeholder="评论" />
					<button class="u-f-ajc" type="primary" @tap="send(item.time)">发送</button>
				</view>
			<!-- 已有的评论 -->
			<view class="uni-article__comment">
				
				<view class="uni-article__comment-box" v-for="comment in item.comment" :key="comment.id">
					<view class="article-meta">
						<view class="article-header-content">
							<view class="article-header-title">
								<text>{{comment.username}}：</text>
								<text>{{comment.content}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>



	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import chatInput from "@/components/chat/chat-input.vue"
	import dongtaiPic from '@/components/home/lunbo.vue';
	import Time from '../../../utils/time.js';
	export default {
		
		components: {
			chatInput,
			dongtaiPic
		},
		props: {
			index: Number,
			item: Object,
		},
		mounted() {
			// console.log(this.item);
			this.item.gsTime = Time.gettime.gettime(this.item.time);
			this.likeCount = this.item.like.length;
			for(let item of this.item.like){
				if(item.userTel == this.user.tel){					
					this.isLike = true;
					break;
				}
			}
		},
		computed:{
			...mapState(['user'])			
		},
		data() {
			return {
				like: "icon iconfont icon-aixin",
				like1: "icon iconfont icon-aixin1",
				follow: "icon iconfont icon-zengjia",
				followed: "icon iconfont icon-zengjia1",
				isLike:false,
				likeCount:0,
				comment: false,
				comments: "",
				commentData: [],
				
			}
		},
		
		methods: {

			dianzan(time) {
				this.isLike = !this.isLike;
				if (this.isLike) {
					this.likeCount++;
				} else {
					this.likeCount--;
				}

				this.$emit('dianzan', {
					isLike: this.isLike,
					time
				})

			},
			guanzhu() {
				this.item.isFollowed = !this.item.isFollowed;
				uni.showToast({
					title: "关注成功",
					icon: "success"
				})
			},
			pinglun() {
				this.comment = !this.comment;
			},
			send(time) {
				let self = this;
				if (this.comments == "") {
					uni.showToast({
						title: "不能评论空内容哦",
						icon: "none"
					})
				} else {
					let id = new Date().getTime()
					let comment = {
						time,
						content: this.comments,
						id,
						refer: [],
						username: self.user.username,
						userTel: self.user.tel
					}
					// self.commentData.push(comment)
					this.$emit('send', comment);

					self.comments = ""

					self.comment = !self.comment;
				}

			},
			deleteMom(time){
				uni.showModal({
					content:"确认删除这条动态吗？",
					success:(res)=>{
						if(res.confirm){
							this.$emit('deleteMom',time);
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	.card {
		padding: 20upx;
		border-bottom: #C0C0C0 1upx solid;
	}

	/* 评论框 */
	.card>.comment-box {
		left: 0;
		right: 0;
		height: 120upx;
		padding: 0 20upx;
	}

	.card>.comment-box>input {
		background-color: #f7f7f7;
		margin-right: 10upx;
		padding: 10upx;
		border-radius: 10upx;
		flex: 1;
	}

	.card>.comment-box>button {
		font-size: 28upx;
	}

	.card .user>image {
		border-radius: 100%;
	}

	.list-1 .user>image {
		width: 90upx;
		height: 10upx;
		margin-right: 10upx;
	}

	.list-1 .follow text {
		margin-left: 10upx;
	}

	.list-2 {
		padding: 0 20upx;
		margin-bottom: 5upx;
	}

	.list-2>text {
		font-size: 32upx;
	}

	.list-3 view {
		color: #C0C0C0;
	}

	.list-3 view>view {
		margin-right: 5upx;
	}

	/* 评论区 */
	.article-meta {
		padding: 0rpx 20rpx;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: flex-start;
		color: gray;
	}

	.article-header-image {
		width: 60rpx;
		height: 60rpx;
		flex-shrink: 0;
		/* border-radius: 50%; */
		overflow: hidden;
	}

	.article-header-image .image {
		width: 100%;
		height: 100%;
	}

	.article-header-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-size: 24rpx;
		line-height: 1;
		width: 100%;
		/* height: 60rpx; */
	}

	.article-header-title {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		line-height: 2;
		color: #000;
	}

	.article-header-title>text:first-child {
		color: #0058b6;
	}

	.article-header-info {
		font-size: 24rpx;
		line-height: 1;
	}

	.article-top {
		display: flex;
		align-items: flex-end;
		font-size: 26rpx;
		line-height: 1;
		color: #999;
	}

	.article-top .image {
		width: 30rpx;
		margin-left: 5rpx;
	}

	.uni-article__comment-title {
		width: 100%;
		line-height: 3;
		font-size: 28rpx;
		color: #666;
		background: #f5f5f5;
		/* padding-left: 20rpx; */
	}

	.uni-article__comment-centent {
		border-bottom: 1px #eee solid;
		padding: 0 20rpx;
		padding-left: 95rpx;
		padding-bottom: 10rpx;
		font-size: 14px;
		color: #333;
	}
</style>
