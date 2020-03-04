<template>
	<view>
		<uni-list v-for="(user,index) in groupUsers" :key=index>
			<uni-list-item  :thumb="user.avatar" :title="user.username"></uni-list-item>			
		</uni-list>
	</view>
</template>

<script>
	export default {
		onLoad(option) {
			const item = JSON.parse(decodeURIComponent(option.userInfo));
			this.init(item);
		},
		data() {
			return {
				groupUsers:[]
			}
		},
		methods: {
			init(item){
				// console.log(item);
				this.groupUsers = item
			
			}
		}
	}
</script>

<style>

</style>
