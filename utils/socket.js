import Config from './/Config.vue';
export default{
	url:Config.websocketUrl,
	//
	/**
	 * 原理：
	 * 
	 * 接收信息（假如当前消息的 from_id = 12，当前用户id=17）
	 * 场景一：与当前用户12处于聊天界面
	 * 		  (1) 渲染到页面
	 * 		  (2) 存储到本地存储
	 * 			  a. chatdetail_17_12
	 * 			  b. chatlist17（将当前会话置顶，修改chatlist中当前会话的data和time显示）
	 * 
	 * 场景二：与当前用户12不处于聊天界面
	 *		  (1) 渲染到页面（处于paper页，留个接口）
	 * 		  (2) 存储到本地存储
	 * 			  a. chatdetail_17_12
	 * 			  b. chatlist17
	 * 			（将当前会话置顶，修改chatlist中当前会话的data和time显示 和 当前会话未读数+1）
	 * 			  c. 总未读数+1（显示在tabbar上）
	 * 接收到的消息格式：
	{
		to_id:1,      // 接收人 
		from_id:12,	  // 发送人
		from_username:"某某",  // 发送人昵称
		from_userpic:"http://pic136.nipic.com/file/20170725/10673188_152559977000_2.jpg",
		type:"text",	 // 发送类型
		data:"你好啊",	 // 发送内容
		time:151235451   // 接收到的时间
	}
	 * 
	 * 发送消息
	 * 		(1) 写入存储
	 * 			chatdetail_17_12
	 * 			chatlist17（将当前会话置顶，修改chatlist中当前会话的data和time显示）
	 * 		(2) 请求ajax发送消息
	 * 		(3) 渲染到页面（user-chat页面实现）
	 * 
	 * 读取消息
	 * 		(1) 写入存储
	 * 			chatlist17：获取将当前会话的未读数设为0，减少总未读数，渲染tabbar
	 * 
	 * */
	/**
	 * 需要引入：
	 * 	配置文件     import Config from "../../common/config.js";
	 * 	用户操作类库  import User from "../../common/user.js";
	 *  时间类库     import Time from "../../common/time.js";
	 * */
	 import Config from "./Config.js";
	
	 
	 export default {
	 	// socket地址
	 	url:Config.websocketUrl,
		// 连接状态
		IsOpen:false,
		// SocketTask
		SocketTask:false,
		// 是否上线（会员id绑定客户端id，验证用户身份，通过则绑定）
		IsOnline:false, 
		CurrentUserInfo:{
			username:"",
			tel:""
		}
		// 连接
		Open(){
			if(this.IsOpen) return; // 防止重复连接
			// 连接
			this.SocketTask = uni.connectSocket({
				url:this.url,
				complete: (e)=> { },
			});
			if (!this.SocketTask) return;
			// 监听开启
			this.SocketTask.onOpen(()=>{
				// 将连接状态设为已连接
				this.IsOpen = true;
				// 用户绑定
				//this.UserBind();
			});
			// 监听信息
			this.Message();
			// 监听关闭
			this.SocketTask.onClose(()=>{
				this.IsOpen = false;
				this.SocketTask = false;
			});
			// 监听错误
			this.SocketTask.onError((e)=>{
				this.IsOpen = false;
				this.SocketTask = false;
			});
		},
		// 关闭连接
		Close(){
			if (this.IsOpen){
				this.SocketTask.close();
				return uni.removeTabBarBadge({
					index:Config.TabbarIndex
				});
			}
		},
		// 用户绑定 将用户名绑定到socket，用于私聊
		UserBind(name){
			let bind = this.__formatData("bind",name);
			this.SocketTask.send({
				data:bind,
				success: (res) => {
					// console.log("绑定成功");
				}
			})
			
		},
		__formatData(type,data){
			switch(type){
				case 'bind':
				let bind = {
					type,
					name:data
				}
				return JSON.stringify(bind);
				break;
				default:
				break;
			}
		}
		// 用户绑定结果
		resultUserBind(res){
			if (res.status && res.type == 'bind') {
				// 改为上线状态
				this.IsOnline = true;
				// 获取总未读数,并且渲染到tabbar的badge
				this.initTabbarBadge();
				// 获取未读信息
				this.getChatMessages();
				return;
			}
			// 绑定失败,断开连接
			uni.showToast({ title: res.msg, icon:"none" });
			this.SocketTask.close();
		},
		Message(){
			this.SocketTask.onMessage((e)=>{
				// 字符串转json
				let res = JSON.parse(e.data);
				// 绑定返回结果
				if (res.type == 'bind'){
					//return this.resultUserBind(res);
					return this.UserBind(res.data);
				}
				if (res.type !== 'text') return;
				// 全局通知接口
				uni.$emit('UserChat',res);
				// 存储到chatdetail
				this.__UpdateChatdetail(res);
				// 更新chatlist（将当前会话置顶，修改chatlist中当前会话的data和time显示）
				this.__UpdateChatlist(res);
				// 总未读数+1，修改tabbar信息数
				if (this.CurrentToUser.userid !== res.from_id) {
					this.__UpdateNoReadNum({ type:"add" });
				}
			})
			// console.log('监听信息')
		},
		send(data){
			/**
			 {
				 type:'text',
				 data:'消息内容'
			 }
			 * */
			// 发送的格式
			let senddata = this.__format(data,{type:"send"});
			// 存储到chatdetail
			this.__UpdateChatdetail(senddata,true);
			// 存储到chatlist（将当前会话置顶，修改chatlist中当前会话的data和time显示）
			this.__UpdateChatlist(senddata);
			// 发送到服务器（交由页面去做）
			return senddata;
		},
		__format(data,options={}){
			/**
			 options = {
				 type:"chatdetail", // 转化类型
				 olddata:olddata,   // 旧数据（chatdetail中必填）
				 isme:true			// （true本人，false聊天对象，chatdetail中必填）
			 }
			 * */
			switch (options.type){
				case "chatlist":// 新增会话用到
				let obj = {
					userid:data.from_id,
					userpic:data.from_userpic,
					username:data.from_username,
					time:data.time, // 最新消息时间戳
					data:data.data,
					noreadnum:0		 // 未读数
				};
				// 本人发送的信息
				if (data.from_id == User.userinfo.id) {
					obj.userid = this.CurrentToUser.userid;
					obj.userpic = this.CurrentToUser.userpic;
					obj.username = this.CurrentToUser.username;
				}
				return obj;
					break;
				case "chatdetail":
				let list = options.olddata; // 旧数据
				let chattime = new Date().getTime();  // 获取当前时间
				let length = list.length;
				return {
					isme:options.isme,
					userpic:options.isme ? User.userinfo.userpic : data.from_userpic,
					type:data.type,
					data:data.data,
					time:chattime,
					gstime:Time.gettime.getChatTime(chattime,(length > 0) ? list[length-1].time : 0)
				};
					break;
				case "send":
				return {
					to_id:this.CurrentToUser.userid,
					from_id:User.userinfo.id,
					from_username:User.userinfo.username,
					from_userpic:User.userinfo.userpic,
					type:data.type,
					data:data.data,
					time:new Date().getTime()
				}
					break;
			}
		},
}