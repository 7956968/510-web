import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout/Layout'

Vue.use(Router)


export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    name:'redirect',
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/dashboard/index'),
        name: 'Appointment',
        meta: { name: '首页', title: 'dashboard', icon: 'dashboard', noCache: true }
      }

    ]
  },

  {
    path: '/login',
    name:'login',
    component: () => import('@/views/newlogin/login'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    name:'auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '404',
        name:'404',
        component: () => import('@/views/errorPage/404'),
        meta: {  name: '404',title: '404', }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '401',
        name:'401',
        component: () => import('@/views/errorPage/401'),
        meta: {  name: '401',title: '401', }
      }
    ]
  },

  {
    path: '/test',
    name:'test',
    component: () => import('@/views/department/index'),
    hidden: true
  },
]



export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export const asyncRoutes = {
  'index': {
    path: 'index',
    component: () => import('@/views/appointment/index'),
    name: 'index',
  },
  'VisitorAuth': {
    path:"visitor",
    component: () => import('@/views/device/visitorAuth'),
    name: 'VisitorAuth',
  },
  'Visitor': {
    path:"record",
    component: () => import('@/views/visitor/index'),
    name: 'Visitor',
  },
  'UserInfo': {
    path:"user",
    component: () => import('@/views/user.vue/UserList'),
    name: 'UserInfo',
  },
  'department': {
    path:"index",
    component: () => import('@/views/department/index'),
    name: 'department',
  },
  'EmployeeAuth': {
    path:"employeeAuth",
    component: () => import('@/views/device/employeeAuth'),
    name: 'EmployeeAuth',
  },
  'DeviceInfo': {
    path:"info",
    component: () => import('@/views/device/deviceInfo'),
    name: 'DeviceInfo',
  },
  'LocationInfo': {
    path:"location",
    component: () => import('@/views/device/location'),
    name: 'LocationInfo',
  },
  'AttendanceRecord': {
    path:"index",
    component: () => import('@/views/attendance'),
    name: 'AttendanceRecord',
  },
  'statistics': {
    path:"statistics",
    component: () => import('@/views/attendance/statistics'),
    name: 'statistics',
  },
  'setting': {
    path:"setting",
    component: () => import('@/views/attendance/setting'),
    name: 'setting',
  },
  'vacation': {
    path:"vacation",
    component: () => import('@/views/attendance/vacation'),
    name: 'vacation',
  },
  'AccessRecord': {
    path: 'AccessRecord',
    component: () => import('@/views/accessRecord/index'),
    name: 'AccessRecord',
  },
  'myinfo': {
    path: 'myinfo',
    component: () => import('@/views/user.vue/MyInfo'),
    name: 'MyInfo',
  },
  'modifyPassword': {
    path: 'modifyPassword',
    component: () => import('@/views/user.vue/ModifyPassword'),
    name: 'ModifyPassword',
  },
  'Administrator': {
    path: 'admin',
    component: () => import('@/views/permission/sysUserList'),
    name: 'Administrator',
  },
  'role': {
    path: 'role',
    component: () => import('@/views/permission/role'),
    name: 'Role',
  },
  'Log': {
    path: 'log',
    component: () => import('@/views/log/index'),
    name: 'Log',
  },

}
