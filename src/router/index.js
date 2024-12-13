import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

function route (path, file, name, children) {
  return {
    exact: true,
    path,
    name,
    children,
    component: () => import('../pages' + file)
  }
}

export default new Router({
  routes: [
    route("/index",'/layout',"vlayout"),// /login路径，	
    {
      path:"/", // 根路径，路由到 Layout组件
      component: () => import('../pages/layout'),
      redirect:"/index/dashboard",
      children:[ // 其它所有组件都是 Layout的子组件
		route("/index/dashboard",'/Dashboard',"Dashboard"), //主页
        route("/analysis/personal",'/person_analysis/personal',"personal"), //学生画像
        route("/analysis/classes",'/classes_analysis/classes',"classes"), //班级画像
   
      ]
    }
	
  ]
})
