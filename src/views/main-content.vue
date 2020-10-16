<template>
  <main class="site-content" :class="{ 'site-content--tabs': $route.meta.isTab }">
    <!-- 主入口标签页 s -->
      <!-- v-if="$route.meta.isTab" -->
    <el-tabs
      v-model="mainTabsActiveName"
      v-if="$route.meta.isTab"
      :closable="true"
      @tab-click="selectedTabHandle"
      @tab-remove="removeTabHandle">
      <el-dropdown class="site-tabs__tools" :show-timeout="0" trigger="click">
        <i class="el-icon-arrow-down el-icon--right"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="tabsCloseCurrentHandle">关闭当前标签页</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseOtherHandle">关闭其它标签页</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseAllHandle">关闭全部标签页</el-dropdown-item>
          <el-dropdown-item @click.native="refresh()">刷新当前标签页</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tab-pane
        v-for="item in mainTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name">
        <el-card >
          <keep-alive>
            <router-view v-if="item.name === mainTabsActiveName" />
          </keep-alive>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!-- 主入口标签页 e -->
    <el-card v-else >
      <keep-alive>
        <!-- <div>这里是哪里</div> -->
        <router-view />
      </keep-alive>
    </el-card>
  </main>
</template>

<script>
import Watermark from '@/utils/watermark'
export default {
  inject: ['refresh'],
  data(){
    return{
    }
  },
  computed:{
    mainTabs: {
      get () { return this.$store.state.mainTabs },
      set (val) { this.$store.commit('updateMainTabs', val) }
    },
    mainTabsActiveName: {
      get () { return this.$store.state.mainTabsActiveName },
      set (val) { this.$store.commit('updateMainTabsActiveName', val) }
    },
  },
  mounted(){
    let date = new Date()
    let month = date.getMonth()+1
    let dateFormatter = date.getFullYear() + '-' + month + '-' + date.getDate() +' '+ date.getHours() + ':' + date.getMinutes()+':'+date.getSeconds()
    Watermark.set(sessionStorage.getItem('userName')+' '+dateFormatter )
  },
  methods:{
    // tabs, 选中tab
    selectedTabHandle (tab) {      
      tab = this.mainTabs.filter(item => item.name === tab.name)
      if (tab.length >= 1) {
        this.$router.push({ name: tab[0].name, query: tab[0].query, params: tab[0].params })
      }
    },
    // tabs, 删除tab
    removeTabHandle (tabName) {
      this.mainTabs = this.mainTabs.filter(item => item.name !== tabName)
      if (this.mainTabs.length >= 1) {
        // 当前选中tab被删除
        if (tabName === this.mainTabsActiveName) {
          var tab = this.mainTabs[this.mainTabs.length - 1]
          this.$router.push({ name: tab.name, query: tab.query, params: tab.params }, () => {
            this.mainTabsActiveName = this.$route.name
          })
        }
      } else {
        this.menuActiveName = ''
        this.$router.push({ name: 'userMana' })
      }
    },
    // tabs, 关闭当前
    tabsCloseCurrentHandle () {
      this.removeTabHandle(this.mainTabsActiveName)
    },
    // tabs, 关闭其它
    tabsCloseOtherHandle () {
      this.mainTabs = this.mainTabs.filter(item => item.name === this.mainTabsActiveName)
    },
    // tabs, 关闭全部
    tabsCloseAllHandle () {
      this.mainTabs = []
      this.menuActiveName = ''
      this.$router.push({ name: 'dataSource' })
    },
    // tabs, 刷新当前
    tabsRefreshCurrentHandle () {
      var tab = this.$route
      this.removeTabHandle(tab.name)
      this.$nextTick(() => {
        this.$router.push({ name: tab.name, query: tab.query, params: tab.params })
      })
    }
  }
}
</script>