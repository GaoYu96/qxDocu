<template>
  <el-dialog
    title="添加数据列"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="formDialog"
    width="60%"
  >
    <el-form :model="dataForm" ref="dataForm" label-width="120px" size="mini" :inline="true">
      <div>待分级资源表列表</div>
      <div class="datasour">
        <el-form-item>
          <el-input v-model="dataForm.searchCtx" placeholder="请查询资源表关键字" class="selectCtx">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList('search')" type="primary">查 询</el-button>
          <el-button @click="getDataList('search')" type="primary">添加所选</el-button>
          <el-select v-model="levelPara.level" placeholder="请选择类型" class="selClass">
            <el-option
              v-for="itm in levelOption"
              :key="itm.value"
              :label="itm.label"
              :value="itm.value"
            ></el-option>
          </el-select>
        </el-form-item>
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
        ></m-table>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import MTable from "@/components/table.vue";
export default {
  data() {
    return {
      visible: false,
      pageConfig: {
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0
      },
      activeName: "first",
      choosen: [],
      dataForm: {
        partsId: 0,
        partsDesc: "",
        partsType: "",
        isTitle: "1",
        isFold: "1"
      },
      fold: [
        { label: "是", value: "1" },
        { label: "否", value: "0" }
      ],
      title: [
        { label: "是", value: "1" },
        { label: "否", value: "0" }
      ],
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
          key: "tblId",
          prop: "tblId",
          label: "所属表",
          width: "150",
          fixed: false,
          sortable: false,
          slot: false
        },
        {
          key: "colType",
          prop: "colType",
          label: "类型",
          width: "",
          fixed: false,
          sortable: false
        },
        {
          key: "colShowName",
          prop: "colShowName",
          label: "字段名",
          width: "",
          fixed: false,
          sortable: false
        }

        //  {
        //   key: "level",
        //   prop: "level",
        //   label: "敏感级别",
        //   width: "100",
        //   fixed: false,
        //   sortable: false
        // },
      ],
      levelOption: [
        { label: "一级/一般敏感级", value: "1" },
        { label: "二级/敏感级", value: "2" },
        { label: "三级/核心敏感级", value: "3" }
      ],
      dataList: [],
      levelPara: {
        level: "",
        colId: "",
        tblId: ""
      }
    };
  },
  components: {
    MTable
  },
  computed: {},
  watch: {},
  methods: {
    updateOneSelections(val) {
      this.levelPara.tblId = val.tblId;
      this.levelPara.colId = val.colId;
      console.log(val);
    },
getDataList(){
  this.$http({
        url: this.$http.adornUrl("/dataSourceCol/list"),
        method: "POST",
        data: this.$http.adornData({
          page: this.pageConfig.pageIndex,
          limit: this.pageConfig.pageSize,
          searchCtx: ""
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataListHandle(data);
        } else {
          this.$message.error(data.msg);
        }
      });
},
    init(_row) {
      this.visible = true;
    this.getDataList()
    },

    dataFormSubmit() {
      this.visible = false;
      console.log(this.levelPara);
      this.$http({
        url: this.$http.adornUrl("/resourceColLevel/save"),
        method: "POST",
        data: this.$http.adornData(this.levelPara)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message.success("操作成功");
          // console.log(data,"data");
          // this.$emit('refreshDataList')
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    HideDia() {
      this.visible = false;
    },
    dataListHandle(data) {
      if (data && data.code === 0) {
        console.log(data,"data");
        this.dataList = data.page.list;

        this.pageConfig.totalCount = data.page.totalCount;
      } else {
        this.dataList = [];
        this.pageConfig.totalCount = 0;
      }
      this.dataListLoading = false;
    },
        sizeChangeHandle(val) {
      // console.log(val);
      this.pageConfig.pageSize = val;
      this.pageConfig.pageIndex = 1;
      // console.log(this.pageConfig);

      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      // console.log(val);
      this.pageConfig.pageIndex = val;
      // console.log(this.pageConfig);
      this.getDataList();
    },
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
  .upper {
    width: 100%;
    min-height: 300px;
    background: blanchedalmond;
  }
  .datasour {
    width: 100%;
    min-height: 400px;
    margin-top: 10px;
  }
  .selClass {
    width: 150px;
    margin-left: 10px;
  }
}
</style>