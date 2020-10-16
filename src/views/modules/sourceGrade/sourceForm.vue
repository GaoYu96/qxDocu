
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
        <el-select
          v-model="dataForm.searchCtx"
          placeholder="请输入"
          clearable
          filterable
         
          class="selectCtx"
        >
           <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('search')" type="primary">查 询</el-button>
  
       
     
        <el-button type="primary" @click="addDiaHandle()">添加资源表</el-button> 
      
      </el-form-item>
    </el-form>
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
        @updateDataListSelections="updateDataListSelections"
       
        class="tableClass"
      >
           <div slot="handleColumn">
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            label="操作"
          >
            <template slot-scope="scope">
              
              <el-button type="text" size="small" @click.stop="deleteHandle(scope.row.tblId)">删除</el-button>
            </template>
          </el-table-column>
        </div>
           </m-table>
           <soureceAdd v-if="addVisible" ref="soureceAdd" @refreshDataList="getDataList"></soureceAdd>
    </div>
</div>
</template>

<script>
import MTable from '@/components/table.vue'
import baseC from "@/components/baseDataOrMethods"
import SerionSearch from '@/components/senior-search'
import SoureceAdd from './source-add'
export default {
    name:'sourceForm',
     extends: baseC,
data() {
return {
  listURL:'/resourceTableLevel/list',
  deleteURL:'/resourceTableLevel/delete',
    addVisible:false,
    pageConfig:{
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
      },
    tableHeader: [
        {
          key: "tblId",
          prop: "tblId",
          label: "表ID",
          width: "100",
          fixed: true,
          sortable: false
        },
        {
          key: "tblName",
          prop: "tblName",
          label: "表名",
          width: "",
          fixed: false,
          sortable: false,
          slot: false
        },
       
       {
          key: "tblDesc",
          prop: "tblDesc",
          label: "数据源",
          width: "",
          fixed: false,
          sortable: false
        },
        {
          key: "tblType",
          prop: "tblType",
          label: "类型",
          width: "150",
          fixed: false,
          sortable: false
        },
         
         {
          key: "level",
          prop: "level",
          label: "敏感级别",
          width: "100",
          fixed: false,
          sortable: false
        },
                
      ],
}
},
components:{
    MTable,
  SoureceAdd,
    SerionSearch
},

mounted() {

},
methods:{
  
  addDiaHandle(){
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.soureceAdd.init()
      })
    },
        dataListHandle(data){
     
      if (data && data.code === 0) { 
        this.dataList = data.page.records
         this.dataList.forEach(item=>{
         if(item.tblType==='1'){
           item.tblType='普通表'
          
         }
         else if(item.tblType==='2'){
            item.tblType='文件表'
            this.isImport=true;
            
         }
         else if(item.tblType==='3'){
            item.tblType='接口表'
       
         }
        if(item.level==='1'){
          item.level='一级'
        }
        else if(item.level==='2'){
          item.level='二级'
        }
        else if(item.level==='3'){
          item.level='三级'
        }

        })
       
  this.pageConfig.totalCount=data.page.total

      } else {
        this.dataList = []
        this.pageConfig.totalCount = 0
      }
      this.dataListLoading = false
    },
}
}
</script>
<style scoped>
.mainTable{
    width:100%
}

</style>