
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
        <el-input v-model="dataForm.searchCtx" placeholder="请输入">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('search')" type="primary">查 询</el-button>

        <el-button type="primary" @click="addDiaHandle()">添加红名单</el-button>
        <el-button type="primary" @click="replaceRedlist()">红名单设置</el-button>
      </el-form-item>
    </el-form>
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
            width="180"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="update(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click.stop="deleteHandle(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </div>
      </m-table>
      <redListAdd v-if="addVisible" ref="redListAdd"></redListAdd>

<el-dialog
        title="红名单设置"
        :close-on-click-modal="false"
        :visible.sync="replaceVisible"
        class="formDialog"
        width="60%"
      >
        <el-form :model="dataForm" ref="dataForm" label-width="120px" size="mini">
          <div class="datasour">
            <el-form-item>
              <span style="margin-right:10px">红名单替换为</span>
              <el-input v-model="redListReplace.replaceStr" placeholder="*" class="selectCtx"></el-input>
            </el-form-item>
            <el-form-item>
              <span style="margin-right:10px">前台文字提示</span>
              <el-radio v-model="radio" label="1">开启</el-radio>
              <el-radio v-model="radio" label="0">关闭</el-radio>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="replaceVisible = false">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="编辑"
        :close-on-click-modal="false"
        :visible.sync="updateVisible"
        class="formDialog"
        width="60%"
      >
        <el-form :model="dataForm" ref="dataForm" label-width="120px" size="mini" :inline="true">
          <div class="datasour">
            <el-form-item>
              <span style="margin-right:10px">红名单</span>
              <el-input v-model="dataForm.keyword" ></el-input>
            </el-form-item>
            <el-form-item>
              <span style="margin-right:10px">敏感级别</span>
              <el-input v-model="dataForm.level" ></el-input>
            </el-form-item>
              <el-form-item>
              <span style="margin-right:10px">规则</span>
              <el-input v-model="dataForm.rule" ></el-input>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="replaceVisible = false">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import MTable from "@/components/table.vue";
import baseC from "@/components/baseDataOrMethods";
import SerionSearch from "@/components/senior-search";
import redListAdd from "./redList-add";
export default {
  name: "redList",
  extends: baseC,
  data() {
    return {
       pageConfig:{
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
      },
      addVisible: false,
      replaceVisible: false,
      updateVisible:false,
      radio: "1",
      listURL: "/sensitiveInfo/list",
      deleteURL: "/sensitiveInfo/delete",
      tableHeader: [
        {
          key: "keyword",
          prop: "keyword",
          label: "红名单",
          width: "",
          fixed: false,
          sortable: false,
          slot: false
        },
        {
          key: "level",
          prop: "level",
          label: "敏感级别",
          width: "180",
          fixed: false,
          sortable: false
        },

        {
          key: "createTime",
          prop: "createTime",
          label: "添加时间",
          width: "",
          fixed: false,
          sortable: false
        }
      ],
      redListReplace: {
        isNotice: "",
        replaceStr: "",
        id: 0
      },
      dataForm:{
        keyword:'',
        level:'',
        rule:'',
      }
    };
  },
  components: {
    MTable,
    redListAdd,
    SerionSearch
  },

  mounted() {},
  methods: {
    update(val) {
      console.log(val);
      this.dataForm.keyword=val.keyword
     if(val.rule==='1'){
       this.dataForm.rule='红名单替换'
     }
     else if(val.rule==='0'){
            this.dataForm.rule='查询限制'
     }
     this.dataForm.level=val.level
      this.updateVisible=true;
console.log(this.dataForm);

    },
    addDiaHandle() {
      this.addVisible = true;
      this.$nextTick(() => {
        this.$refs.redListAdd.init();
      });
    },
    replaceRedlist() {
      this.replaceVisible = true;
    },
    dataListHandle(data) {
      if (data && data.code === 0) {
        this.dataList = data.page.list;
        // console.log(this.dataList,"this.dataList");
        this.dataList.forEach(item => {
          if (item.level === "1") {
            item.level = "一级";
          } else if (item.level === "2") {
            item.level = "二级";
          } else if (item.level === "3") {
            item.level = "三级";
          }
        });

        this.pageConfig.totalCount = data.page.totalCount;
      } else {
        this.dataList = [];
        this.pageConfig.totalCount = 0;
      }
      this.dataListLoading = false;
    },
    dataFormSubmit() {
      this.redListReplace.isNotice = this.radio;

      console.log(this.redListReplace);
      this.replaceVisible = false;
      //  this.$http({
      //   url: this.$http.adornUrl(
      //      "/sensitiveInfo/save"
      //   ),
      //   method: 'POST',
      //   data: this.$http.adornData(this.redListPara)
      // }).then(({data}) => {
      //   if(data && data.code === 0){
      //     this.$message.success("操作成功")
      //     this.$emit('refreshDataList')
      //   }else{
      //     this.$message.error(data.msg)
      //   }
      // })
    }
  }
};
</script>
<style scoped>
.mainTable {
  width: 100%;
}
.selectCtx {
  width: 60%;
}
</style>