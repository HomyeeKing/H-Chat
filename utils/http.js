import storage from "./service.js";
var Fly = require("flyio/dist/npm/fly")
var fly = new Fly;

//定义公共headers
fly.config.headers = {
	"x-tag": "h-chat"
}
fly.config.baseURL = "http://121.36.32.150:5000";


var log = console.log;
// //添加请求拦截器
fly.interceptors.request.use(function(request) {
	let token = storage.get(storage.tokenKey);	
	if (token) {			
		request.headers["Authorization"] = token;
	} 
	// else{
	// 	return Promise.reject(new Error("没有token"))
	// }
	return request;
})

// //添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
	function(res) { //不要使用箭头函数，否则调用this.lock()时，this指向不对

		return res;
	},
	function(err) {
		log("error-interceptor", err)		
		if(err.status == 401){
			uni.showModal({
				content: '身份已过期，请重新登录',
				showCancel: false,						
				confirmText: '确定',
				success: res => {
					if(res.confirm){								
						uni.navigateTo({
							url:"/pages/login/login"
						})
					}
				},
				
			});
		}
		
	}
)
export default fly;
