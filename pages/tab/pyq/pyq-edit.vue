<template>
	<view>
		<view class="uni-textarea">			
			<textarea v-model="thought" placeholder="这一刻的想法..." />
		</view>
		<upload-images @uploadImg = "uploadImg"></upload-images>
		<uni-popup ref="popup" type="top">
			<view class="popUp u-f-ajc">
				<text class="iconfont icon-sound">{{status}}</text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uploadImages from "./upload-images";	
	var self;
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		components:{uploadImages},	
		onLoad() {
			self = this;
		},
		onBackPress() {
			this.save()	
			return true;
		},
		data() {
			return {
				thought:"",
				imageList:[],
				showMask:false,
				status:""
			}
		},
		onNavigationBarButtonTap(e) {
			this.post();		
		},
		computed:mapState(['user']),
		methods: {
			save(){				
					if(this.thought.length>0 || this.imageList.length>0){						
						uni.showModal({
							content:"保留此次编辑？",
							confirmText:"保留",
							confirmColor:"#007AFF",
							cancelText:"不保留",
							success: (res) => {
								if(res.confirm){
									// console.log("保存");	
									uni.switchTab({
										url:"./pyq"
									})
								}else{
									// console.log("不保存");
									uni.switchTab({
										url:"./pyq"
									})
								}
							}
						})						
					}else{
						uni.switchTab({
							url:"./pyq"
						})
					}	
			},
			uploadImg(arr){
				this.imageList = arr; 
				// console.log(arr);
			},
			post(){
				if(this.thought.length==0 && this.imageList.length==0){
					uni.showToast({
						title: '发表内容不能为空',
						icon:"none"
					});
				}else{
					let time = new Date().getTime();					
					let tweet = {
						userTel:self.user.tel,
						avatar: self.user.avatar,
						username:self.user.username,
						type: self.imageList.length>0?"img":"text",
						content:self.thought,
						imgs: self.imageList,						
						like: 0,
						comment:[],
						time						
					};
					self.$http.post("/users/pyq/postTwt",tweet).then(res=>{						
						this.status = "发送成功";
					})
					 this.$refs.popup.open();
					 setTimeout(()=>{
						 this.$refs.popup.close();		
						  uni.switchTab({
							url:"./pyq"						
						  })
					 },2000)	
					
				}
			}
		},
	}
</script>

<style scoped>

.popUp{
		height: 80upx;
		background-color: #fff;
	}
	.popUp>text{
		font-size: 18px;
		color:#007AFF
	}
</style>
