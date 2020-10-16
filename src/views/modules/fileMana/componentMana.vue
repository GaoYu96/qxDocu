
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
        <el-button @click="getDataList('search')" type="primary">查 询</el-button>
  
       
       <el-popover
    placement="bottom"
    
    width="200"
    trigger="click"
    >

     <el-button type="primary" style="margin:10px;"  @click="addOrUpdateHandle()">添加部件</el-button> 
      <el-button type="primary" style="margin:10px;" @click="showComCopy()">复制部件</el-button> 
    <el-button type="primary" slot="reference" style="margin-left:10px;">添加</el-button> 
  </el-popover>
       
        <el-button  type="primary" @click="deleteHandle('','partsId')" :disabled="this.dataListSelections.length <= 0" style="margin-left:10px;">批量删除</el-button>
      </el-form-item>
    </el-form>

    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <comCopy v-if="comCopyVisible" ref="comCopy"></comCopy>
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
              <el-button type="text" size="small" @click="isStop(scope.row)">停用</el-button>
               <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click.stop="deleteHandle(scope.row.partsId)">删除</el-button>
            </template>
          </el-table-column>
        </div>
           </m-table>
            
    </div>
</div>
</template>

<script>
import MTable from '@/components/table.vue'
import baseC from "@/components/baseDataOrMethods"
import SerionSearch from '@/components/senior-search'
import AddOrUpdate  from './com-add'
import comCopy from './comCopy'
export default {
    name:'componentMana',
     extends: baseC,
data() {
return {
listURL:'/parts/list',
 deleteURL: "/parts/delete",
    pageConfig:{
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
      },
    tableHeader: [
      
        {
          key: "partsDesc",
          prop: "partsDesc",
          label: "部件名称",
          width: "",
          fixed: false,
          sortable: false,
          slot: false
        },
         {
          key: "partsType",
          prop: "partsType",
          label: "类型",
          width: "180",
          fixed: false,
          sortable: false,
          slot: false
        },
         {
          key: "isTitle",
          prop: "isTitle",
          label: "显示标题",
          width: "180",
          fixed: false,
          sortable: false,
          slot: false
        },
       {
          key: "isFold",
          prop: "isFold",
          label: "可折叠",
          width: "180",
          fixed: false,
          sortable: false
        },
          {
          key: "isDelete",
          prop: "isDelete",
          label: "已删除",
          width: "180",
          fixed: false,
          sortable: false
        },
    
        {
          key: "status",
          prop: "status",
          label: "使用状态",
          width: "180",
          fixed: false,
          sortable: false
        },     
      ],
      comCopyVisible:false,
}
},
components:{
    MTable,
  AddOrUpdate,
    SerionSearch,
    comCopy
},

mounted() {

},
methods:{
showComCopy(){
  this.comCopyVisible=true
  this.$nextTick(()=>{
    this.$refs.comCopy.init()
  })
        
},

isStop(val){                //0停用    1启用  
  // console.log(val.partsId);
  this.$http({
          url: this.$http.adornUrl('/daparts/stop/'+val.partsId),
          method: 'get',         
        }).then(({data}) => {
        if(data.msg==='success'&&data.code===0){
              this.$message.success("操作成功")
              this.$emit('refreshDataList')
        }
        
        })
},
    dataListHandle(data){
     
      if (data && data.code === 0) { 
        this.dataList = data.page.list
         this.dataList.forEach(item=>{
         item.isTitle=item.isTitle==='1'?'是':'否'
           item.isFold=item.isFold==='1'?'是':'否'
            item.status=item.status==='0'?'停用':'启用'         //isDelete
         item.isDelete=item.isDelete==='0'?'是':'否'
         if(item.partsType==='list'){
           item.partsType='列表显示'
         }
         else if(item.partsType==='multivalue'){
           item.partsType='多值显示'
         }
         else  if(item.partsType==='tag'){
           item.partsType='标签显示'
         }
         else  if(item.partsType==='image'){
           item.partsType='图片轮播'
         }
        })  
          this.pageConfig.totalCount=data.page.totalCount
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