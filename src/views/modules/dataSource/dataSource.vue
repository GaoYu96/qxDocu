
<template>
<div>
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList('search')"
      @submit.native.prevent
      style="padding:15px;"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.searchCtx"
          placeholder="请输入"
          class="selectCtx"
        >
           <i slot="prefix" class="el-input__icon el-icon-search"></i>
        
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('','search')" type="primary">查 询</el-button>
  
          <el-button @click="seniorSearch()" class="seniorClass" type="primary">
          高级查询
          <i :class="['fa fa-lg', seniorSearchVisible ? 'fa-caret-up':'fa-caret-down']"></i>
        </el-button>
        
     
        <el-button type="primary" @click="addOrUpdateHandle()">新 增</el-button> 
        <!-- <el-button  type="primary" @click="deleteHandle('','ID')"  style="margin-left:10px;">批量删除</el-button> -->
      </el-form-item>
    </el-form>
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <div class="seniorDiv" v-show="seniorSearchVisible">
      <senior-search ref="seniorSearch" @getSeniorData="getSeniorData"></senior-search>                     
    </div>
    <div class="mainTable">
      
    
      <m-table
        ref="multipleTable"
        :tableHeader="tableHeader"
        :tableData="dataList"    
        :hasIndex="true"
        :hasSelection="true"
        :showPage="true"
        :pageConfig="pageConfig"
          @sizeChangeHandle="sizeChangeHandle"
        @currentChangeHandle="currentChangeHandle"
        @updateDataListSelections="updateDataListSelections1"
        class="tableClass"
      >
           <div slot="handleColumn">
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="250"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="testConn(scope.row)">测试连接</el-button>
              <el-button type="text" size="small" @click="getUnSyncTables(scope.row)">同步表结构</el-button>
              <!-- <el-button type="text" size="small" @click.stop="deleteHandle(scope.row.ID)">删除</el-button> -->
              
            </template>
          </el-table-column>
        </div>
           </m-table>
            <el-dialog
    title="同步表结构"
    :close-on-click-modal="false"
    :visible.sync="syncVisible"
    class="formDialog"
    width="50%"
  >
   <!-- <el-form
      :inline="true"
      :model="dataForm"
   
      @submit.native.prevent
      style="padding:5px;"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.searchCtx"
          placeholder="表名"

        >
        </el-input>
      </el-form-item>
       <el-form-item>
        <el-input
          v-model="dataForm.searchCtx"
          placeholder="表描述"

        >
        </el-input>
      </el-form-item>
      <el-form-item>
         <el-select v-model="dataForm.address" placeholder="请选择类型">
          <el-option
            v-for="itm in typeOption"
            :key="itm.value"
            :label="itm.label"
            :value="itm.value"
          ></el-option>
        </el-select>
       <el-button @click="getDataList('search')" type="primary">搜索</el-button>
      </el-form-item>
    </el-form> -->
      <m-table
        ref="multipleTable"
        :tableHeader="otherHeader"
        :tableData="syncTables"      
        :hasIndex="true"
        :hasSelection="true"
        :showPage="true"
        :pageConfig="pageConfig1"
         @sizeChangeHandle="sizeChangeHandle"
        @currentChangeHandle="currentChangeHandle"
          @updateDataListSelections="updateDataListSelections"
      >
         
           </m-table>
 
    <span slot="footer" class="dialog-footer">
      <el-button @click="syncVisible = false">取消</el-button>
      <el-button type="primary" @click="syncTablesFunc()">确定</el-button>
    </span>
  </el-dialog>
    </div>
</div>
</template>

