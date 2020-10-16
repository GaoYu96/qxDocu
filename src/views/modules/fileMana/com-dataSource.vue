<!--  -->
<template>
  <div>
    <el-button type="primary" style="margin-bottom:10px;" @click="addResource()">添加资源表</el-button>
    <m-table
      ref="multipleTable"
      :tableHeader="tableHeader"
      :tableData="dataList"
      :hasIndex="true"
      :hasSelection="true"
      class="tableClass"
    >
      <div slot="handleColumn">
        <el-table-column fixed="right" header-align="center" align="center" width="120" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addResource(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click.stop="deleteHandle(scope.row.partsId,scope.row.tblId)">删除</el-button>
          </template>
        </el-table-column>
      </div>
    </m-table>
    <el-dialog title="添加资源表" :visible.sync="dialogVisible" width="50%" :append-to-body="true">
      <div>
        <el-form :model="dataForm"  ref="dataForm" label-width="120px" size="mini">
          <el-row>
            <el-col :span="12">
              <el-form-item label="来源表" prop="resource">
                <el-select
                  v-model="selectId"
                  placeholder="请输入"
                  clearable
                  filterable
                  class="selectCtx"
                  @change="getItemData"
                >
                  <el-option
                    v-for="item in ResourceName"
                    :label="item.name"
                    :value="item"
                    :key="item.id"
                  ></el-option>
                </el-select>
                <el-button type="primary" @click="getColData()">查询</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="展示名" prop="showName">
                <el-input v-model="resourceTblData.showName" placeholder="展示名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="显示顺序" prop="showLine">
                <el-select v-model="resourceTblData.showLine" placeholder="显示顺序">              
                  <el-option
                    v-for="item in chooseYesorNot"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="显示行数" prop="showNo">
             
                <el-select v-model="resourceTblData.showNo" placeholder="显示顺序">              
                  <el-option
                    v-for="item in chooseYesorNot"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="对象id" prop="objId">
                <el-input v-model="resourceTblData.objId" placeholder="对象id"></el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
      </div>
      <div class="datasour">
        <el-button type="primary">移到顶部</el-button>
        <el-button type="primary">上移</el-button>
        <el-button type="primary">下移</el-button>
        <el-button type="primary">移到底部</el-button>
        <m-table
          ref="multipleTable"
          :tableHeader="otherHeader"
          :tableData="ColDataList"
          :selectOne="false"
          :hasIndex="true"
          class="tableClass"
          :showPage="true"
          :pageConfig="pageConfig"
          :hasSelection="true"
          @updateDataListSelections="updateDataListSelections"
        >
          <div slot="handleColumn">
            <el-table-column header-align="center" align="center" width="150" label="列表显示">
              <template slot-scope="scope">
              
                <el-switch v-model="scope.row.listShow" active-text="是" inactive-text="否" @change='changeStatus($event,1)'></el-switch>
                
              </template>
            </el-table-column>
          </div>
          <div slot="handleColumn">
            <el-table-column header-align="center" align="center" width="150" label="详情显示">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.detailShow" active-text="是" inactive-text="否"  @change='changedetailShow($event,2)'></el-switch>
              </template>
            </el-table-column>
          </div>
        </m-table>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="dataFormSubmit"> 确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MTable from "@/components/table.vue";
export default {
  name: "com-dataSource",
  data() {
    return {
      dialogVisible: false,
      dataForm: {
        showName: "",
        order: "",
        row: "",
        objId: ""
      },
      pageConfig: {
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0
      },
      testList: [
        { label: "A", value: "1" },
        { label: "B", value: "2" },
        { label: "C", value: "3" }
      ],
      chooseYesorNot:[
        { label: "是", value: "1" },
        { label: "否", value: "0" },
      ],
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
          key: "showName",
          prop: "showName",
          label: "显示名称",
          width: "150",
          fixed: false,
          sortable: false
        },
        // {
        //   key: "objId",
        //   prop: "objId",
        //   label: "对象ID",
        //   width: "100",
        //   fixed: false,
        //   sortable: false
        // },
        {
          key: "showCols",
          prop: "showCols",
          label: "显示列",
          width: "",
          fixed: false,
          sortable: false
        },
        {
          key: "tblType",
          prop: "tblType",
          label: "类型",
          width: "100",
          fixed: false,
          sortable: false
        }
      ],
      otherHeader: [
        {
          key: "colName",
          prop: "colName",
          label: "列名",
          width: "80",
          fixed: true,
          sortable: false
        },

        {
          key: "colShowName",
          prop: "colShowName",
          label: "显示名称",
          width: "120",
          fixed: false,
          sortable: false
        },
        {
          key: "showType",
          prop: "showType",
          label: "显示类型",
          width: "100",
          fixed: false,
          sortable: false
        },
        {
          key: "showValue",
          prop: "showValue",
          label: "显示类型值",
          width: "100",
          fixed: false,
          sortable: false
        }
      ],
      selectId: "",
      // dataList: [],
      resourceTblData:{
            partsId:'',
             showLine:"1",
              showName:"",
               showNo:"1",
               tblId:''
              
      },
      ColDataList: [
        //   {
        //   "colId": 1,
        //   "tblId": 14,
        //   "colName": "a",
        //   "colDesc": "注释a",
        //   "colType": "STRING",
        //   "listShow": "1",
        //   "detailShow": "1",
        //   "showType": "common",
        //   "showTypeVal": null,
        //   "showNo": 1,
        //   "colShowName": "注释a",
        //   "colCase": null,
        //   "createTime": "2020-09-01 18:36:45",
        //   "updateTime": "2020-09-03 14:19:13"
        // },
      ],
      ResourceName: [],
      updateVal:false,
      colDataListShow: true,
      colDataDetailShow: true,
      testShow: true,
      choosenCol:[],
      addCol:[],
      detailShowNum:0,
      listShowNum:0,
      colPara: {
        page: 1,
        limit: 20,
        tblId: ""
      },
      delId:{
        partsId:'',
        tblId:'',
      }
    };
  },
  components: {
    MTable
  },
