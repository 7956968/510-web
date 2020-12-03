//  进度条引入设置如上面第一种描述一样
import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/utils/auth' // getUser from cookie
import Layout from '@/layout/Layout'
import { getAsyncRoutes } from '@/utils/asyncRouter'

function hasPermission(permission, route) {
  // return true;
  if (route.meta && route.meta.permission) {
    return permission.some(permission => {
      return  route.meta.permission.indexOf(permission.authority) >= 0;
    })
  } else {
    return true
  }
}
const whiteList = ['/login', '/auth-redirect','/test']// 免登陆白名单
router.beforeEach( async (to, from, next) => {
  NProgress.start()
  //document.title = to.meta.title;
  let a= to.meta
  // 获取用户token，用来判断当前用户是否登录
  let route =  store.getters.permissions;
  const hasRouters = route && route.length>0;
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.userInfo == null || store.getters.userInfo == "") { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          let accessRoutes = store.getters.permissions;
          const permission = getAsyncRoutes(accessRoutes);
          // debugger
          store.dispatch('GenerateRoutes', {permission}).then(() => { // 根据roles权限生成可访问的路由表

            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表

            next({...to, replace: true}) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch((err) => {
          if(err.response.status != 401){//在request.js中处理了,避免重复处理
            store.dispatch('FedLogOut').then(() => {
              Message.error(err || 'Verification failed, please login again')
              next({path: '/'})
            })
          }
        })
      } else {
       // next();
        if (to.name != null && hasPermission(store.getters.permissions, to)){//有权限的情况下才进入
          next();
        }else{
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }

      }
      }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
