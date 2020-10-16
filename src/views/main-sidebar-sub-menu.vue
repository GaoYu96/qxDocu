<template>
  <el-submenu 
    v-if="menu.list && menu.list.length>0"
    :index="menu.id+''"
    :popper-class="'site-sidebar--' + sidebarLayoutSkin + '-popper'">
    <template slot="title"> <i :class="['fa', menu.icon ]" style="color: #dfe5ec;"></i> {{menu.name}}</template>
    <sub-menu :menu="item" v-for="item in menu.list" :key="item.id" :dynamicMenuRoutes="dynamicMenuRoutes"></sub-menu>
    <!-- <el-menu-item v-for="item in menu.list" :key="item.id" :index="item.id+''">{{item.name}}</el-menu-item> -->
  </el-submenu>
  <el-menu-item :index="menu.id+''" v-else @click="gotoRouterHandle(menu)">
    <i :class="['fa', menu.icon ]" style="color: #dfe5ec;"></i> <span>{{menu.name}}</span>
  </el-menu-item>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
export default {
  name: 'sub-menu',
  data(){
    return{

    }
  },
  components:{
    SubMenu
  },
  props: {
    menu: {
      type: Object,
      required: true
    },
    dynamicMenuRoutes: {
      type: Array,
      required: true
    }
  },
  computed:{
    sidebarLayoutSkin: {
      get () { return this.$store.state.sidebarLayoutSkin }
    }
  },
  methods:{
    gotoRouterHandle(_menu){
      this.$router.push({ name: _menu.id })
      return
      // this.$router.push({ name: _menu.name })
      var route = this.dynamicMenuRoutes.filter(item => item.meta.id === _menu.id)
      if (route.length >= 1) {
        this.$router.push({ name: route[0].name })
      }
    }
  }
}
</script>
