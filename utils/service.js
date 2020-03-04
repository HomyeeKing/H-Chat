// 管理账号信息
const tokenKey = "h-token";

// 保存当前用户信息
const save = function (key,val) {
	uni.setStorageSync(key, JSON.stringify(val));
}
const get = function (key) {
	
	let ret = uni.getStorageSync(key);	
	if(ret){
		return JSON.parse(ret);
	}else{
		return ;
	}
}
const remove = function  (key) {
	return new Promise((resolve,reject)=>{
		try{
			uni.removeStorageSync(key)
			resolve("success")
		}catch(e){			
			reject("falil")
		}
	})
	
}
export default {
	tokenKey,
	save,
	get,
	remove
}
