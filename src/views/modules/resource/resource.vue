
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
          placeholder="请输入关键字"
          class="selectCtx"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('search')" type="primary">查 询</el-button>

        <el-button type="primary" @click="addOrUpdateResource()">添加资源表</el-button>
      </el-form-item>
    </el-form>
    <add-or-update
      v-if="addOrUpdateVisibleResource"
      ref="addOrUpdateResource"
      @refreshDataList="getDataList"
    ></add-or-update>
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
              <!-- <el-button type="text" size="small" @click="uploadTest('upload')" v-if="isImport">导入</el-button> -->
              <el-button type="text" size="small" @click="updateDiaHandle(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click.stop="deleteHandle(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </div>
      </m-table>
    </div>
    <update-dialog v-if="updateDiaVisible" ref="updateDialog" @refreshDataList="getDataList"></update-dialog>
    <upload-dialog
      v-if="uploadVisible"
      ref="uploadDialog"
      dialogName="导入数据"
      :deleteTemplate="true"
      @refreshDataList="getDataList"
    ></upload-dialog>
  </div>
</template>

<script>
import MTable from "@/components/table.vue";
import baseC from "@/components/baseDataOrMethods";
import SerionSearch from "@/components/senior-search";
import AddOrUpdate from "./resource-add";
import UpdateDialog from "./resource-update";
import UploadDialog from "@/components/upload-dialog";
export default {
  name: "resource",
  extends: baseC,
  data() {
    return {
      uploadVisible: false,
      isImport: false,
      pageConfig: {
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0
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
          width: "150",
          fixed: false,
          sortable: false,
          slot: false
        },
        {
          key: "showName",
          prop: "showName",
          label: "全局展示名",
          width: "",
          fixed: false,
          sortable: false
        },
        {
          key: "objElement",
          prop: "objElement",
          label: "全局对象标识",
          width: "",
          fixed: false,
          sortable: false
        },
        {
          key: "tblDesc",
          prop: "tblDesc",
          label: "数据源",
          width: "180",
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
          key: "isUse",
          prop: "isUse",
          label: "状态",
          width: "100",
          fixed: false,
          sortable: false
        }
      ],
      listURL: "/dataSourceTable/list"
    };
  },
  components: {
    MTable,
    AddOrUpdate,
    SerionSearch,
    UpdateDialog,
    UploadDialog
  },

  mounted() {},
  watch: {},
  methods: {
    uploadTest() {
      this.uploadVisible = true;
      this.$nextTick(() => {
        this.$refs.uploadDialog.init(this.templateExportURL, this.importURL);
      });
    },
    dataListHandle(data) {
      if (data && data.code === 0) {
        this.dataList = data.page.list;
        this.dataList.forEach(item => {
          if (item.tblType === "1") {
            item.tblType = "普通表";
            //  this.isImport=false;
          } else if (item.tblType === "2") {
            item.tblType = "文件表";
            this.isImport = true;
          } else if (item.tblType === "3") {
            item.tblType = "接口表";
            //  this.isImport=false;
          }
          if (item.isUse === "0") {
            item.isUse = "停用";
          } else if (item.isUse === "1") {
            item.isUse = "可用";
          }
        });
        this.pageConfig.totalCount = data.page.totalCount;
      } else {
        this.dataList = [];
        this.pageConfig.totalCount = 0;
      }
      this.dataListLoading = false;
    }
  }
};
</script>
<style scoped>
</style>