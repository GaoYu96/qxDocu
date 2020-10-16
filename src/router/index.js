import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

document.title = window.SITE_CONFIG['platformTitle']
const routes = [
  {
    path: '/',
    name: 'main',
    component: () => import('../views/main.vue'),
    redirect: {
      name: 'dataSource'
    },
    meta: {
      requireAuth: false,
      name: '主入口整体布局'
    },
    children: [
      {
        path: 'dataSource',
        name: 'dataSource',
        component: () => import('../views/modules/dataSource/dataSource.vue'), 
        meta: {
          isTab: true,
          requireAuth: true,
          title: '数据来源管理'
        }
      },
      {
        path: 'resource',
        name: 'resource',
        component: () => import('../views/modules/resource/resource.vue'), 
        meta: {
          isTab: true,
          requireAuth: true,
          title: '资源表管理'
        }
      },
      {
        path: 'sourceForm',
        name: 'sourceForm',
        component: () => import('../views/modules/sourceGrade/sourceForm.vue'), 
        meta: {
          isTab: true,
          requireAuth: true,
          title: '资源表分级'
        }
      },
      {
        path: 'dataColumn',
        name: 'dataColumn',
        component: () => import('../views/modules/sourceGrade/dataColumn.vue'), 
        meta: {
          isTab: true,
          requireAuth: true,
          title: '数据列分级'
        }
      },
      {
        path: 'redList',
        name: 'redList',
        component: () => import('../views/modules/sourceGrade/redList.vue'), 
        meta: {
          isTab: true,
          requireAuth: true,
          title: '红名单分级'
        }
      },
      {
        path: 'componentMana',
        name: 'componentMana',
        component: () => import('../views/modules/fileMana/componentMana.vue'), 
        meta: {
          isTab: true,
          requireAuth: true,
          title: '部件管理'
        }
      },
      {
        path: 'templateMana',
        name: 'templateMana',
        component: () => import('../views/modules/fileMana/templateMana.vue'), 
        meta: {
          isTab: true,
          requireAuth: true,
          title: '模板管理'
        }
      },
      {
        path: 'outport',
        name: 'outport',
        component: () => import('../views/modules/fileMana/outport.vue'), 
        meta: {
          isTab: true,
          requireAuth: true,
          title: '模板'
        }
      },
      {
        path: 'requestDaily',
        name: 'requestDaily',
        component: () => import('../views/modules/requestDaily/requestDaily.vue'), 
        meta: {
          isTab: true,
          requireAuth: true,
          title: '请求日志'
        }
      },
      
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/common/404.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/common/login.vue'),
  },
  {
    path: '/tempPreview',
    name: 'tempPreview',
    component: () => import('../views/modules/fileMana/tempPreview.vue'),
  },
 
    
  
]

const router = new VueRouter({
  mode: 'hash',
  // base: process.env.BASE_URL,
  routes
})
router.addRoutes([
  { path: '*', redirect: { name: '404' } }
])
export default router