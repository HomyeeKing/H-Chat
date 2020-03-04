<template>
	<view>
		<swiper class="banner" :circular="true" :indicator-dots="true" :autoplay="autoplay" :interval="3000" :duration="1000">
			<swiper-item class=" u-f-ajc" v-for="(ad,index) in items" :key="index">
				<view class="swiper-item">
					<image :src="ad" mode="aspectFit" lazy-load></image>
				</view>
			</swiper-item>
			
		</swiper>
	</view>
</template>

<script>
	export default {
		props:{
			autoplay:{
				type:Boolean,
				default:true
			},
			items:Array
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped>

</style>
