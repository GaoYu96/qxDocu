
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
        <el-button @click="getDataList('search')" type="primary"
          >查 询</el-button
        >

        <el-popover placement="bottom" width="100" trigger="click">
          <el-button
            type="primary"
            style="margin:10px;"
            @click="addOrUpdateHandle()"
            >添加模板</el-button
          >
          <el-button type="primary" style="margin:10px;" @click="showTempCopy()"
            >复制模板</el-button
          >
          <el-button type="primary" slot="reference" style="margin-left:10px;"
            >添加</el-button
          >
        </el-popover>

        <el-button type="primary" style="margin-left:10px;">设为默认</el-button>
      </el-form-item>
    </el-form>

    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></add-or-update>
    <tempCopy v-if="tempCopyVisible" ref="tempCopy"></tempCopy>
    <div class="mainTable">
      <m-table
        ref="multipleTable"
        :tableHeader="tableHeader"
        :tableData="dataList"
        :hasIndex="true"
        :hasSelection="true"
        :pageConfig="pageConfig"
        :showPage="true"
        @updateDataListSelections="updateDataListSelections"
        class="tableClass"
      >
        <div slot="handleColumn">
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="280"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small">停用</el-button>
              <el-button type="text" size="small" @click="perview(scope.row)">预览</el-button>
              <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click="setIcon()"
                >选择图标</el-button
              >
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </div>
      </m-table>
      <el-dialog title="选择图标" :visible.sync="dialogVisible" width="30%">
        <el-button type="primary">上传图标</el-button>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import MTable from "@/components/table.vue";
import baseC from "@/components/baseDataOrMethods";
import SerionSearch from "@/components/senior-search";
import AddOrUpdate from "./tempForm";
import tempCopy from "./tempCopy";
export default {
  name: "templateMana",
  extends: baseC,
  data() {
    return {
      listURL: "/template/list",
      dialogVisible: false,
      tempCopyVisible: false,
      params:{
           partsId:''
      },
      tableHeader: [
        {
          key: "templateDesc",
          prop: "templateDesc",
          label: "模板名称",
          width: "",
          fixed: false,
          sortable: false,
          slot: false
        }
      ],
      tplsArr_right:[],
    };
  },
  components: {
    MTable,
    tempCopy,
    AddOrUpdate,
    SerionSearch
  },

  mounted() {},
  methods: {
    setIcon() {
      this.dialogVisible = true;
    },
    showTempCopy() {
      this.tempCopyVisible = true;
      this.$refs.tempCopy.init();
    },
    perview(val){

         const {href} = this.$router.resolve({
        name: 'tempPreview',
        query: {
          // objElement: this.objElement,
          templateInfo: JSON.stringify(val)
         
        }
      })
 window.open(href, '_blank')
    }
  }
};
</script>
<style scoped>
.mainTable {
  width: 100%;
}
</style>