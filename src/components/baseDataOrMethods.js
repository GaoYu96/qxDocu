
import SeniorSearch from '@/components/senior-search'
import encrypt from '@/utils/encrypt'
const baseDataOrMethods = {
  data () {
    return {
      tableHeight: window.innerHeight - 250,
      dataForm: {
        searchCtx: ''
      },
      pageConfig:{
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
      },
      pageConfig1:{
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      addOrUpdateVisibleResource:false,
      updateDiaVisible:false,
      ExamineShow:false,
      seniorSearchVisible: false,
      seniorParams: {},
      listURL: '',
      deleteURL: '',
      activatedExtend: true,
      refreshTimeChecked: false,
      refreshTime: 10,
      refreshTimer: null,
      selectOperate: false,
      baseURL: process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi' : window.SITE_CONFIG['baseUrl'],
      showTable: false,
      testURL:"/meta/metatable/inTablelist",
      seniorURL:"",
    }
  },
  components: {
    SeniorSearch
  },
  watch: {
    refreshTime(oldval, newval){ //数值改变重试设置定时器时间
      this.refreshFun()
    }
  },
  activated () {
    this.showTable = true
    if(this.activatedExtend){
      if(this.seniorParam){
        this.getDataList('search',this.seniorParam)
      }else{
        this.getDataList()
      }
    }
    if(this.refreshTimeChecked){
      this.refreshFun()
    }
    document.addEventListener('click', this.hiddenExportList)
  },
  deactivated(){
    this.showTable = false      
    this.clearRefreshTime()
    document.removeEventListener('click', this.hiddenExportList)
  },
  destroyed() {
    this.showTable = null
    document.removeEventListener('click', this.hiddenExportList)
  },
  methods: {

     // 定时刷新
    refreshFun(){
      if(this.refreshTimeChecked){
        this.clearRefreshTime()
        this.refreshTimerHandlle();
      }else{
        this.clearRefreshTime()
      }
    },
    refreshTimerHandlle(){
      this.refreshTimer = setInterval(()=>{
        this.getDataList()
      }, this.refreshTime*1000)
    },
    // 清除刷新定时器
    clearRefreshTime(){
      window.clearInterval(this.refreshTimer)
    },
    
    // 获取数据列表
    getDataList (_search,seniorParam) {

      if(_search){
        this.pageIndex = 1;
      }
      this.dataListLoading = true
      let that = this;
      
      if(seniorParam || this.seniorParams && this.seniorParams.sql){ //高级搜索
        this.$http({
          url: this.$http.adornUrl(that.listURL),
          method: 'POST',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'searchCtx': this.dataForm.searchCtx,
            'seniorSql': seniorParam?seniorParam.sql:encrypt.jiami(this.seniorParams.sql),
            'seniorParam': seniorParam?seniorParam.params:encrypt.jiami(this.seniorParams.params),
            'encrypt': true
          })
        }).then(({data}) => {
          this.dataListHandle(data)
        }).catch(({data})=>{
          this.dataListLoading = false
        })
      }else{ //普通搜索
        this.$http({
          url: this.$http.adornUrl(that.listURL),
          method: 'POST',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'searchCtx': this.dataForm.searchCtx
          })
        }).then(({data}) => {
          
          this.dataListHandle(data)
         
        }).catch(({data})=>{
          this.dataListLoading = false
        })
      }
    },


    getSeniorDataList (URL,_search,seniorParam) {
        //  console.log(_search,seniorParam);
      if(_search){
        this.pageIndex = 1;
      }
      this.dataListLoading = true
      let that = this;
      that.seniorURL=URL
   console.log(that.seniorURL,"that.seniorURL");
    
      if(seniorParam || this.seniorParams && this.seniorParams.sql){ //高级搜索
        this.$http({
          url: this.$http.adornUrl(that.seniorURL),
          method: 'POST',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'searchCtx': this.dataForm.searchCtx,
            'seniorSql': seniorParam?seniorParam.sql:encrypt.jiami(this.seniorParams.sql),
            'seniorParam': seniorParam?seniorParam.params:encrypt.jiami(this.seniorParams.params),
            'encrypt': true
          })
        }).then(({data}) => {
          this.dataListHandle(data)
        }).catch(({data})=>{
          this.dataListLoading = false
        })
      }else{ //普通搜索
        this.$http({
          url: this.$http.adornUrl(that.seniorURL),
          method: 'POST',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'searchCtx': this.dataForm.searchCtx
          })
        }).then(({data}) => {
          
          this.dataListHandle(data)
         
        }).catch(({data})=>{
          this.dataListLoading = false
        })
      }
    },



    dataListHandle(data){
     
      if (data && data.code === 0) {
        this.dataList = data.page.list
        this.pageConfig.totalCount=data.page.totalCount
        // this.totalPage = data.page.totalCount
      } else {
        this.dataList = []
        this.pageConfig.totalCount = 0
      }
      this.dataListLoading = false
    },
    // 每页数
    sizeChangeHandle (val) {
      console.log(val);
      this.pageSize = val
      this.pageIndex = 1
    
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      console.log(val);
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      console.log(this.dataListSelections,"dataListSelections")
    },
    // 点击行选中
    handleRowClick(row, column,event){
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    updateDataListSelections(val){
      this.dataListSelections = val

    },
    // 新增 / 修改     
    addOrUpdateHandle (val) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(val)
      })
    },

    addOrUpdateResource (val) {
     
      // this.$store.commit('setTblType',"normal")
      // this.$store.commit('setMoreSele',false)
      // this.$store.commit('setNextPage',false)
      // console.log(this.$store.state.tblType,this.$store.state.moreSele,this.$store.state.nextPage);
        this.addOrUpdateVisibleResource = true
        this.$nextTick(() => {
          this.$refs.addOrUpdateResource.init(val)
        })
      },


    updateDiaHandle(val){
      console.log(val,"val");
      this.updateDiaVisible = true
      this.$nextTick(() => {
        this.$refs.updateDialog.init(val)
      })
    },
  
    // 删除
    deleteHandle (id, _moreId) {
      console.log(id);
      let that = this;
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item[_moreId]
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleFun(ids);
      })
    },
    // 删除请求方式
    deleFun(_ids){
      this.$http({
        url: this.$http.adornUrl(this.deleteURL),
        method: 'post',
        data: this.$http.adornData(_ids, false)
      }).then(({data}) => {
        if (data && data.code === 0) {
          if(!((this.totalPage-1)%this.pageSize)){
            this.pageIndex--;
            if(!this.pageIndex){ this.pageIndex=1 }
          }
          if(this.seniorParams.sql){ //高级查询
            this.getDataList('',{sql: encrypt.jiami(this.seniorParams.sql), params: encrypt.jiami(this.seniorParams.params)});
          }else{
            this.getDataList()
          }
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 高级查询
    seniorSearch(){
      this.seniorSearchVisible = !this.seniorSearchVisible;
      if(!this.seniorSearchVisible){
        this.tableHeight = window.innerHeight - 250
      }
      if(this.seniorSearchVisible){
        this.tableHeight = window.innerHeight - 400
        this.$nextTick(() => {
          this.$refs.seniorSearch.init(this.tableHeader,this.listURL);
        })
      }
    },
    // 触发高级查询
    getSeniorData(jiaObj,jieObj){ //jiaObj 是加密的搜索条件，jieObj是没加密的搜索条件 
     
      this.seniorParams = jieObj  
      this.getDataList('search',jiaObj);
    },

    getSpaiaclSeniorData(URL,jiaObj,jieObj){ //jiaObj 是加密的搜索条件，jieObj是没加密的搜索条件 
      this.seniorParams = jieObj  
      this.getSeniorDataList(URL.URL,'search',jiaObj);
   
      
    },
    // 点击其他地方，导入导出下拉框收起
    hiddenExportList(e){
      if(document.querySelector('.importOrExport')){
        if (!document.querySelector('.importOrExport').contains(e.target)) {
          this.selectOperate = false
        }
      }
    },
    showLiBox(){
      this.selectOperate = !this.selectOperate
    },
    getRowClass({ row, rowIndex}) {
      // 表格头部样式
      return "font-size: 12px; text-align:center; background-color:#eef1f7; padding: 4px 0px;";
    },
    getAllRow(){
      // 设置行样式
      return " font-size: 12px; ";
    },
    getCell(){
      // 单元格样式
      return 'text-align:center; padding: 0px; '
    }
  }
}

export default baseDataOrMethods


