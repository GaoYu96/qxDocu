<template>
  <el-dialog title="编辑" :close-on-click-modal="false" :visible.sync="visible" class="formDialog">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      label-width="120px"
      size="mini"
      :inline="true"
    >
      <el-form-item label="数据源" prop="tblDesc">
        <el-input v-model="updateData.tblDesc"></el-input>
      </el-form-item>

      <el-form-item label="表名" prop="tblName">
        <el-input v-model="updateData.tblName"></el-input>
      </el-form-item>
      <el-form-item label="全局展示名" prop="showName">
        <el-input v-model="updateData.showName"></el-input>
      </el-form-item>
      <el-form-item label="全局对象标识" prop="objElement">
        <el-input v-model="updateData.objElement"></el-input>
      </el-form-item>
    </el-form>
    <m-table
      ref="multipleTable"
      :tableHeader="tableHeader"
      :tableData="dataList"
      :hasIndex="true"
      :hasSelection="true"
    ></m-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import MTable from "@/components/table.vue";
import encrypt from "@/utils/encrypt";
import baseC from "@/components/baseDataOrMethods"
export default {
  extends: baseC,
  data() {
    return {
      visible: false,
      listURL:'/dataSourceTable/list',
      dataForm: {
        tblId: "",
        resturl: "",
        tblName: "",
        showName: "",
        objElement: ""
      },
      tableHeader: [
        {
          key: "colId",
          prop: "colId",
          label: "字段ID",
          width: "100",
          fixed: true,
          sortable: false
        },
        {
          key: "colName",
          prop: "colName",
          label: "列名",
          width: "180",
          fixed: false,
          sortable: false,
          slot: false
        },
        {
          key: "colType",
          prop: "colType",
          label: "列类型",
          width: "",
          fixed: false,
          sortable: false
        },
        {
          key: "listShow",
          prop: "listShow",
          label: "列表展示(全局)",
          width: "90",
          fixed: true,
          sortable: false
        },
        {
          key: "detailShow",
          prop: "detailShow",
          label: "详情展示(全局)",
          width: "90",
          fixed: false,
          sortable: false,
          slot: false
        },
        {
          key: "showType",
          prop: "showType",
          label: "显示类型(全局)",
          width: "90",
          fixed: false,
          sortable: false
        },
        {
          key: "showTypeVal",
          prop: "showTypeVal",
          label: "显示类型值",
          width: "100",
          fixed: true,
          sortable: false
        }
      ],
      dataRule: {
        xm: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        gmsfhm: [
          { required: true, message: "身份证号不能为空", trigger: "change" }
        ],

        ryfl: [{ required: true, message: "人员分类不能为空", trigger: "blur" }]
      },

      dataList: [],
       seniorPara:[],
      updateData: {
        tblDesc: "",
        tblName: "",
        objElement: "",
        tblId: "",
        resturl: "",
        showName: "",
        tblDesc: "",
        tblType: "",
        dsId: "",
        isUse: "",
        objCol: ""
      }
    };
  },
  components: {
    MTable
  },
  computed: {},
  watch: {},
  methods: {

    seniorData(){
         this.seniorPara.push({
                type:"string",
                value:`${this.updateData.tblId}`
      })     
      let paramArr= encrypt.jiami(this.seniorPara)
      let sqlStr="(`tbl_Id`=?)";           
      this.getSpaiaclSeniorData(
        {URL:"/dataSourceCol/list"} ,
         {
          sql: encrypt.jiami(sqlStr),
          params: paramArr
        },
         { sql: sqlStr, params: this.seniorPara }
      )
    },


    init(val) {
      this.updateData.tblId = val.tblId;
      this.updateData.tblDesc = val.tblDesc;
      this.updateData.tblName = val.tblName;
      this.updateData.showName = val.showName;
      this.updateData.objElement = val.objElement;
      this.updateData.resturl = val.resturl;
      this.updateData.tblDesc = val.tblDesc;
      this.updateData.dsId = val.dsId;
      this.updateData.isUse = val.isUse;
      this.updateData.objCol = val.objCol;
      if (val.tblType === "普通表") {
        this.updateData.tblType = "1";
      } else if (val.tblType === "文件表") {
        this.updateData.tblType = "2";
      } else if (val.tblType === "接口表") {
        this.updateData.tblType = "3";
      }
      if (val.isUse === "可用") {
        this.updateData.isUse = "1";
      } else if (val.isUse === "停用") {
        this.updateData.isUse = "0";
      } 
      this.visible = true;
      this.seniorData()
    },

    dataFormSubmit() {
      this.visible = false;
      console.log(this.updateData);
      this.$http({
        url: this.$http.adornUrl("/dataSourceTable/update"),
        method: "POST",
        data: this.$http.adornData(this.updateData)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message.success("修改成功");
          this.$emit("refreshDataList");
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
    font-size: 14px;
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