import Vue from 'vue'
import Vuex from 'vuex'
import storage from '../utils/service.js'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: false,
		hasLogin: false,
		user:{},
		reqCount:0,
		fromUsers:[],//发送请求的用户		
		groupList:[],//获取分组列表
		friends:[],//存储当前用户的好友的账号 用于搜索用户是否为本人好友	,
		msgWeidu:0,//总的消息未读数
	},
	mutations: {
		loginX(state) {	
			// 将当前登录用户信息存入本地		
			state.hasLogin = true;
		},
		logout(state) {
			state.userName = "";
			state.hasLogin = false;
		},
		setUser(state,userInfo){
			state.user = userInfo;			
		},
		setFromUser(state,userInfo){
			for(let item of state.fromUsers){
				if(item.username == userInfo.username){
					let index = state.fromUsers.indexOf(item);
					state.fromUsers.splice(index,1);
					break;
				}
			}
			
			state.fromUsers.unshift(userInfo)
		},
		//有验证消息个数就加一
		updateReqCount(state){
			state.reqCount++;
		},
		setProfile(state,obj){
			for (let key of Object.keys(obj)) {
			  Vue.set(state.user,key,obj[key]);
			 }
		},
		clearReqCount(state){
			state.reqCount = 0
		},
		// 设置分组列表
		setGroupList(state,name){
			state.groupList = [];//去重
			state.groupList.push(name)
		},
		storeFriend(state,tels){
			state.friends = tels;
		},
		setMsgWeidu(state,num){
			state.msgWeidu = num;
		}
	}
})

export default store
