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
    children: [
      {
        path: '',
        component: () => import('@/views/dashboard/index'),
        name: 'Appointment',
        meta: { name: '首页', title: 'dashboard', icon: 'home', noCache: true }
      }

    ]
  },







  {
    path: '/login',
    name:'login',
    component: () => import('@/views/newlogin/login'),
    hidden: true
  },
  // {
  //   path: '/auth-redirect',
  //   name:'auth-redirect',
  //   component: () => import('@/views/login/authredirect'),
  //   hidden: true
  // },
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


  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: 'dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       name: 'Dashboard',
  //       meta: {  name: '首页',title: 'dashboard', icon: 'dashboard', noCache: true }
  //     }
  //   ]
  // },



]



export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
//动态路由
export const asyncRouterMap = [
  // {
  //   path: '/department',
  //   component: Layout,
  //   meta: { permission: ['mi_department'] },
  //   children: [
  //     {
  //       path:"index",
  //       component: () => import('@/views/department/index'),
  //       name: 'department',
  //       meta: { name: '组织机构',title: 'department', icon: 'tree', noCache: true,permission: ['m_department'] }
  //     },
  //
  //   ]
  // },
  // {
  //   path: '/user.vue',
  //   component: Layout,
  //   alwaysShow: true, // will always show the root menu
  //   name:"员工管理",
  //   meta: {
  //     clickAble:false,
  //     name:"员工管理",
  //     title: 'MemberManagement',
  //     icon: 'peoples',
  //     permission: ['m_user']
  //   },
  //   children: [
  //     {
  //       path:"user.vue",
  //       component: () => import('@/views/user.vue/UserList'),
  //       name: 'UserInfo',
  //       meta: { name: '员工信息',title: 'UserInfo', icon: 'people', noCache: true,permission: ['m_userInfo'] }
  //     },
  //     {
  //       path:"employeeAuth",
  //       component: () => import('@/views/device/employeeAuth'),
  //       name: 'EmployeeAuth',
  //       meta: { name: '员工授权',title: 'EmployeeAuth', icon: 'authorise', noCache: true ,permission: ['m_employeeAuth']}
  //     },
  //
  //   ]
  // },
  // {
  //   path: '/appointment',
  //   component: Layout,
  //   redirect: '/appointment/index',
  //   alwaysShow: true, // will always show the root menu
  //   meta: {
  //     clickAble:false,
  //     name: '访客管理',
  //     title: '访客管理',
  //     icon: 'dashboard',
  //      permission: ['m_visitor']
  //   },
  //   name: '访客管理',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/appointment/index'),
  //       name: 'index',
  //       meta: {name: '访客预约', title: '访客预约', icon: 'reserve',permission: ['u_appointment']}
  //     },
  //     {
  //       path:"visitor",
  //       component: () => import('@/views/device/visitorAuth'),
  //       name: 'VisitorAuth',
  //       meta: { name: '访客授权',title: 'VisitorAuth', icon: 'authorise', noCache: true ,permission: ['m_visitorAuto']}
  //     },
  //
  //     {
  //       path:"record",
  //       component: () => import('@/views/visitor/index'),
  //       name: 'Visitor',
  //       meta: { name: '访客记录',title: '访客记录', icon: 'documentation', noCache: true,permission: ['m_visitorRecord'] }
  //     },
  //     {
  //       path:"statistics",
  //       component: () => import('@/views/visitor/statistics'),
  //       name: 'Visitor',
  //       meta: { name: '访客统计',title: '访客统计', icon: 'statistics', noCache: true,permission: ['m_visitorStatistics'] }
  //     },
  //   ]
  // },
  //
  // {
  //   path: '/access',
  //   component: Layout,
  //   meta: { permission: ['m_access'] },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/accessRecord/index'),
  //       name: 'AccessRecord',
  //       meta: { name: '出入记录', title: 'AccessRecord', icon: 'list', noCache: true ,permission: ['m_accessRecord']}
  //     }
  //
  //   ]
  // },
  //
  // {
  //   path: '/device',
  //   component: Layout,
  //   alwaysShow: true, // will always show the root menu
  //   name:"设备管理",
  //   meta: {
  //     clickAble:false,
  //     name:"设备管理",
  //     title: 'DeviceManagement',
  //     icon: 'component',
  //     permission: ['m_device']
  //   },
  //   children: [
  //     {
  //       path:"location",
  //       component: () => import('@/views/device/location'),
  //       name: 'LocationInfo',
  //       meta: { name: '位置管理',title: 'LocationInfo', icon: 'address', noCache: true ,permission: ['m_location']}
  //     },
  //     {
  //       path:"info",
  //       component: () => import('@/views/device/deviceInfo'),
  //       name: 'DeviceInfo',
  //       meta: { name: '设备信息',title: 'DeviceInfo', icon: 'devicemsg', noCache: true , permission: ['m_deviceInfo']}
  //     },
  //     {
  //       path:"emergent",
  //       component: () => import('@/views/device/emergentAuth'),
  //       name: 'EmergentAuth',
  //       meta: { name: '紧急设置',title: 'EmergentAuth', icon: 'system', noCache: true, permission: ['m_emergentAuth']}
  //     },
  //
  //   ]
  // },
  // {
  //   path: '/attendance',
  //   component: Layout,
  //   alwaysShow: true, // will always show the root menu
  //   name:"考勤管理",
  //   meta: {
  //     clickAble:false,
  //     name:"考勤管理",
  //     title: 'AttendanceManagement',
  //     icon: 'component',
  //     permission: ['m_attendance']
  //   },
  //   children: [
  //     {
  //       path:"index",
  //       component: () => import('@/views/attendance/record'),
  //       name: 'AttendanceRecord',
  //       meta: { name: '考勤记录',title: 'AttendanceRecord', icon: 'documentation', noCache: true,permission: ['m_attendanceRecord'] }
  //     },
  //     {
  //       path:"statistics",
  //       component: () => import('@/views/attendance/statisticsNew'),
  //       name: 'AttendanceRecord',
  //       meta: { name: '统计报表',title: '统计报表', icon: 'statistics', noCache: true ,permission: ['m_statistics']}
  //     },
  //
  //     {
  //       path:"setting",
  //       component: () => import('@/views/attendance/settingNew'),
  //       name: 'AttendanceRecord',
  //       meta: { name: '考勤设置',title: '考勤设置', icon: 'system', noCache: true ,permission: ['m_attendanceSetting']}
  //     },
  //     {
  //       path:"squadPeriodSetting",
  //       component: () => import('@/views/attendance/spuadPeriodSetting'),
  //       name: 'squadPeriodSetting',
  //       meta: { name: '班段设置',title: '班段设置', icon: 'system', noCache: true ,permission: ['m_squadPeriodSetting']}
  //     },
  //
  //     {
  //       path:"vacation",
  //       component: () => import('@/views/attendance/vacation'),
  //       name: 'AttendanceRecord',
  //       meta: { name: '假期设置',title: '假期设置', icon: 'system', noCache: true,permission: ['m_vacation'] }
  //     },
  //   ]
  // },
  //
  //
  // {
  //   path: '/user.vue',
  //   component: Layout,
  //   meta: { permission: ['u_myInfo'] },
  //   children: [
  //     {
  //       path: 'myinfo',
  //       component: () => import('@/views/user.vue/MyInfo'),
  //       name: 'MyInfo',
  //       meta: { name: '我的资料', title: 'MyInfo', icon: 'user.vue', noCache: true }
  //     }
  //
  //   ]
  // },
  //
  // {
  //   path: '/user.vue',
  //   component: Layout,
  //   hidden: true,//不再菜单中显示
  //   name:'修改密码',
  //   children: [
  //     {
  //       path: 'modifyPassword',
  //       component: () => import('@/views/user.vue/ModifyPassword'),
  //       name: 'ModifyPassword',
  //       meta: { name: '修改密码', title: 'modifyPassword',  noCache: true }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/index',
  //   alwaysShow: true, // will always show the root menu
  //   meta: {
  //     clickAble:false,
  //     name:"权限管理",
  //     title: 'permission',
  //     icon: 'lock',
  //     permission: ['m_permission']
  //   },
  //   name:"权限管理",
  //   children: [
  //     {
  //       path: 'admin',
  //       component: () => import('@/views/permission/sysUserList'),
  //       name: 'Administrator',
  //       meta: {
  //         name: '管理员管理',
  //         title: 'administrator',
  //         icon: 'admin',
  //         permission: ['m_autoPermission'],
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'Role',
  //       meta: {
  //         name: '角色管理',
  //         title: 'roleManagement',
  //         icon: 'role',
  //         permission: ['m_roleManagement'],
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     // {
  //     //   path: 'weixin',
  //     //   component: () => import('@/views/permission/weixinPremission'),
  //     //   name: 'weix',
  //     //   meta: {
  //     //     name: '小程序授权',
  //     //     title: '小程序授权',
  //     //     icon: 'role',
  //     //     permission: ['m_weixin_permission'],
  //     //     // if do not set roles, means: this page does not require permission
  //     //   },
  //     // }
  //   ]
  // },
  //
  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/index',
  //   alwaysShow: true, // will always show the root menu
  //   meta: {
  //     clickAble:false,
  //     name: '系统管理',
  //     title: 'system',
  //     icon: 'system',
  //     permission: ['m_system']
  //   },
  //   name: '系统管理',
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/log/index'),
  //       name: 'Log',
  //       meta: {
  //         name: '日志管理',
  //         title: 'log',
  //         icon: 'documentation',
  //         permission: ['m_systemLog'],
  //       }
  //     },
  //     {
  //       path: 'system',
  //       component: () => import('@/views/system/index'),
  //       name: 'Dict',
  //       meta: {
  //         name: '数据字典',
  //         title: 'system',
  //         icon: 'documentation',
  //         permission: ['m_dict'],
  //       }
  //     },
  //
  //   ]
  // }
  // {
  //   path: '/trueTime',
  //   component: Layout,
  //   meta: { permission: ['m_trueTime'] },
  //   name:'实时视频',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/accessRecord/index'),
  //       name: 'AccessRecord',
  //       meta: { name: '实时视频', title: '实时视频', icon: 'trueTime', noCache: true ,permission: ['m_index1']}
  //     }
  //   ]
  // },
  // {
  //   path: '/playback',
  //   component: Layout,
  //   meta: { permission: ['m_playback'] },
  //   name:'视频回放',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/accessRecord/index'),
  //       name: 'AccessRecord',
  //       meta: { name: '视频回放', title: '视频回放', icon: 'playback', noCache: true ,permission: ['m_index2']}
  //     }
  //   ]
  // },
  // {
  //   path: '/map',
  //   component: Layout,
  //   meta: { permission: ['m_map'] },
  //   name:'三维地图',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/accessRecord/index'),
  //       name: 'AccessRecord',
  //       meta: { name: '三维地图', title: '三维地图', icon: 'map', noCache: true ,permission: ['m_index3']}
  //     }
  //   ]
  // },
  // {
  //   path: '/alarm',
  //   component: Layout,
  //   redirect: '/alarm/index',
  //   alwaysShow: true, // will always show the root menu
  //   meta: {
  //     clickAble:false,
  //     name:"报警中心",
  //     title: '报警中心',
  //     icon: 'alarm',
  //     permission: ['m_alarm']
  //   },
  //   children: [
  //     {
  //       path: 'analysis',
  //       component: () => import('@/views1/alarm/analysis'),
  //       name: 'analysis',
  //       meta: { name: '智能分析', title: '智能分析', icon: 'm_analysis', noCache: true ,permission: ['m_analysis']}
  //     },
  //     {
  //       path: 'index',
  //       component: () => import('@/views1/alarm/index'),
  //       name: 'untreated',
  //       meta: { name: '未处理信息', title: '未处理信息', icon: 'untreated', noCache: true ,permission: ['m_untreated']}
  //     },
  //     {
  //       path: 'dealWith',
  //       component: () => import('@/views1/alarm/dealWith'),
  //       name: 'dealWith',
  //       meta: { name: '已处理信息', title: '已处理信息', icon: 'dealWith', noCache: true ,permission: ['m_dealWith']}
  //     }
  //   ]
  // },
  // {
  //   path: '/firefighting',
  //   component: Layout,
  //   redirect: '/firefighting/waterTank',
  //   alwaysShow: true, // will always show the root menu
  //   meta: {
  //         clickAble:false,
  //         name:"消防中心",
  //         title: '消防中心',
  //         icon: 'firefighting',
  //         permission: ['m_firefighting']
  //       },
  //   children: [
  //     {
  //       path: 'waterTank',
  //       component: () => import('@/views1/firefighting/waterTank'),
  //       name: 'waterTank',
  //       meta: { name: '水箱监测', title: '水箱监测', icon: 'waterTank', noCache: true ,permission: ['m_waterTank']}
  //     },
  //     {
  //       path: 'butterfly',
  //       component: () => import('@/views1/firefighting/butterfly'),
  //       name: 'butterfly',
  //       meta: { name: '蝶阀监测', title: '蝶阀监测', icon: 'butterfly', noCache: true ,permission: ['m_butterfly']}
  //     },
  //     {
  //       path: 'linkageVideo',
  //       component: () => import('@/views1/firefighting/linkage'),
  //       name: 'linkageVideo',
  //       meta: { name: '联动视频', title: '联动视频', icon: 'trueTime', noCache: true ,permission: ['m_linkageVideo']}
  //     },
  //     {
  //       path: 'extinguisher',
  //       component: () => import('@/views1/firefighting/butterfly'),
  //       name: 'extinguisher',
  //       meta: { name: '灭火器信息', title: '灭火器信息', icon: 'firefighting', noCache: true ,permission: ['m_extinguisher']}
  //     },
  //   ]
  // },
  // {
  //   path: '/inbreak',
  //   component: Layout,
  //   meta: { permission: ['m_inbreak'] },
  //   name:'周界入侵',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/accessRecord/index'),
  //       name: 'inbreak',
  //       meta: { name: '周界入侵', title: '周界入侵', icon: 'inbreak', noCache: true ,permission: ['m_index17']}
  //     }
  //   ]
  // },
  // {
  //   path: '/dervice',
  //   component: Layout,
  //   meta: { permission: ['m_dervice'] },
  //   name:'设备管理',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/accessRecord/index'),
  //       name: 'AccessRecord',
  //       meta: { name: '设备管理', title: '设备管理', icon: 'device', noCache: true ,permission: ['m_index6']}
  //     }
  //   ]
  // },
  // {
  //   path: '/linkage',
  //   component: Layout,
  //   meta: { permission: ['m_linkage'] },
  //   name:'联动管理',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/accessRecord/index'),
  //       name: 'AccessRecord',
  //       meta: { name: '联动管理', title: '联动管理', icon: 'linkage', noCache: true ,permission: ['m_index7']}
  //     }
  //   ]
  // },
  // {
  //   path: '/matrix',
  //   component: Layout,
  //   meta: { permission: ['m_matrix'] },
  //   name:'矩阵管理',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/accessRecord/index'),
  //       name: 'AccessRecord',
  //       meta: { name: '矩阵管理', title: '矩阵管理', icon: 'matrix', noCache: true ,permission: ['m_index8']}
  //     }
  //   ]
  // },
  // {
  //   path: '/visitory',
  //   component: Layout,
  //   meta: { permission: ['m_visitory'] },
  //   name:'门禁信息',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/accessRecord/index'),
  //       name: 'AccessRecord',
  //       meta: { name: '门禁信息', title: '门禁信息', icon: 'visitory', noCache: true ,permission: ['m_index9']}
  //     }
  //   ]
  // },
  // {
  //   path: '/car',
  //   component: Layout,
  //   meta: { permission: ['m_car'] },
  //   name:'车辆信息',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/accessRecord/index'),
  //       name: 'AccessRecord',
  //       meta: { name: '车辆信息', title: '车辆信息', icon: 'car', noCache: true ,permission: ['m_index10']}
  //     }
  //   ]
  // },
  // {
  //   path: '/diagnostics',
  //   component: Layout,
  //   meta: { permission: ['m_diagnostics'] },
  //   name:'视频诊断',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/accessRecord/index'),
  //       name: 'AccessRecord',
  //       meta: { name: '视频诊断', title: '视频诊断', icon: 'diagnostics', noCache: true ,permission: ['m_index11']}
  //     }
  //   ]
  // },
  // {
  //   path: '/nightPatrol',
  //   component: Layout,
  //   meta: { permission: ['m_nightPatrol'] },
  //   name:'巡更系统',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/accessRecord/index'),
  //       name: 'nightPatrol',
  //       meta: { name: '巡更系统', title: '巡更系统', icon: 'nightPatrol', noCache: true ,permission: ['m_index16']}
  //     }
  //   ]
  // },
  // {
  //   path: '/log',
  //   component: Layout,
  //   meta: { permission: ['m_log'] },
  //   name:'日志管理',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/accessRecord/index'),
  //       name: 'AccessRecord',
  //       meta: { name: '日志管理', title: '日志管理', icon: 'log', noCache: true ,permission: ['m_index12']}
  //     }
  //   ]
  // },
  // {
  //   path: '/user.vue',
  //   component: Layout,
  //   meta: { permission: ['m_user'] },
  //   name:'用户管理',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/accessRecord/index'),
  //       name: 'AccessRecord',
  //       meta: { name: '用户管理', title: '用户管理', icon: 'user.vue', noCache: true ,permission: ['m_index13']}
  //     }
  //   ]
  // },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   meta: { permission: ['m_permission'] },
  //   name:'权限管理',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/accessRecord/index'),
  //       name: 'AccessRecord',
  //       meta: { name: '权限管理', title: '权限管理', icon: 'permission', noCache: true ,permission: ['m_index14']}
  //     }
  //   ]
  // },
  // {
  //   path: '/system',
  //   component: Layout,
  //   meta: { permission: ['m_system'] },
  //   name:'系统管理',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/accessRecord/index'),
  //       name: 'AccessRecord',
  //       meta: { name: '系统管理', title: '系统管理', icon: 'sys', noCache: true ,permission: ['m_index15']}
  //     }
  //   ]
  // },
]
