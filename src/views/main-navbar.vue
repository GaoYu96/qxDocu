<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="site-navbar__brand-lg" href="javascript:;"> {{menuTitle}}</a>
        <a class="site-navbar__brand-mini" href="javascript:;">{{minTitle}}</a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFoldHandle">
          <i class="fa fa-navicon" style="color:#909399"></i>
        </el-menu-item>
      </el-menu>
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom" trigger="click">
            <span class="el-dropdown-link">
              <img src="~@/assets/img/headlogo.jpg" :alt="userName" style="border: 1px solid #17B3A3;">{{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
  import UpdatePassword from './main-navbar-update-password'
  import { clearLoginInfo } from '@/utils'
  export default {
    data () {
      return {
        updatePassowrdVisible: false,
        menuTitle: window.SITE_CONFIG['menuTitle'],
        minTitle: window.SITE_CONFIG['minTitle']
      }
    },
    components: {
      UpdatePassword
    },
    computed: {
      navbarLayoutType: {
        get () { return this.$store.state.navbarLayoutType }
      },
      sidebarFold: {
        get () { return this.$store.state.sidebarFold },
        set (val) { this.$store.commit('updateSidebarFold', val) }
      },
      mainTabs: {
        get () { return this.$store.state.mainTabs },
        set (val) { this.$store.commit('updateMainTabs', val) }
      },
      userName: {
        get () { return this.$store.state.userName },
        set (val) { this.$store.commit('updateName', val) }
      },
      userId: {
        get () { return this.$store.state.userId },
        set (val) { this.$store.commit('updateId', val) }
      }
    },
    mounted(){
      this.userName = sessionStorage.getItem('userName')
      this.userId = sessionStorage.getItem('userId')
      
    },
    methods: {
      sidebarFoldHandle(){
        this.sidebarFold = !this.sidebarFold
      },
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init({account: this.$store.state.userName, id: this.$store.state.userId})
        })
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {         
          clearLoginInfo()
          this.$router.push({ name: 'login' })
        }).catch(() => {})
      }
    }
  }
</script>
