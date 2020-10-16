<template>
  <el-dialog title="复制部件" :close-on-click-modal="false" :visible.sync="visible" class="formDialog">
    <el-form label-width="120px" size="mini">
      <el-form-item label="关键字" prop="searchCtx">
        <el-input v-model="searchCtx" style="width:150px"></el-input>
        <el-button @click="getDataList('search')">查 询</el-button>
      </el-form-item>
    </el-form>
    <m-table
      ref="multipleTable"
      :tableHeader="tableHeader"
     
       :tableData="dataList"
      :hasIndex="true"
      :hasSelection="false"  
      :selectOne="true"
      :showPage="true"
        :pageConfig="pageConfig"
        @sizeChangeHandle="sizeChangeHandle"
        @currentChangeHandle="currentChangeHandle"
           @updateOneSelections="updateOneSelections"
      class="tableClass"
    ></m-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import MTable from "@/components/table";
import baseC from "@/components/baseDataOrMethods"
export default {
  name: "comCopy",
  extends:baseC,
  data() {
    return {
      visible: false,
      listURL:'/parts/list',
      searchCtx:'',
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
          width: "120",
          fixed: true,
          sortable: false
        },
        {
          key: "partsType",
          prop: "partsType",
          label: "类型",
          width: "120",
          fixed: false,
          sortable: false,
          slot: false
        },
        {
          key: "objElement",
          prop: "objElement",
          label: "对象要素",
          width: "120",
          fixed: false,
          sortable: false
        }
      ],
      selectedPart:{
            partsId:'',
      },
      dataForm: {
        partsId: 0,
        partsDesc: "",
        partsType: "",
        isTitle: "",
        isFold: ""
      },
      dataRule: {
        xm: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        gmsfhm: [
          { required: true, message: "身份证号不能为空", trigger: "change" }],
        ryfl: [{ required: true, message: "人员分类不能为空", trigger: "blur" }]
      },
dataList:[
  
],
     
    };
  },
  components: {
    MTable
  },
  computed: {},
  watch: {},
  methods: {
    getData(){
         this.$http({
          url: this.$http.adornUrl(this.listURL),
          method: 'POST',
          data: this.$http.adornData({
            'page': this.pageConfig.pageIndex,
            'limit': this.pageConfig.pageSize,
            'searchCtx': this.searchCtx
          })
        }).then(({data}) => {
          console.log(data);
          // this.dataListHandle(data)
         this.dataList=data.page.list
         this.pageConfig.totalCount=data.page.totalCount
        }).catch(({data})=>{
          this.dataListLoading = false
        })
    },
    init(_row) {

      this.visible = true;
      this.getData()
      
    },
    sizeChangeHandle(val) {
      this.pageConfig.pageSize = val;
      this.pageConfig.pageIndex = 1;
      this.getData();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageConfig.pageIndex = val;
      this.getData();
    },
        updateOneSelections(val){
       console.log(val);
       this.selectedPart.partsId=val.partsId
  },
    dataFormSubmit() {
      // console.log(this.dataForm, "dataFormSubmit");
      
       
          this.visible = false;
          this.$http({
            url: this.$http.adornUrl("/parts/partsCopy/"+this.selectedPart.partsId),
            method: "GET",

          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message.success("复制成功");
              // this.$emit("refreshDataList");
              this.getData();
            } else {
              this.$message.error(data.msg);
            }
          });
        
     
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .formDialog {
    // .el-dialog__body{
    .tipsSty {
      .el-form-item__content {
        margin-left: 15px !important;
        width: 90%;
      }
    }
    // }
  }
  .el-form-item__label {
    text-align: right;
    float: left;
    font-size: 16px;
    color: #606266;
    // line-height: 42px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
    vertical-align: bottom;
    // margin-bottom: 5px;
    height: 28px;
  }
  .el-input--mini {
    font-size: 12px;
    vertical-align: bottom;
    // outline:none;
  }
}
</style>