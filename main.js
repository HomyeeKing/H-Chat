import Vue from 'vue'
import App from './App'
import fly from "./utils/http.js"
import store from "./store/index.js"
//#ifdef H5 
import VueSocketIO from 'vue-socket.io'
//#endif
// 常用组件
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
import uniCombox from "@/components/uni-combox/uni-combox"
import uniPopup from "@/components/uni-popup/uni-popup.vue"
import uniIcons from "@/components/uni-icons/uni-icons.vue"
import uniFab from '@/components/uni-fab/uni-fab.vue';
Vue.component("uni-list", uniList)
Vue.component("uni-list-item", uniListItem)
Vue.component("uni-combox", uniCombox)
Vue.component("uni-popup", uniPopup)
Vue.component("uni-icons", uniIcons)
Vue.component("uni-fab", uniFab)


Vue.config.productionTip = false
Vue.prototype.$http = fly;
// socket和http请求的baseURL
Vue.prototype.$chat = "./utils/socket.js"
//#ifdef H5
Vue.use(new VueSocketIO({
    debug: false,
    // 服务器端地址
    connection: 'http://121.36.32.150:5000'
}))
//#endif
App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
