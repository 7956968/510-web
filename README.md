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
├─assets 资源文件
│  │  attendance.png
│  │  background.jpg
│  │  device.jpg
│  │  device.png
│  │  device1.jpg
│  │  echarts-macarons.js
│  │  head1.jpg
│  │  login-bg.jpg
│  │  login1.jpg
│  │  login_pic.png
│  │  login_pic1.png
│  │  logo.png
│  │  logo@2x.png
│  │  logo_black.png
│  │  logo_new_white.jpg
│  │  logo_new_white.png
│  │  nav_logo.png
│  │  ship.jpg
│  │  title-logo.png
│  │  visitor.jpg
│  │  yuangong.jpg
│  │  yuangong.png
│  │
│  ├─401_images
│  │      401.gif
│  │
│  ├─404_images
│  │      404.png
│  │      404_cloud.png
│  │
│  ├─custom-theme
│  │  └─fonts
│  │          element-icons.ttf
│  │          element-icons.woff
│  │
│  ├─iconFont
│  │      iconfont.css
│  │      iconfont.eot
│  │      iconfont.js
│  │      iconfont.json
│  │      iconfont.svg
│  │      iconfont.ttf
│  │      iconfont.woff
│  │      iconfont.woff2
│  │
│  └─icons
│      └─svg
│              shiping.svg
│
├─components 常用的小组件
│  │  HelloWorld.vue
│  │  type.vue
│  │
│  ├─BackToTop
│  │      index.vue
│  │
│  ├─Breadcrumb
│  │      index.vue
│  │
│  ├─Charts
│  │  │  keyboard.vue
│  │  │  lineMarker.vue
│  │  │  mixChart.vue
│  │  │
│  │  └─mixins
│  │          resize.js
│  │
│  ├─Dialog
│  │      index.vue
│  │
│  ├─DndList
│  │      index.vue
│  │
│  ├─Dropzone
│  │      index.vue
│  │
│  ├─ErrorLog
│  │      index.vue
│  │
│  ├─Hamburger
│  │      index.vue
│  │
│  ├─ImageCropper
│  │  │  index.vue
│  │  │
│  │  └─utils
│  │          data2blob.js
│  │          effectRipple.js
│  │          language.js
│  │          mimes.js
│  │
│  ├─JsonEditor
│  │      index.vue
│  │
│  ├─Kanban
│  │      index.vue
│  │
│  ├─LangSelect
│  │      index.vue
│  │
│  ├─MapTable
│  │      index.vue
│  │
│  ├─MarkdownEditor
│  │      index.vue
│  │
│  ├─MDinput
│  │      index.vue
│  │
│  ├─PanThumb
│  │      index.vue
│  │
│  ├─Screenfull
│  │      index.vue
│  │
│  ├─ScrollPane
│  │      index.vue
│  │
│  ├─Share
│  │      dropdownMenu.vue
│  │
│  ├─SizeSelect
│  │      index.vue
│  │
│  ├─Sticky
│  │      index.vue
│  │
│  ├─SvgIcon
│  │      index.vue
│  │
│  ├─TextHoverEffect
│  │      Mallki.vue
│  │
│  ├─ThemePicker
│  │      index.vue
│  │
│  ├─Tinymce
│  │  │  index.vue
│  │  │  plugins.js
│  │  │  toolbar.js
│  │  │
│  │  └─components
│  │          editorImage.vue
│  │
│  ├─treeSelect 树形下拉选择
│  │      el-tree-select.vue
│  │
│  ├─TreeTable  自定义的树形表格
│  │      eval.js
│  │      index.vue
│  │      readme.md
│  │
│  ├─treeTable1
│  │      dataTranslate.js
│  │      index.vue
│  │
│  ├─Upload 图片上传
│  │      singleImage.vue
│  │      singleImage2.vue
│  │      singleImage3.vue
│  │
│  └─UploadExcel excel文件上传
│          index.vue
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
├─utils  实用的函数
│      asyncRouter.js
│      auth.js
│      btnPermissions.js
│      clipboard.js
│      createUniqueString.js
│      DateUtil.js
│      i18n.js
│      index.js
│      openWindow.js
│      permission.js
│      request.js
│      validate.js
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
    ├─dashboard
    │  │  index.vue
    │  │
    │  └─components
    │          PanelGroup.vue
    │
    ├─department  部门管理
    │      index.vue
    │
    ├─device  设备管理
    │      channel.vue  设备通道
    │      index.vue
    │      liandong.vue  联动管理
    │
    ├─errorLog
    │      errorTestA.vue
    │      errorTestB.vue
    │      index.vue
    │
    ├─errorPage
    │      401.vue
    │      404.vue
    │
    ├─font
    │      fontawesome-webfont.eot
    │      fontawesome-webfont.svg
    │      fontawesome-webfont.ttf
    │      fontawesome-webfont.woff
    │      fontawesome-webfont.woff2
    │      iconfont.eot
    │      iconfont.ttf
    │      iconfont.woff
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
    ├─newlogin 登陆界面组件
    │  │  login.vue
    │  │
    │  └─components
    │          index.js
    │          LoginContent.vue
    │          LoginForm.vue
    │          LoginNavbar.vue
    │
    ├─redirect
    │      index.vue
    │
    ├─svg-icons
    │      index.vue
    │      requireIcons.js
    │
    ├─system  系统管理
    │      dict.vue
    │      live.vue
    │      permission.vue
    │      playback.vue
    │      role.vue
    │
    └─userManage  用户管理
            index.vue
```
## 常见问题

### treeselect组件变得巨大，影响正常使用
```javascript
import selectTree from "@riophae/vue-treeselect";
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
```
第二行影响样式，少了第二行

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
