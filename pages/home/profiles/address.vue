<template>
	<view>
		<view class="item-underline">
			<uni-combox label="地区" :disableValue="true" @tapEvent="openAddres" labelWidth="80px" :value="religon" :showArrow="false"
			 emptyTips="" />
		</view>
		<simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor='#007AFF'>
		</simple-address>
	</view>
</template>

<script>
	import simpleAddress from "@/components/simple-address/simple-address.nvue"	
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				cityPickerValueDefault: [0, 0, 1],
				religon: ''
			}
		},
		components: {
			simpleAddress
		},
		
		methods: {
			...mapMutations(['setProfile']),
			openAddres() {
				this.$refs.simpleAddress.open();
			},
			onConfirm(e) {
				// this.pickerText = JSON.stringify(e)
				this.religon = e.label;
				this.setProfile({address:this.religon})				
			}

		}
	}
</script>

<style scoped>

</style>