props:['dataList'],
  created() {
    this.getResourceName();
    this.listShowNum=0
    this.detailShowNum=0
    this.ColDataList=[]
    this.dataList=[]
    console.log(this.ColDataList,"this.ColDataList");
  },
  activated(){
    this.ColDataList=[]
    this.dataList=[]
    console.log(this.ColDataList,"activated");
  },
  methods: {

clearTbls(){
    //  this.ColDataList=[]
    this.$set(data, 'ColDataList', []);
     console.log(this.ColDataList,"afterClear")
},
changeStatus(val,num){
         this.listShowNum++

      this.colDataListShow=val===true?1:0
},

changedetailShow(val,num){
        this.detailShowNum++
      // console.log(val,num);
      this.colDataDetailShow=val===true?1:0
},

   updateDataListSelections(val){
     this.choosenCol=[]
      this.addCol=[]
    val.map(item=>{
        this.choosenCol.push(item.colName+'('+item.colDesc+')')
        this.addCol.push({
          colId:0,
          colName:item.colName,
            detailShow:item.detailShow===true?1:0,
           listShow:item.listShow===true?1:0,
           partsId:this.$store.state.partsId,
           showName:item.colDesc,
           showNo:this.resourceTblData.showNo,
           showLine:this.resourceTblData.showLine,
           showType:item.showType,
           showTypeVal: "",
           tblId:this.resourceTblData.tblId
        })

     })
        
         
   },
    getResourceName() {
      this.$http({
        url: this.$http.adornUrl("/dataSourceTable/list"),
        method: "POST",
        data: this.$http.adornData({
          limit: 50,
          page: 1,
          searchCtx: ""
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {

          data.page.list.map(item => {
            //  console.log(item.tblName);
            this.ResourceName.push({
              name: item.tblName,
              id: item.tblId,
              desc: item.tblDesc
            });
          });

        } else {
          this.$message.error(data.msg);
        }
      });
    },
    getItemData(val) {
      this.resourceTblData.tblId=val.id
      this.resourceTblData.showName = val.desc;
      console.log(val,this.resourceTblData.tblId,"val");
    },
    getColData(val) {
          // console.log(val,this.resourceTblData.tblId,"val");
      if(val){
        this.colPara.tblId=val
      }
      else{
          this.colPara.tblId = this.resourceTblData.tblId
      }
    // console.log(this.colPara,"this.colPara");
      this.$http({
        url: this.$http.adornUrl("/dataSourceCol/listByTblId"),
        method: "POST",
        params: this.colPara
      }).then(({ data }) => {
        if (data && data.code === 0) {
          //  this.ColDataList=data.page.list
          //  this.pageConfig.totalCount=data.page.totalCount
          this.dataListHandle(data);
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    addResource(val) {

      this.dialogVisible = true;
      this.updateVal=false;
      if(val){
        // console.log(val,"val");
        this.updateVal=true
        this.resourceTblData={
          partsId:val.partsId,
          showLine:val.showLine,
          showName:val.showName,
          showNo:val.showNo,
          tblId:val.tblId,
         
        }
        console.log(this.resourceTblData);
        //  this.resourceTblData.partsId=val.partsId,
        //      this.resourceTblData.showLine=val.showLine,
        //       this.resourceTblData.showName=val.showName,
        //        this.resourceTblData.showNo=val.showNo,
        //        this.resourceTblData.tblId=val.tblId          
              this.getColData(this.resourceTblData.tblId)
      }
      this.selectId='',

             this.resourceTblData.showLine="1",
              this.resourceTblData.showName="",
               this.resourceTblData.showNo="1",
               this.resourceTblData.tblId=''
               this.ColDataList=[]
    },

    dataListHandle(data) {
      if (data && data.code === 0) {
        this.ColDataList = data.page.list;
        this.ColDataList.forEach(item => {
          if (item.detailShow === "1") {
            item.detailShow = true;
          } else if (item.detailShow === "0") {
            item.detailShow = false;
          }
          if (item.listShow === "0") {
            item.listShow = false;
          } else if (item.listShow === "1") {
            item.listShow = true;
          }
        });
        this.pageConfig.totalCount = data.page.totalCount;
        console.log(this.ColDataList, "ColDataList");

      } else {
        this.dataList = [];
        this.pageConfig.totalCount = 0;
      }
      this.dataListLoading = false;
    },

    getPartsTable(){
      this.$http({
        url: this.$http.adornUrl("/partsTable/list"),
        method: "POST",
        data: this.$http.adornData(this.addCol)
      }).then(({ data }) => {
        if (data && data.code === 0) {
                // console.log(data);
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    dataFormSubmit() {  
      this.dialogVisible = false;
     if(!this.updateVal){
        this.resourceTblData.partsId=this.$store.state.partsId
     }
    //  console.log(this.resourceTblData,this.addCol);
          this.$http({
        url: this.$http.adornUrl(`/partsTable/${!this.updateVal ? "save" : "update"}`),         
        method: "POST",
        data: this.$http.adornData(this.resourceTblData)
      }).then(({ data }) => {
        if (data && data.code === 0) {
               this.$http({
        url: this.$http.adornUrl(`/partsTableCols/${!this.updateVal ? "save" : "update"}`),               
        method: "POST",
        data: this.$http.adornData(this.addCol)
      }).then(({ data }) => {
        if (data && data.code === 0) {
                this.$emit('getPartsTable')
        } else {
          this.$message.error(data.msg);
        }
      });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
     deleteHandle (partsId,tblId) {
      let that = this;  
      this.$confirm(`确定进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleFun(partsId,tblId);
      })
    },
    // 删除请求方式
    deleFun(partsId,tblId){
      this.delId.partsId=partsId
       this.delId.tblId=tblId
      this.$http({
        url: this.$http.adornUrl("/partsTable/delete"),
        method: 'post',
        params: this.delId
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$emit('getPartsTable')
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
};
</script>
<style scoped>
.datasour >>> .el-button {
  margin-bottom: 10px;
}
</style>