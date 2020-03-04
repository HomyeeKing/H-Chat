<template>
	<view>

		<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
			<uni-combox label="年龄" labelWidth="80px" :value="age" :showArrow="false" emptyTips="" />
			<uni-combox label="星座" labelWidth="80px" :value="astro" :showArrow="false" emptyTips="" />
		</picker>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		onLoad(e) {
			this.date = e.date;
			if (this.date == '') {
				this.date = this.getDate({
					format: true
				})
			}
			this.format()
		},
		data() {

			return {
				title: 'picker',
				array: ['中国', '美国', '巴西', '日本'],
				index: 0,
				date: "",
				time: '12:01',
				age: "",
				astro: "" //星座
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			...mapMutations(['setProfile']),
			bindDateChange: function(e) {
				this.date = e.target.value;
				this.setProfile({
					birthday: this.date
				})
				this.format();
			},
			format() {
				if (this.data == '') {
					// console.log(";;");
					return;
				} else {
					var splitDate = this.date.split("-");
					let month = splitDate[1]
					let day = splitDate[2]
					let astro = this.getAstro(month, day);
					this.astro = astro + "座";
					let age = this.jsGetAge(this.date)
					this.age = age + "岁";
				}

			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			jsGetAge(strBirthday) {
				var strBirthdayArr = strBirthday.split("-");
				var d = new Date();
				var yearDiff = d.getFullYear() - strBirthdayArr[0];
				var monthDiff = d.getMonth() + 1 - strBirthdayArr[1];
				var dayDiff = d.getDate() - strBirthdayArr[2];
				var age = monthDiff < 0 || (monthDiff == 0 && dayDiff < 0) ? yearDiff - 1 : yearDiff; //判断有没有到生日,没到就减1
				return age = age < 0 ? 0 : age;
			},
			getAstro(month, day) {
				var s = "摩羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手摩羯";
				var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
				return s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2);
			}
		}
	}
</script>

<style>

</style>
