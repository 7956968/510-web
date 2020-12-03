import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import Cookies from 'js-cookie'
import store from '../../store'

const user = {
  state: {
    userInfo: '',
    permissions: []
  },

  mutations: {
    SET_USER: (state, user) => {
      state.userInfo = user
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password,userInfo.imageCode).then(response => {
          const data = response.data;
          let user = data.principal;
           let permission = user.routers;
          // let permission = [
          //   {
          //     "path": '/attendance',
          //     "component": "Layout",
          //     "redirect": "noRedirect",
          //     "name":"考勤管理",
          //     "meta": {
          //       "title": 'AttendanceManagement',
          //       "icon": 'dealWith'
          //     },
          //     "children": [
          //       {
          //         "path":"index",
          //         "component": "system/dict",
          //         "name": 'AttendanceRecord',
          //         "meta": { "name": '考勤记录',"title": 'AttendanceRecord',"noCache": "true","btnPermissions": ['admin','supper','normal']}
          //       },
          //       {
          //         "path":"statistics",
          //         "component": "attendance/statisticsNew",
          //         "name": 'AttendanceRecord',
          //         "meta": { "name": '统计报表',"title": '统计报表',"noCache": "true","btnPermissions": ['admin','supper']}
          //       },
          //
          //       {
          //         "path":"setting",
          //         "component": "attendance/settingNew",
          //         "name": 'AttendanceRecord',
          //         "meta": { "name": '考勤设置',"title": '考勤设置', "noCache": "true"}
          //       },
          //       {
          //         "path":"squadPeriodSetting",
          //         "component": "attendance/spuadPeriodSetting",
          //         "name": 'squadPeriodSetting',
          //         "meta": { "name": '班段设置',"title": '班段设置',"noCache": "true"}
          //       },
          //
          //       {
          //         "path":"vacation",
          //         "component": "attendance/vacation",
          //         "name": 'AttendanceRecord',
          //         "meta": { "name": '假期设置',"title": '假期设置',"noCache": "true"}
          //       },
          //       {
          //         "path":"attendanceLocation",
          //         "component": "attendance/attendanceLocation",
          //         "name": 'attendanceLocation',
          //         "meta": { "name": '考勤位置',"title": '考勤位置', "noCache": "true"}
          //       },
          //     ]
          //   },
          // ]

          // commit('SET_USER', user.vue);
          // let route = store.getters.addRoutes;
          // console.log("1111111111")
          // console.log(route)
          commit('SET_PERMISSIONS', permission);
          Cookies.set("Admin-Token",user);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit}) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data.data;
          let user = data.principal;
          let permission = user.routers;
          // let permission = [
          //   {
          //     "path": '/attendance',
          //     "component": "Layout",
          //     "redirect": "noRedirect",
          //     "name":"考勤管理",
          //     "meta": {
          //       "title": 'AttendanceManagement',
          //       "icon": 'dealWith'
          //     },
          //     "children": [
          //       {
          //         "path":"index",
          //         "component": "system/dict",
          //         "name": 'AttendanceRecord',
          //         "meta": { "name": '考勤记录',"title": 'AttendanceRecord',"noCache": "true","btnPermissions": ['admin','supper','normal']}
          //       },
          //       {
          //         "path":"statistics",
          //         "component": "attendance/statisticsNew",
          //         "name": 'AttendanceRecord',
          //         "meta": { "name": '统计报表',"title": '统计报表',"noCache": "true"}
          //       },
          //
          //       {
          //         "path":"setting",
          //         "component": "attendance/settingNew",
          //         "name": 'AttendanceRecord',
          //         "meta": { "name": '考勤设置',"title": '考勤设置', "noCache": "true"}
          //       },
          //       {
          //         "path":"squadPeriodSetting",
          //         "component": "attendance/spuadPeriodSetting",
          //         "name": 'squadPeriodSetting',
          //         "meta": { "name": '班段设置',"title": '班段设置',"noCache": "true"}
          //       },
          //
          //       {
          //         "path":"vacation",
          //         "component": "attendance/vacation",
          //         "name": 'AttendanceRecord',
          //         "meta": { "name": '假期设置',"title": '假期设置',"noCache": "true"}
          //       },
          //       {
          //         "path":"attendanceLocation",
          //         "component": "attendance/attendanceLocation",
          //         "name": 'attendanceLocation',
          //         "meta": { "name": '考勤位置',"title": '考勤位置', "noCache": "true"}
          //       },
          //     ]
          //   },
          // ]
          commit('SET_USER', user);
          commit('SET_PERMISSIONS', permission);

          resolve(response);
        }).catch(error => {
          reject(error)
        })
      })
    },


    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          Cookies.set("Admin-Token","");
          commit('SET_USER', null);
          commit('SET_PERMISSIONS', []);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        Cookies.set("Admin-Token","");
        commit('SET_USER', null);
        commit('SET_PERMISSIONS', []);
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          resolve()
        })
      })
    }
  }
}

export default user
