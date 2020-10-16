
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

        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary">查 询</el-button>
  
       
     
        <el-button type="primary" @click="addDiaHandle()">添加数据列</el-button> 
      
      </el-form-item>
    </el-form>
    <div class="mainTable">
       
    
      <m-table
        ref="multipleTable"
        :tableHeader="tableHeader"
        :tableData="dataList"
        :tableHeight="tableHeight"
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
              
              <el-button type="text" size="small" @click.stop="deleteHandle(scope.row.colId)">删除</el-button>
            </template>
          </el-table-column>
        </div>
           </m-table>
           <dataColumnAdd v-if="addVisible" ref="dataColumnAdd"></dataColumnAdd>
    </div>
</div>
</template>

<script>
import MTable from '@/components/table.vue'
import baseC from "@/components/baseDataOrMethods"
import SerionSearch from '@/components/senior-search'
import dataColumnAdd from './dataColumn-add'
export default {
    name:'dataColumn',
     extends: baseC,
data() {
return {
  addVisible:false,
   pageConfig:{
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
      },
  listURL:"/resourceColLevel/list",
  
  tableHeight:window.window.innerHeight-226,
    tableHeader: [
        {
          key: "colName",
          prop: "colName",
          label: "列名",
          width: "180",
          fixed: true,
          sortable: false
        },
        {
          key: "tblDesc",
          prop: "tblDesc",
          label: "所属表",
          width: "",
          fixed: false,
          sortable: false,
          slot: false
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
          key: "name",
          prop: "name",
          label: "数据源",
          width: "",
          fixed: false,
          sortable: false
        },
         
         {
          key: "level",
          prop: "level",
          label: "敏感级别",
          width: "180",
          fixed: false,
          sortable: false
        },
      ],
      delId:{
        colId:'',
        tblId:'',
      }
}
},
components:{
    MTable,
  dataColumnAdd,
    SerionSearch
},

mounted() {

},
methods:{
 addDiaHandle(){
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.dataColumnAdd.init()
      })
    },
          dataListHandle(data){
     
      if (data && data.code === 0) { 
        this.dataList = data.page.records
        // console.log(this.dataList,"this.dataList");
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
    deleFun(colId){
      this.delId.colId=colId
      this.$http({
        url: this.$http.adornUrl("/resourceColLevel/delete"),
        method: 'post',
        params: this.delId
      }).then(({data}) => {
        if (data && data.code === 0) {
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
}
}
</script>
<style scoped>
.mainTable{
    width:100%
}

</style>