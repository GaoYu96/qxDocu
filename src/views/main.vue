<template>
  <div
    class="site-wrapper"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <template v-if="!loading">
      <main-navbar />
      <main-sidebar />
      <div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight + 'px' }">
        <main-content  v-if="!$store.state.contentIsNeedRefresh" />
      </div>
    </template>
  </div>
</template>

<script>
import MainNavbar from './main-navbar'
import MainSidebar from './main-sidebar'
import MainContent from './main-content'
export default {
  name: 'App',
  components: {
    MainNavbar,
    MainSidebar,
    MainContent,
  },
  computed:{
    sidebarFold:{
      get(){ return this.$store.state.sidebarFold }
    }
  },
  provide () {
    return {
      // 刷新
      refresh () {
        this.$store.commit('updateContentIsNeedRefresh', true)
        this.$nextTick(() => {
          this.$store.commit('updateContentIsNeedRefresh', false)
        })
      }
    }
  },
  data(){
    return{
      loading: true,
      documentClientHeight: 600
    }
  },
  mounted(){
    this.loading = false
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
