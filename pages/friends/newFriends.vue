<template>
	<view>
		<uni-list v-for="(fromUser,index) in fromUsers" :key=index>
			<navigator :url="'./reqFriend?user='+encodeURIComponent(JSON.stringify(fromUser))">
				<template v-if="fromUser.type == 1">
					<uni-list-item
					:title="fromUser.username" 
					titleStyle="fontWeight:Bold;"
					:thumb="fromUser.avatar"
					:note="fromUser.note"/>
				</template>
				<template v-else>
					<uni-list-item
					:title="fromUser.username" 
					titleStyle="fontWeight:Bold;"
					:thumb="fromUser.avatar"
					:note="fromUser.note"			
					showArrow="true"/>
				</template>
				
			</navigator >
		</uni-list>
	</view>
</template>

<script>
	import {
			mapState,
			mapMutations
		} from 'vuex'
	export default {	
		onLoad() {
			//点进来后清除验证通知的个数
			this.clearReqCount();		
		},
		computed:mapState(['fromUsers','reqCount']),
		data() {
			return {
				
			}
		},
		methods: {
			...mapMutations(['clearReqCount']),
		}
	}
</script>

<style>

</style>
