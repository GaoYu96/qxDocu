## 介绍
> base-vue是基于vue-cli4、elementui开发的基础框架

## 功能


## 技术栈
> - nodejs
> - ES6
> - vue-cli
> - vue
> - vue-router
> - vuex
> - axios
> - vue-cookie
> - element-ui
> - iconfont

## 目录结构
├── dist                       // 构建打包生成部署文件
│   ├── 1805021549             // 静态资源
│   ├── config                 // 配置
│   ├── index.html             // index.html入口
├── public                     // 构建相关
│   ├── config                 // 配置文件
├── favicon.ico                // favicon图标
│   ├── index.html             // html模板
├── src                        // 源代码
│   ├── assets                 // 静态资源
│   ├── components             // 全局公用组件
│   ├── element-ui             // element-ui组件配置
│   ├── element-ui-theme       // element-ui组件主题配置
│   ├── router                 // 路由
│   ├── store                  // 全局 store管理
│   ├── utils                  // 全局公用方法
│   ├── views                  // view
│   ├── App.vue                // 入口组件
│   ├── main.js                // 入口
├── .babelrc                   // babel-loader 配置
├── .gitignore                 // git 忽略项
├── package.json               // package.json
└── vue.config.js              // 配置文件（代理，webpack）

## 安装依赖
npm install
## 启动
npm run serve
```


## 布局和主题
> 整体布局包括：(`对应代码在 src/views/main.vue`)

- 头部导航条 main-navbar
- 左侧边栏 main-sidebar
- 中间内容展示 main-content

> `除了404、login页面，其它页面都是基于这个布局的。`

- 无需嵌套上左右整体布局的路由称为“全局路由”放在`globalRoutes`常量中，
- 需嵌套上左右整体布局的路由称为“主入口路由”放在`mainRoutes`常量的`children`属性中。

> 对应代码在 src/router/index.js

```
// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } }
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },
    { path: '/theme', component: _import('common/theme'), name: 'theme', meta: { title: '主题' } },
    {
      path: '/demo-01',
      component: null, // 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
      name: 'demo-01',
      meta: {
        title: '我是一个通过iframe嵌套展示内容, 并通过tab打开 demo',
        isTab: true,
        iframeUrl: 'http://gitlab.kingyea.com.cn:8888/kingyea/bigdata/datac-vue'
      }
    }
  ],
  beforeEnter (to, from, next) {
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {
      next({ name: 'login' })
    }
    next()
  }
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

