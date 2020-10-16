import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    // 导航条, 布局风格, defalut(默认) / inverse(反向)
    navbarLayoutType: 'default',
    sidebarLayoutSkin: 'dark',
    sidebarFold: false,
    // 主入口标签页
    mainTabs: [],
    mainTabsActiveName: '',
    // 内容是否需要刷新
    contentIsNeedRefresh: false,
    userId: '',
    userName: '',
    tblType: "normal",
    moreSele: false,
    nextPage: false,
    partsId:'',
    seniorPara:false,
    isDele:false,
    rightArr:[],
    leftArr:[],
    previewData:{},

  },
  mutations:{
    setPreviewData(state,val){
      state.previewData=val
    },
    setRightArr(state,val){
      state.rightArr=val
    },
    setLeftArr(state,val){
      state.leftArr=val
    },
    setIsDele(state,val){
       state.isDele=val
    },
    setSeniorPara(state,val){
      state.seniorPara = val
    },
    setPartsId(state,val){
      state.partsId = val
    },
    setTblType(state,val){
      state.tblType = val
    },
    setMoreSele(state,val){
      state.moreSele = val
    },
    setNextPage(state,val){
      state.nextPage = val
    },
    updateId(state, id){
      state.userId = id
    },  
    updateName(state, name){
      state.userName = name
    },
    updateSidebarFold (state, fold) {
      state.sidebarFold = fold
    },
    updateMainTabs (state, tabs) {
      state.mainTabs = tabs
    },
    updateMainTabsActiveName (state, name) {
      state.mainTabsActiveName = name
    },
    updateContentIsNeedRefresh (state, status) {
      state.contentIsNeedRefresh = status
    },
  }
})