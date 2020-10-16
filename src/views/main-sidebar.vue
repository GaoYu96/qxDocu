<template>
  <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">
    <div class="site-sidebar__inner">
      <el-menu
        class="site-sidebar__menu"
        @close="handleClose" 
        :collapse="sidebarFold"
        :collapseTransition="false">
        <sub-menu :menu="menu" v-for="menu in menuList" :key="menu.id" :dynamicMenuRoutes="dynamicMenuRoutes"></sub-menu>
      </el-menu>  
    </div>
  </aside>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
export default {
  data(){
    return{
      menuList: [
        {name: '数据来源管理', id: 'dataSource', icon: 'fa-telegram'},
        {name: '资源表管理', id: 'resource', icon: 'fa-telegram',
         
        },
        {name: '资源分级管理', id: 'sourceForm', icon: 'fa-telegram',
        list:[
          {name: '资源表分级', id: 'sourceForm', iconClass: 'icon-fangdichandengji'},
          {name: '数据列分级', id: 'dataColumn', iconClass: 'icon-yinhangkaihu'},
          {name: '红名单分级', id: 'redList', iconClass: 'icon-cheliangdengji'},    
        ]
        },
        {name: '档案管理', id: 'fileMana', icon: 'fa-telegram',
         list:[
          {name: '部件管理', id: 'componentMana', iconClass: 'icon-fangdichandengji'},
          {name: '模板管理', id: 'templateMana', iconClass: 'icon-yinhangkaihu'},
          // {name: '模板', id: 'outport', iconClass: 'icon-yinhangkaihu'},
          
        ]},
        {name: '请求日志', id: 'requestDaily', icon: 'fa-telegram'},
       
      ],
      dynamicMenuRoutes: []
    }
  },
  computed:{
    sidebarLayoutSkin: {
      get () { return this.$store.state.sidebarLayoutSkin }
    },
    sidebarFold: {
      get () { return this.$store.state.sidebarFold },
      set (val) { this.$store.commit('updateSidebarFold', val) }
    },
    mainTabs: {
      get () { return this.$store.state.mainTabs },
      set (val) { this.$store.commit('updateMainTabs', val) }
    },
    mainTabsActiveName: {
      get () { return this.$store.state.mainTabsActiveName },
      set (val) { this.$store.commit('updateMainTabsActiveName', val) }
    },
  },
  components:{
    SubMenu
  },
  watch:{
    $route: 'routerHandle'
  },
  created(){
    // this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
    // console.log(this.menuList);
    
    // this.$router.push({name: 'userMana'})
    // this.init()
    this.routerHandle(this.$route)
    //   this.mainTabs = []
    // setTimeout(()=>{
    // },10)
    // this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
  },
  methods:{
    // init(){
    //   this.mainTabs = [{
    //     menuId: 'userName',
    //     name: 'userName',
    //     title: '用户管理',
    //     params: {},
    //     query: {}
    //   }]
    //   console.log(this.mainTabs);
      
    // },
    routerHandle(route){
      // console.log(this.mainTabs);
      
      var tab = this.mainTabs.filter(item=> item.name === route.name )
      
      if(!tab.length){
        if(route.meta.isDynamic){
          route = this.menuList.filter(item => item.name === route.name)[0]
          if(!route){
            return console.error("未能找到标签页")
          }
        }
        tab = {
          menuId: route.meta.menuId || route.name,
          name: route.name,
          title: route.meta.title,
          // type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
          // iframeUrl: route.meta.iframeUrl || '',
          params: route.params,
          query: route.query
        }        
        this.mainTabs = this.mainTabs.concat(tab)    
      } 
      this.mainTabsActiveName = route.name
    },
    handleClose(){

    }
  }
}
</script>