<template>
  <el-dialog title="新增" :close-on-click-modal="false" :visible.sync="visible" class="formDialog">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      label-width="120px"
      size="mini"
      v-show="!nextPage"
    >
      <el-form-item label="表来源" prop="tblType">
        <el-select v-model="dataForm.tblType" @change="chooseResource" placeholder="请选择数据源">
          <el-option
            v-for="itm in resourceSelect"
            :key="itm.name"
            :label="itm.name"
            :value="itm.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="从普通表添加" prop="address" v-if="this.mainTblType==='normal'&&moreSele">
        <el-select v-model="normalForm" placeholder="请选择">
          <el-option v-for="itm in addressSelect" :key="itm.id" :label="itm.label" :value="itm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="从接口地址添加" prop="address" v-if="this.mainTblType==='address'&&moreSele">
        <el-input v-model="returnAddr" placeholder="请输入接口地址"></el-input>
      </el-form-item>
      <!-- <el-form-item label="从文件表添加" prop="address" v-if="this.mainTblType==='file'&&moreSele">
        <el-input v-model="filePara.tableName" placeholder="请输入表描述"></el-input>
      </el-form-item>-->
    </el-form>
    <div v-show="nextPage&&(mainTblType==='normal'||mainTblType==='address')">
      <!-- <div class="choosen">
        <span style="font-size:16px;">已选择资源表</span>
      </div>-->
      <el-form label-width="120px" size="mini">
        <el-form-item label="关键字" prop="searchCtx">
          <el-input v-model="searchCtx" style="width:150px"></el-input>
          <el-button @click="getDataList('search')">查 询</el-button>
        </el-form-item>
        <m-table
          ref="multipleTable"
          :tableHeader="tableHeader"
          :tableData="willAddTbl"
          :hasIndex="true"
          :hasSelection="true"
          :showPage="true"
          :pageConfig="pageConfig"
          @sizeChangeHandle="sizeChangeHandle"
          @currentChangeHandle="currentChangeHandle"
          @updateDataListSelections="updateDataListSelections"
          v-show="mainTblType!='file'"
        >
          <div slot="handleColumn">
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="类型"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.value" placeholder="请选择" @change="setObjEle">
                  <el-option
                    v-for="itm in objType"
                    :key="itm.value"
                    :label="itm.label"
                    :value="itm.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
          </div>
        </m-table>
      </el-form>
    </div>
    <el-form label-width="120px" size="mini" v-show="nextPage&&mainTblType==='file'">
      <el-row>
        <el-form-item label="英文表名">
          <el-input v-model="filePara.tableName" placeholder="英文表名"></el-input>
        </el-form-item>
        <el-form-item label="中文表名">
          <el-input v-model="filePara.tableDesc" placeholder="中文表名"></el-input>
        </el-form-item>

        <el-form-item label="全局对象标识">
          <el-input v-model="filePara.objCol" placeholder="全局对象标识"></el-input>
        </el-form-item>
        <el-form-item label="对象要素">
          <el-select v-model="filePara.objElement" placeholder="请选择">
            <el-option
              v-for="itm in objType"
              :key="itm.value"
              :label="itm.label"
              :value="itm.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="全局展示名">
          <el-input v-model="filePara.showName" placeholder="全局展示名"></el-input>
        </el-form-item>

        <el-form-item label="请输入表结构">
          <el-input
            v-model="structure"
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 100}"
            :placeholder="setTips()"
          ></el-input>
        </el-form-item>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="next()" v-show="!nextPage">下一步</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-show="nextPage">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import MTable from "@/components/table";
