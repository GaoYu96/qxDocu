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
      
      :hasIndex="true"
      :hasSelection="true"
      :showPage="true"
      :pageConfig="pageConfig"
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
export default {
  name: "tempCopy",
  data() {
    return {
      visible: false,
      tableHeader: [
        {
          key: "templateDesc",
          prop: "templateDesc",
          label: "模板名称",
          width: "120",
          fixed: true,
          sortable: false
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
      dataForm: {
        partsId: 0,
        partsDesc: "",
        partsType: "",
        isTitle: "",
        isFold: ""
      },


      showColContent: false
    };
  },
  components: {
    MTable
  },
  computed: {},
  watch: {},
  methods: {
    init(_row) {
      this.visible = true;
      //   this.$nextTick(() => {
      //     this.$refs['dataForm'].resetFields()
      //     if (_row) {
      //       this.dataForm = {
      //         partsId:_row.partsId,
      //         partsDesc: _row.partsDesc,
      //         partsType: _row.partsType,
      //         isTitle: _row.isTitle,
      //         isFold: _row.isFold,

      //       }
      //       console.log(this.dataForm);
      //     }
      //     else{
      //       this.dataForm.partsId=0
      //        console.log(this.dataForm);
      //     }
      //   });

      // if(_row){
      //   this.dataForm = JSON.parse(JSON.stringify(_row))
      // }

      // 获取数据源
      //   this.$http({
      //     url: this.$http.adornUrl('/meta/datasource/list'),
      //     method: 'post',
      //     data: this.$http.adornData({
      //       limit: 99999999,
      //       page: 1,
      //       searchCtx: ''
      //     },false)
      //   }).then(({data}) => {
      //     if (data && data.code === 0) {
      //       this.lyDsOptions = data.page.list
      //     }
      //   })
    },

    dataFormSubmit() {
      console.log(this.dataForm, "dataFormSubmit");
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.visible = false;
          this.$http({
            url: this.$http.adornUrl(
              `/daparts/${!this.dataForm.partsId ? "save" : "update"}`
            ),
            method: "POST",
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message.success("操作成功");
              this.$emit("refreshDataList");
            } else {
              this.$message.error(data.msg);
            }
          });
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