<template>
	<view>
		<view class="u-f-ajc">
			<image alt="这是个头像" :src="avatar" mode="widthFix" lazy-load></image>	
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			this.avatar = e.selfie;			
			this.init();
		},		
		data() {
			return {
				avatar:""
			}
		},
		methods: {
			init(){
				uni.showActionSheet({
					itemList: ['拍照','从相册选择'],
					success: res => {	
						if(res.tapIndex == 0){
						uni.chooseImage({
						    count: 1, //默认9
						    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						    sourceType: ['camera'], //从相册选择
						    success: function (res) {
						        // console.log(JSON.stringify(res.tempFilePaths));
						    }
						});
						}
						if(res.tapIndex == 1){
							uni.chooseImage({
							    count: 1, //默认9
							    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
							    sourceType: ['album'], //从相册选择
							    success: function (res) {
							        // console.log(JSON.stringify(res.tempFilePaths));
									uni.getImageInfo({
										src: res.tempFilePaths[0],
										success(res) {
											this.avatar =res.path;
											// console.log(this.avatar);
										}
									})
							    }
							});
						}
					},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style>

</style>