```

> 同时，主入口路由提供meta对象2个属性设置路由展示方式。

- `isTab`: 是否通过tab展示内容
- `iframeUrl`: 是否通过iframe嵌套展示内容

> 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!

## 主题定制
> 提供12套颜色主题，进行element-ui和整站主题切换。具体切换方法如下：

1. 修改`/src/element-ui-theme/index.js`文件中`import './element-[#17b3a3]/index.css'[]`中括号中的值，值可以在同文件中list属性中取即可。（注意：这里只是修改element-ui组件主题）
2. 修改`/src/assets/scss/_variables.scss`文件中`$--color-primary: [#17b3a3];[]`中括号中的值，值与第一步值同步即可。（注意：这里只是修改站点主题，不包括element-ui组件主题）

> 主题定制具体实现方法是：

1. 先通过element-ui官方提供的在线主题生成工具，进行切换主题色，再下载解压文件（保留fonts目录中文件和index.css即可）放置/src/element-ui-theme/目录中，使用同目录中的index.js进行统一配置管理。
2. 再设置修改站点主题，使整站主题色统一一致。


## 自定义组件使用
> 项目的自定义组件都在src/components 目录下，通过import 导入到指定页面使用

`通用方法继承`
>文件位置：src/components/baseDataOrMethods.js

1. 在需要的页面导入文件，并配置 extends 继承（在使用的页面可重写方法和变量）
```
  baseDataOrMethods.js文件是集合页面通用方法，里面涉及一些通用变量、方法
  【getDataList获取表格数据列表（包含普通查询，高级查询方法调用）、分页、增删改、表格样式等方法】

  普通查询 getDataList 传参：
    page、limit、searchCtx （页码，页数据量，查询关键词）
  高级查询：getDataList 传参：
    page、limit、searchCtx、encrypt、seniorSql、seniorParam (页码，页数据量，查询关键词, 是否加密高级查询参数，高级查询sql，高级查询值)
```


`高级查询组件 （基于继承 baseDataOrMethods.js ）`
>文件位置：src/components/senior-search.vue

1. 在需要引用的vue文件导入，并注册
2. 设置`ref`属性值为`seniorSearch`, 配置高级查询组件触发父组件高级查询方法：`@getSeniorData="getSeniorData`"
3. 例：
```
  <senior-search ref="seniorSearch" @getSeniorData="getSeniorData"></senior-search>
```
4. 高级查询组件里面用到encrypt 是对高级查询参数进行加密，调用方法：encrypt.jiami()； 文件位置：src/utils/encrypt


`高级查询组件 （不继承 baseDataOrMethods.js模板 ）`
  在上面使用的基础上,
1. 添加变量：
  `seniorParams`: {},  //高级查询参数变量
  `listURL`: '',       //高级查询url
  `tableHeader`: [     //高级查询字段集合
    {...},
  ]

2. 添加方法：
  （1）添加 `seniorSearch`方法（参考 base-list-component.vue），该方法是点击 “高级查询” 按钮，重置表格高度，使不产生滚动条，并调用senior-search组件的init初始化方法；调用init 方法 必传两参数 init(高级查询字段集合, 高级查询url)

  （2）添加 `getSeniorData`方法（参考 base-list-component.vue），该方法是点击 “应用” 按钮触发查询方法调用

```
( 注意：
  -| 如果查询字段值要设置下拉可选的：通过在tableHeader 里设置db_options属性，属性值格式为：[{label:'', value:''}] 
  -| 如果要另外设置查询字段，通过在tableHeader 设置db_props 属性
  例：
  tableHeader: [
    { key: 'name', prop: 'name', label: '主机名', db_prop : 'HOST_NAME', db_options: [{label:'主机1', value:'host1'}]}
  ]
)
```


`表格组件`
>文件位置：src/components/table.vue
1. 在需要引用的vue文件导入，并注册
2. 组件使用：
```
例: 
<m-table :tableHeader="tableHeader" :tableData="dataList" :hasSelection="false" :hasIndex="false" :tableHeight="tableHeight" @updateDataListSelections="updateDataListSelections">
  <!--  插入自定义配置 字段显示方式 【需要自定义列， tableHeader 要响应配置 slot：true】-->
  <div slot="dataSql" slot-scope="scope">
    <el-tooltip effect="dark" transition="false" :content="scope.row['dataSql']" placement="top-start" >
      <span class="hiddenSty">{{scope.row['dataSql']}}</span>
    </el-tooltip>
  </div>
  <!-- slot="handleColumn" 插入操作 -->
  <div slot="handleColumn">
    <el-table-column
      fixed="right"
      header-align="center"
      align="center"
      min-width="100"
      label="操作">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click.stop="deleteHandle(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </div>
</m-table>
```
/*
  组件配置属性说明：
  `tableHeader`  //表格字段的配置 例：[{key: '字段1', prop: '字段1', name: '字段1中文名', ... }]
  `dataList`     //表格数据
  `tableHeight`  //表格高度      默认高度 window.innnerHeight - 250
  `hasSelection` //是否带复选框  默认true
  `hasIndex`     //是否带序号    默认true

  组件绑定方法：
  updateDataListSelections()  获取表格复选框勾选的值

  组件-配置自定义列(详细看例子)：
  `<div slot="(表格字段prop)"></div>`
  组件-配置操作列(详细看例子)：
  `<div slot="handleColumn"></div>`
*/


`弹框组件`
>文件位置：src/components/dialog-box.vue
1. 在需要引用的vue文件导入，并注册
2. 组件使用：
```
<dialog-box ref="dialogBox" dialogTop="弹框距离浏览器顶部位置" dialogTitle='弹框标题'>
  <div slot="formContent">
    //弹框内容
  </div>
  <div slot="formFooter">
    //弹框底部 - 操作： 关闭 取消 确定
    <el-button @click="$refs.dialogBox.visible = false">关闭</el-button>
  </div>
</dialog-box>

```


`带问号图标的提示组件`
>文件位置：src/components/upload-dialog.vue

1. 在需要引用的vue文件导入，并注册
2. 使用方法：
```
表单使用（带表单标签名）：
<label slot="label">
  <tips-component :tipsObj="{'labelName':'标签名', 'tipsContent':'提示内容'}"></tips-component>
</label>

普通场景使用：
<tips-component :tipsObj="{'tipsContent':'提示内容'}"></tips-component>
```

`代码编辑器组件`
>文件位置：src/components/codemirror.vue
1. 在需要引用的vue文件导入，并注册
2. 使用示例：
```
  <codemirror :codeContent="codeContent" @changeCodeContent="changeCodeContent" :tblColsMap="tblColsMap"></codemirror>
```
/* 
  `codeContent`        回显 编辑器的数据
  `tblColsMap`         编辑器代码提示
  `changeCodeContent`  方法 把在编辑器组件编辑的内容传递给父组件，由于没有双向绑定，所以需要调用方法手动赋值
*/


`上传文件弹框组件`
>文件位置：src/components/upload-dialog.vue

1. 在需要引用的vue文件导入，并注册
2. 组件使用：
```
<upload-dialog v-if="uploadVisible" ref="uploadDialog" dialogName="上传文件" :deleteTemplate="true" @refreshDataList="getDataList"></upload-dialog>
```

3. 方法调用：
```
this.uploadVisible = true;
this.$nextTick(() => {
  this.$refs.uploadDialog.init(this.templateExportURL,this.importURL);
})
```
/*
  `templateExportURL`: ''  //模板文件下载地址（不需要下载模板的时候，要传空字符串占位，同时调用组件需要配置:deleteTemplate="true"）
  `deleteTemplate`         //是否显示模板下载 默认true显示
  `importURL`: ''          //上传文件地址
*/


## 打包 & 发布
> 构建生成的资源文件保存在/dist目录下，可通过config/index.js目录文件修改相关配置信息

```
# 构建生产环境(默认)
npm run build

## 常见问题
> `开发时，如何连接后台项目api接口？`

```
修改/static/config/index.js目录文件中 window.SITE_CONFIG['baseUrl'] = '本地api接口请求地址';
```
> `开发时，如何解决跨域？`

```
1. 修改vue.config.js文件中proxyTable对象target: '代理api接口请求地址'
3. 重启本地服务
```

> `构建生成后，发布需要上传哪些文件？`

```
/dist目录下：2005060916（静态资源，20年05月06日09时16分）、config（配置文件）、favicon.icon(标签栏icon)、index.html
```

> `gojs去水印方法`

```
npm install gojs -S 安装依赖后
1、找到文件 node_module/gojs/release/go.js
2、打开文件，搜索字符串：7eba17a4ca3b1a8346
  a.ir=b.W[Ra("7eba17a4ca3b1a8346")][Ra("78a118b7")](b.W,ok,4,4); 替换为 a.ir=function(){return true;};

```