import encrypt from "@/utils/encrypt";
import baseC from "@/components/baseDataOrMethods"
export default {
 extends: baseC,
  data() {
    return {
      visible: false,
      listURL: "/dataSource/getDataSourceList",
      example: `请按行输入表结构信息，一行为一个字段信息，字段名与字段描述以'#'隔开，字段描述可为空例子：xm#姓名sfzh#身份证号`,
      one: "例子:",
      two: "xm#姓名",
      three: "sfzh#身份证号",
      searchCtx: "",
      structure: "",
      mainTblType: "",
      moreSele: false,
      nextPage: false,
      dataForm: {
        tblType: "",

        isUse: "",
        objCol: "",
        objElement: "",
        resturl: "",
        show_name: "",
        tblDesc: "",
        tblId: 0,
        tblName: ""
      },
      normalForm:'',
      returnAddr:'',
      filePara: {
        colArr: [],
        colDescArr: [],
        isUse: 1,
        objCol: "",
        objElement: "",
        showName: "",
        tableDesc: "",
        tableName: "",
        tblType: 2
      },
      pageConfig: {
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0
      },
      objType: [
        { label: "人员", value: "ry" },
        { label: "地址", value: "address" },
        { label: "案件", value: "case" },
        { label: "物品", value: "thing" },
        { label: "组织", value: "org" },
        { label: "虚拟身份", value: "virtualId" }
      ],
      tableHeader: [
        {
          key: "NAME",
          prop: "NAME",
          label: "表名称",
          width: "",
          fixed: true,
          sortable: false
        },
        {
          key: "DESC",
          prop: "DESC",
          label: "表描述",
          width: "",
          fixed: false,
          sortable: false,
          slot: false
        }
        // {
        //   key: "type",
        //   prop: "type",
        //   label: "类型",
        //   width: "",
        //   fixed: false,
        //   sortable: false
        // }
      ],
      resourceSelect: [
        { name: "普通表", value: "normal" },
        { name: "接口地址", value: "address" },
        { name: "文件表", value: "file" }
      ],
      addressSelect: [],
      willAddTbl: [],
      dataRule: {
        name: [
          { required: true, message: "数据源名称不能为空", trigger: "blur" }
        ],
        kind: [
          { required: true, message: "数据源类型不能为空", trigger: "change" }
        ],
        description: [
          { required: true, message: "数据源描述不能为空", trigger: "blur" }
        ]
      },
      dataList: [],
      tempParam: {
        tblType: ""
      },
      seniorPara:[],
    };
  },
  components: {
    MTable
  },
  mounted() {
    this.getdataSource();
    this.dataForm.tblType = "";
    this.dataForm.isUse = "";
    this.dataForm.objCol = "";
    this.dataForm.objElement = "";
    this.dataForm.resturl = "";
    this.dataForm.show_name = "";
    this.dataForm.tblDesc = "";
    this.dataForm.tblId = "";
    this.dataForm.tblName = "";
    this.normalForm=""
  },
  computed: {},

  methods: {
    setObjEle(val) {
      this.dataForm.objElement = val;
    },
    updateDataListSelections(val) {
      this.addingTbl = val;
      // console.log( this.addingTbl," this.addingTbl");
    },
    getdataSource() {
      this.$http({
        url: this.$http.adornUrl("/dataSource/getDataSourceList"),
        method: "POST",
        data: this.$http.adornData({
          page: this.pageConfig.pageIndex,
          limit: this.pageConfig.pageSize,
          searchCtx: ""
        })
      })
        .then(({ data }) => {
          this.dataList = data.page.list;

          this.pageConfig.totalCount = data.page.totalCount;
          for (var i = 0; i < data.page.list.length; i++) {
            this.addressSelect.push({
              label: data.page.list[i].NAME,
              id: data.page.list[i].ID
            });
          }
        })
        .catch(({ data }) => {
          this.dataListLoading = false;
        });
    },
    sizeChangeHandle(val) {
      this.pageConfig.pageSize = val;
      this.pageConfig.pageIndex = 1;
      this.normalFormData();
    },
    // 当前页
    currentChangeHandle(val) {

      this.pageConfig.pageIndex = val;

      this.normalFormData();
    },
    setTips() {
      let tips = `请按行输入表结构信息，一行为一个字段信息，字段名与字段描述以'#'隔开，字段描述可为空
例子:
xm#姓名
sfzh#身份证号`;
      return tips;
    },
    normalFormData(){                                  //获取数据源ID，作高级查询
      this.$store.commit('setSeniorPara',true)
      this.seniorPara.push({
                type:"string",
                value:`${this.normalForm}`
      })     
      let paramArr= encrypt.jiami(this.seniorPara)
      let sqlStr="(`DS_ID`=?)";           
      this.getSpaiaclSeniorData(
        {URL:"/meta/metatable/inTablelist"} ,
         {
          sql: encrypt.jiami(sqlStr),
          params: paramArr
        },
         { sql: sqlStr, params: this.seniorPara }
      )

    },
      dataListHandle(data){
     
      if (data && data.code === 0) {
        this.willAddTbl = data.page.list;
            this.pageConfig.totalCount=data.page.totalCount
     this.nextPage = true;
      } else {
        this.dataList = []
        this.pageConfig.totalCount = 0
      }
      this.dataListLoading = false
    },
    next() {
      this.willAddTbl = [];
      if (this.mainTblType === "normal") {
       this.normalFormData()
      } else if (this.mainTblType === "file") {
        this.nextPage = true;
        console.log(this.structure);
      } else if (this.mainTblType === "address") {
        this.nextPage = true;
      }
    },
    init() {
      this.visible = true;
      this.$nextTick(() => {
      this.$refs["dataForm"].resetFields();     
      // (this.mainTblType = this.$store.state.tblType),
      // (this.moreSele = this.$store.state.moreSele),
        (this.nextPage = this.$store.state.nextPage),
        (this.dataForm.resourceSelect = ""),
        (this.dataForm.addressSelect = "");
        this.mainTblType='',
         this.normalForm=""
        this.moreSele=false
        // console.log(this.mainTblType);
      })
    },

    dataFormSubmit() {
      if (this.mainTblType === "normal") {
        this.visible = false;
        let val = this.addingTbl;

        this.tempParam.tblName = this.addingTbl[0].NAME;
        this.tempParam.tblDesc = this.addingTbl[0].DESC;
        this.tempParam.tblType = 1;
        this.tempParam.showName = this.addingTbl[0].DESC;
        this.tempParam.objCol = "a";
        this.tempParam.objElement = this.dataForm.objElement;
        this.tempParam.tblId = this.addingTbl[0].ID;
        this.tempParam.dsId = this.addingTbl[0].DS_ID;
        this.tempParam.isUse = 1;
        // console.log(this.tempParam, "this.tempParam");
        this.$http({
          url: this.$http.adornUrl("/dataSourceTable/save"), // /dataSourceTable/save           /dataSource/createSourceTable
          method: "POST",
          data: this.$http.adornData(this.tempParam)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success("操作成功");
            this.$emit("refreshDataList");
          } else {
            // this.$message.error(data.msg);
          }
        });
      } else if (this.mainTblType === "file") {
        this.visible = false;
        let everyRow = this.structure.split(/[\s\n]/);
        for (var i = 0; i < everyRow.length; i++) {
          this.filePara.colArr.push(everyRow[i].split("#")[0]);
          this.filePara.colDescArr.push(everyRow[i].split("#")[1]);
        }
        // console.log(this.filePara, "file");
        this.$http({
          url: this.$http.adornUrl("/dataSource/createSourceTable"),
          method: "POST",
          data: this.$http.adornData(this.filePara)
        }).then(({ data }) => {
          if (data && data.msg === "建表成功!" && data.code === 0) {
            this.$message.success("建表成功");
            this.$emit("refreshDataList");
          } else {
           
          }
        });
      } else if (this.mainTblType === "address") {
        this.visible = false;
      }
    },
    chooseResource(val) {
      this.moreSele = true;
      // console.log(val);
      if (val === "normal") {
        this.mainTblType = "normal";
      } else if (val === "address") {
        this.mainTblType = "address";
      } else if (val === "file") {
        this.mainTblType = "file";
      }
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
  .choosen {
    width: 100%;
    min-height: 200px;
    // background: pink;
    margin-bottom: 10px;
    border-bottom: 1px solid black;
  }
}
</style>