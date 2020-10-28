
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
        <el-button @click="getDataList('search')" type="primary">查 询</el-button> </el-form-item>
    </el-form>
    <div class="mainTable">
       
    
      <m-table
        ref="multipleTable"
        :tableHeader="tableHeader"
        :tableData="dataList"
        :hasIndex="true"
        :showPage="true"
         :pageConfig="pageConfig"
          @sizeChangeHandle="sizeChangeHandle"
          @currentChangeHandle="currentChangeHandle"
        :hasSelection="true"
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
             
              <el-button type="text" size="small" @click="showDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </div>
           </m-table>
           <el-dialog
  title="详情"
  :visible.sync="dialogVisible"
  width="40%"
  >
  <div>
    <table border="1"  cellspacing="0" cellpadding="0">
     
  <tr v-for="i in list" :key=i.label>
    <td width="10%" style="text-align:center">{{i.label}}</td>
    <td width="20%" style="text-align:center">{{i.labelVal}}</td>
    <td width="10%" style="text-align:center">{{i.name}}</td>
    <td width="20%" style="text-align:center">{{i.nameVal}}</td>
   
  </tr>
  
</table>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>

    </div>
</div>
</template>

<script>
import MTable from '@/components/table.vue'
import baseC from "@/components/baseDataOrMethods"
import SerionSearch from '@/components/senior-search'
export default {
    name:'requestDaily',
     extends: baseC,
data() {
return {
  listURL:'/sysoperlog/list',
      pageConfig:{
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
      },

  list:[
    {label:'流水号',labelVal:'',name:'请求角色',nameVal:''},
    {label:'单位代码',labelVal:'',name:'单位名称',nameVal:''},
    {label:'用户ID',labelVal:'',name:'用户名',nameVal:''},
    {label:'终端标识',labelVal:'',name:'功能名称',nameVal:''},
    {label:'请求值',labelVal:'',name:'响应状态码',nameVal:''},
    {label:'请求时间',labelVal:'',name:'请求耗时',nameVal:''},
    {label:'相应消息',labelVal:'',name:'',nameVal:''},
  ],
  dialogVisible:false,
    tableHeader: [
        {
          key: "ID",
          prop: "ID",
          label: "用户Id",
          width: "100",
          fixed: true,
          sortable: false
        },
        {
          key: "userName",
          prop: "userName",
          label: "用户名",
          width: "100",
          fixed: false,
          sortable: false,
          slot: false
        },
        {
          key: "compname",
          prop: "compname",
          label: "单位名称",
          width: "100",
          fixed: false,
          sortable: false
        },
        {
          key: "mark",
          prop: "mark",
          label: "终端标识",
          width: "130",
          fixed: false,
          sortable: false
        },
        {
          key: "role",
          prop: "role",
          label: "请求角色",
          width: "",
          fixed: false,
          sortable: false
        },
        {
          key: "template",
          prop: "template",
          label: "请求模板",
          width: "100",
          fixed: false,
          sortable: false
        },
         {
          key: "operParam",
          prop: "operParam",
          label: "请求参数",
          width: "100",
          fixed: false,
          sortable: false
        },
         {
          key: "status",
          prop: "status",
          label: "请求状态码",
          width: "100",
          fixed: false,
          sortable: false
        },
       
         
      ],
}
},
components:{
    MTable,
  
    SerionSearch
},

mounted() {

},
methods:{
showDetail(val){

       console.log(val,"详情");
       this.dialogVisible=true;
       this.list[0].labelVal=val.operId
        this.list[0].nameVal=''
         this.list[1].labelVal=''
       this.list[1].nameVal=''
        this.list[2].labelVal=''
         this.list[2].nameVal=''
          this.list[3].labelVal=val.operIp
         this.list[3].nameVal=val.operName
          this.list[4].labelVal=val.operParam
         this.list[4].nameVal=val.status
          this.list[5].labelVal=val.operTime
         this.list[5].nameVal=val.time
          this.list[6].labelVal=''
         this.list[6].nameVal=''

}
}
}
</script>
<style scoped>


</style>