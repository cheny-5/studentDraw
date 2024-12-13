import Vue from 'vue'
import axios from 'axios'
import config from './config'

axios.defaults.baseURL = config.api; // 设置axios访问路径前缀
axios.defaults.timeout = 12000; // 设置axios的请求时间

axios.loadData = async function (url) {
  const resp = await axios.get(url);
  return resp.data;
}

Vue.prototype.$http = axios;