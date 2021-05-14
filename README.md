# 510_web3

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## src下的目录结构
```
│  App.vue
│  errorLog.js
│  main.js
│  permission.js
│
├─api  后端接口
│      channel.js
│      department.js
│      device.js
│      dict.js
│      log.js
│      login.js
│      permission.js
│      role.js
│      rolePermission.js
│      selectOption.js
│      url.js
│      userManage.js
│      video.js
│
├─assets 资源文件（存放各种图片，字体）
│  │  ...
│  ├─401_images
│  ├─404_images
│  ├─custom-theme
│  │  └─fonts
│  │          element-icons.ttf
│  │          element-icons.woff
│  ├─iconFont
│  └─icons
│      └─svg  存放各种小图标
│
├─components 常用的小组件
│  │  HelloWorld.vue
│  │  type.vue
│  │
│  ├─BackToTop 回顶部
│  ├─Breadcrumb 面包屑
│  ├─Charts
│  │  │  keyboard.vue
│  │  │  lineMarker.vue
│  │  │  mixChart.vue
│  │  │
│  │  └─mixins
│  │          resize.js
│  │
│  ├─Dialog
│  ├─DndList
│  ├─Dropzone
│  ├─ErrorLog
│  ├─Hamburger
│  ├─ImageCropper  图片裁剪
│  │  └─utils
│  │          data2blob.js
│  │          effectRipple.js
│  │          language.js
│  │          mimes.js
│  │
│  ├─JsonEditor
│  ├─Kanban
│  ├─LangSelect
│  ├─MapTable
│  ├─MarkdownEditor  markdown编辑
│  ├─MDinput
│  ├─PanThumb
│  ├─Screenfull
│  ├─ScrollPane
│  ├─Share
│  ├─SizeSelect
│  ├─Sticky
│  ├─SvgIcon 图标
│  ├─TextHoverEffect
│  ├─ThemePicker
│  ├─Tinymce  可视化html编辑器
│  ├─treeSelect 树形下拉选择
│  ├─TreeTable  自定义的树形表格
│  ├─treeTable1
│  ├─Upload 图片上传
│  │      singleImage.vue
│  │      singleImage2.vue
│  │      singleImage3.vue
│  └─UploadExcel excel文件上传
│
├─directive
│  │  sticky.js
│  │
│  ├─clipboard
│  │      clipboard.js
│  │      index.js
│  │
│  ├─el-dragDialog
│  │      drag.js
│  │      index.js
│  │
│  ├─permission
│  │      index.js
│  │      permission.js
│  │
│  └─waves
│          index.js
│          waves.css
│          waves.js
│
├─filters
│      index.js
│
├─icons 图标
│  │  index.js
│  │  ship.jpg
│  │
│  └─svg
├─lang
│      en.js
│      index.js
│      zh.js
│
├─layout
│  │  Layout.vue
│  │
│  ├─components
│  │  │  AppMain.vue
│  │  │  index.js
│  │  │  Navbar.vue
│  │  │  TagsView.vue
│  │  │
│  │  └─Sidebar
│  │          index.vue
│  │          Item.vue
│  │          SidebarItem.vue
│  │
│  └─mixin
│          ResizeHandler.js
│
├─mock
│      article.js
│      index.js
│      login.js
│      remoteSearch.js
│      transaction.js
│
├─router
│      index.js
│      index1.js
│
├─select
│      index.js
│
├─store
│  │  getters.js
│  │  index.js
│  │
│  └─modules
│          app.js
│          errorLog.js
│          permission.js
│          selectOption.js
│          tagsView.js
│          user.js
│
├─styles 样式
│      btn.scss
│      element-ui.scss
│      index.scss
│      mixin.scss
│      shared.min.css
│      sidebar.scss
│      transition.scss
│      variables.scss
│
├─utils  实用的工具函数
│      asyncRouter.js
│      auth.js 用户权限相关
│      btnPermissions.js
│      clipboard.js
│      createUniqueString.js
│      DateUtil.js 日期
│      i18n.js 切换语言相关
│      index.js
│      openWindow.js
│      permission.js
│      request.js http请求
│      validate.js 表单检验数据格式
│
├─vendor
│      Blob.js
│      Export2Excel.js 导出excel表格
│      Export2Zip.js 导出zip压缩包
│
└─views  页面组件
    ├─car  车辆管理
    │      car.vue
    │
    ├─dashboard  首页(各种快捷方式)
    │  │  index.vue
    │  │
    │  └─components
    │          PanelGroup.vue
    │
    ├─department  部门管理
    ├─device  设备管理
    │      channel.vue  设备通道
    │      index.vue
    │      liandong.vue  联动管理
    ├─errorLog
    │      errorTestA.vue
    │      errorTestB.vue
    │      index.vue
    ├─errorPage
    │      401.vue
    │      404.vue
    ├─fireCenter 消防中心
    │      extinguisher.vue 灭火器信息
    ├─font 字体
    │
    ├─layout(这个组件是不使用的，实际使用的是*/src/layout/components/Navbar.vue)
    │  │  Layout.vue
    │  │
    │  ├─components
    │  │  │  AppMain.vue
    │  │  │  index.js
    │  │  │  Navbar.vue
    │  │  │  TagsView.vue
    │  │  │
    │  │  └─Sidebar 侧边栏
    │  │          index.vue
    │  │          Item.vue
    │  │          SidebarItem.vue 侧边栏的菜单项目
    │  │
    │  └─mixin
    │          ResizeHandler.js
    │
    ├─newlogin 登陆界面组件
    │  │  login.vue
    │  │
    │  └─components
    │          index.js
    │          LoginContent.vue
    │          LoginForm.vue
    │          LoginNavbar.vue
    │
    ├─redirect 重定向
    ├─svg-icons 图标
    │      index.vue
    │      requireIcons.js
    │
    ├─system  系统管理
    │      dict.vue 数据字典
    │      permission.vue 权限管理
    │      role.vue 角色管理
    │
    └─userManage  用户管理
```

## src/icons/svg下的图标
|文件名|解释|
|----|----|
|alarm|报警|
|butterfly|蝶阀检测|
|car|汽车|
|dealWith|待处理|
|delete|删除|
|device|设备|
|diagnostics|诊断|
|export|导出|
|firefighting|灭火器|
|home|首页|
|import|导入|
|inbreak|（周界）入侵|
|linkage|联动|
|log|日志|
|m_analysis|数据分析|
|map|地图|
|matrix|矩阵管理|
|newly|添加|
|nightPatrol|夜晚巡更|
|permission|权限|
|playback|视频回放|
|select|查找（放大镜）|
|sys|系统设置|
|trueTime|实时视频|
|untreated|未处理|
|update|修改|
|user|用户|
|visitory|访客|
|waterTank|水箱|

## 常见问题

### treeselect组件变得巨大，影响正常使用
```javascript
import selectTree from "@riophae/vue-treeselect";
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
```
第二行影响样式，如果缺少第二行，组件变得巨大

### watch监听某对象变化时，只想监听某对象的某个属性的变化
使用单引号，'对象名.属性名'
```vue
watch: {
    // 如果分组被切换，通道不显示数据
    'param.groupId'(newVal, oldVal){
      dosth();
    }
  },
```