<script>
import MTable from '@/components/table.vue'
import baseC from "@/components/baseDataOrMethods"
import SerionSearch from '@/components/senior-search'
import AddOrUpdate from "./addForm";
import SyncTables from './syncTables'
export default {
    name:'dataSource',
     extends: baseC,
data() {
return {
  syncVisible:false,
  listURL:'/dataSource/getDataSourceList',
  
  deleteURL:'',
   pageConfig: {
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0
      },
         pageConfig1: {
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0
      },
    tableHeader: [
        {
          key: "ID",
          prop: "ID",
          label: "ID",
          width: "100",
          fixed: true,
          sortable: false
        },
        {
          key: "NAME",
          prop: "NAME",
          label: "数据源名称",
          width: "100",
          fixed: false,
          sortable: false,
          slot: false
        },
        {
          key: "TYPE",
          prop: "TYPE",
          label: "数据源类型",
          width: "100",
          fixed: false,
          sortable: false
        },
      
        {
          key: "CONN_URL",
          prop: "CONN_URL",
          label: "连接URL",
          width: "",
          fixed: false,
          sortable: false
        },

         {
          key: "DESC",
          prop: "DESC",
          label: "数据源描述",
          width: "100",
          fixed: false,
          sortable: false
        },

      ],
       otherHeader: [
        {
          key: "name",
          prop: "name",
          label: "表名称",
          width: "180",
          fixed: true,
          sortable: false
        },
        {
          key: "type",
          prop: "type",
          label: "类型",
          width: "150",
          fixed: false,
          sortable: false,
          slot: false
        },
        {
          key: "desc",
          prop: "desc",
          label: "表描述",
          width: "",
          fixed: false,
          sortable: false
        }],
            typeOption:[
        {label:'多值显示',value:'multip'},
         {label:'列表显示',value:'list'},
          {label:'标签显示',value:'tag'},
           {label:'图片轮播',value:'round'},
            {label:'档案访问记录',value:'record'},
             {label:'轨迹图',value:'track'},
              
      ],
      nameParam:{
        tableNamesStr:''
      },
      syncParams:{
        dsId:'',
        page:1,
        size:10
      },
      syncTables:[],
      chooseSync:[],
      tableEle:{},

}
},
components:{
    MTable,
  AddOrUpdate,
    SerionSearch,
    SyncTables
},

mounted() {

},
methods:{
  updateDataListSelections1(val){
     console.log(val,"val");
  },
  updateDataListSelections(val){
    this.chooseSync=[];
   for(var i=0;i<val.length;i++){
     this.chooseSync.push(val[i].name)
   }

  },


  syncTablesFunc(){

let val=this.tableEle
    this.nameParam.tableNamesStr=this.chooseSync.join(',')
         this.$http({
          url: this.$http.adornUrl('/meta/datasource/syncTables'),
          method: 'POST',
          params: this.nameParam,
          data: this.$http.adornData({
            'connConf':val.CONN_CONF,
            'connPasswd': val.CONN_PASSWD,
            'connUrl': val.CONN_URL,
             'connUser': val.CONN_USER,
              'delSts': val.DEL_STS,
               'desc': val.DESC,
                'name': val.NAME,
                'type':val.TYPE,
                "id":val.ID
          })
        }).then(({data}) => {
          
console.log(data);

        }).catch(({data})=>{
          
        })
        
  },
  getUnSyncTables(val){
          this.tableEle=val
       this.syncParams.dsId=val.ID
         this.$http({
          url: this.$http.adornUrl('/meta/datasource/listUnSyncTables'),
          method: 'POST',
          params: this.syncParams,
          
        }).then(({data}) => {
          // console.log(data);
       this.syncTables=data.data.list     
         this.syncVisible=true;
        }).catch(({data})=>{
          
        })
  },
testConn(val){

   this.$http({
          url: this.$http.adornUrl('/dataSource/testConnect'),
          method: 'POST',
          data: this.$http.adornData({
            'connConf':val.CONN_CONF,
            'connPasswd': val.CONN_PASSWD,
            'connUrl': val.CONN_URL,
             'connUser': val.CONN_USER,
              'delSts': val.DEL_STS,
               'desc': val.DESC,
                'name': val.NAME,
                'type':val.TYPE,
                "id":val.ID
          })
        }).then(({data}) => {
          // this.dataListHandle(data)
          console.log(data);
           if (data.msg === "连接成功") {
        this.$message({
          message: "连接成功",
          type: "success",
          duration: 1500
        })
           }
        }).catch(({data})=>{
          
        })
}
},

}
</script>
<style scoped>
.seniorClass{
    margin-right: 10px;
}

</style>