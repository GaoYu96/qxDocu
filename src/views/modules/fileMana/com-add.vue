<template>
  <el-dialog
    :title="dataForm.partsId ? '编辑' : '新增'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="formDialog"
    width="60%"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      label-width="120px"
      size="mini"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="部件名称" prop="partsDesc">
            <el-input
              v-model="dataForm.partsDesc"
              placeholder="部件名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型" prop="partsType">
            <el-select
              v-model="dataForm.partsType"
              placeholder="类型"
              @change="selectType"
            >
              <el-option
                v-for="item in typeOption"
                :label="item.label"
                :value="item.value"
                :key="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示标题" prop="isTitle">
            <el-select v-model="dataForm.isTitle">
              <el-option
                v-for="item in title"
                :label="item.label"
                :value="item.value"
                :key="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="可折叠" prop="isFold">
            <el-select v-model="dataForm.isFold">
              <el-option
                v-for="item in fold"
                :label="item.label"
                :value="item.value"
                :key="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="saveComData">保存部件信息</el-button>
      </el-form-item>
      <div class="datasour">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="数据来源" name="first">
            <com-dataSource
              @getPartsTable="getPartsTable"
              :dataList="dataList"
              ref="comAdd"
            ></com-dataSource>
          </el-tab-pane>
          <el-tab-pane label="展示模板" name="second">
            <div id="testNode">
              <codemirror
                :codeContent="codeContent"
                @changeCodeContent="changeCodeContent"
                ref="codeMirror"
              ></codemirror>
             
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import comDataSource from "./com-dataSource";
import MTable from "@/components/table";
import codemirror from "@/components/codemirror.vue";
import mTemplate from './template.js'
export default {
  data() {
    return {
      codeContent: "",
      tblColsMap: {},
      visible: false,
      activeName: "first",
      partsId: "",
      dataList: [],
      testCode: "",
      // tableHeader: [
      //   {
      //     key: "NAME",
      //     prop: "NAME",
      //     label: "表名称",
      //     width: "",
      //     fixed: true,
      //     sortable: false
      //   },
      //   {
      //     key: "DESC",
      //     prop: "DESC",
      //     label: "表描述",
      //     width: "",
      //     fixed: false,
      //     sortable: false,
      //     slot: false
      //   },
      //   {
      //     key: "type",
      //     prop: "type",
      //     label: "类型",
      //     width: "",
      //     fixed: false,
      //     sortable: false
      //   }
      // ],
      tableHeader: [],
      testFilereader: "",
      dataForm: {
        partsId: 0,
        partsDesc: "",
        partsType: "",
        isTitle: "1",
        isFold: "1",
        code: ""
      },
      fold: [
        { label: "是", value: "1" },
        { label: "否", value: "0" }
      ],
      title: [
        { label: "是", value: "1" },
        { label: "否", value: "0" }
      ],
      dataRule: {
        partsDesc: [
          { required: true, message: "部件名称不能为空", trigger: "blur" }
        ],
        partsType: [
          { required: true, message: "部件类型不能为空", trigger: "change" }
        ]
      },
      typeOption: [
        { label: "多值显示", value: "multivalue" },
        { label: "列表显示", value: "list" },
        { label: "标签显示", value: "tag" },
        { label: "图片轮播", value: "image" }
      ],
      // partsData:{},
     
      partsTblPara: {
        partsId: "",
        page: 1,
        limit: 50
      },

      selePartsType: ""
    };
  },
  components: {
    comDataSource,
    codemirror,
    MTable
  },
  
  mounted() {},
    computed:{
    partTypeChange(){
      return this.dataForm.partsType
    }
  },

  watch: {
    partTypeChange(newVal, oldVal){
      if(newVal){
        this.codeContent = mTemplate[newVal]

      }
    },
    selePartsType(val) {

    }
  },
  methods: {
    handleClick(tab, event) {
      if (tab.label === "展示模板") {

      }
    },
    selectType(val) {
      this.selePartsType = val;
      this.$refs.codeMirror.sqlChange();
    },
    changeCodeContent(val) {

      this.dataForm.code = val;

    },
    tempCode() {
      if (this.selePartsType === "list") {
        this.codeContent = `<div><div style="background-color:#1aa194;">{{partsData.patrs.partsDesc}}<button style="float:right;" >删除</button></div>
       <div v-for="(item,index) in partsData.tableList" :key="index">
       <div style="background-color:#E6F2FF">{{item.tableInfo.showName}}</div> 
        <table border="1" cellspacing="0" cellpadding="0" style="background-color:WhiteSmoke">        
      <tr>
         <th v-for="(itm,index) in item.colsInfo" :key="index">
             {{itm.showName}}</th><th><a href="#" style="color:black;">更多</a></th></tr>
               <tr>
             <td v-for="(itm,index) in item.colsInfo" :key="index">
            {{itm.showType}}</td><td><a href="#" style="color:black;">详情</a></td></tr>
         </table>       
       </div>
         </div>`;
      } else if (this.selePartsType === "multivalue") {
        this.codeContent = `
         <div style="background-color:WhiteSmoke;">
         <span>多值</span><br>
         <form>
    表单项1:
   <input type="text" name="firstname" value="${this.typeOption[1].label}">
   <br>
   表单项2:
   <input type="text" name="lastname" value="${this.typeOption[1].label}">
    <br><br>
   <input type="submit" value="Submit">
    </form>
   </div>
   `;
      } else if (this.selePartsType === "tag") {
        this.codeContent = `<div style="background-color:WhiteSmoke;"> <span>标签信息</span> <br>
        ${this.tableHeader
          .map(item => {
            return ` <a style="border:1px solid black;margin:5px;color:black;" href="javascript:void(0);">${item.label}</a>`;
          })
          .join("")}   
       </div>`;
      } else if (this.selePartsType === "image") {
        this.codeContent = `
         <div style="background-color:WhiteSmoke;">
         <span>图片</span><br>
        
   </div>
   `;
      }
    },
    testAppend() {
      let aaa = "哈哈哈";
      this.testCode = `<h2>${aaa}</h2>`;
    },

    getPartsTable() {

      this.$http({
        url: this.$http.adornUrl("/partsTable/list"),
        method: "POST",
        params: this.partsTblPara
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.partsId = data.partsId;
          this.$store.commit("setPartsId", this.partsId);
          this.dataList = data.page.records;

        } else {
          this.$message.error(data.msg);
        }
      });
    },
    init(_row) {
      this.visible = true;
      // console.log("here");
     
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
         this.$refs.comAdd.clearTbls()
         this.$refs.comAdd.removePId();
        if (_row) {
          this.dataForm = {
            partsId: _row.partsId,
            partsDesc: _row.partsDesc,
            partsType: _row.partsType,
            isTitle: _row.isTitle,
            isFold: _row.isFold
          };
          // console.log(_row);
          if (this.dataForm.partsType === "列表显示") {
            this.selePartsType = "list";
          } else if (this.dataForm.partsType === "多值显示") {
            this.selePartsType = "multivalue";
          } else if (this.dataForm.partsType === "标签显示") {
            this.selePartsType = "tag";
          } else if (this.dataForm.partsType === " 图片轮播") {
            this.selePartsType = "image";
          }

          // this.tempCode();
          this.partsTblPara.partsId = this.dataForm.partsId;
          this.getPartsTable();
        } else {
          this.dataForm.partsId = 0;
          this.selePartsType = "";
        }
      });
      // this.$refs.comDataSource.clearTblData()
    },
    saveComData() {

     let realCode=this.htmlEncode(this.codeContent) 
     this.dataForm.code=realCode
      console.log(this.dataForm, "dataForm");
      this.$http({
        url: this.$http.adornUrl("/parts/save"),
        method: "POST",
        data: this.$http.adornData(this.dataForm)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.partsTblPara.partsId = this.partsId = data.partsId;
          this.$store.commit("setPartsId", this.partsId);
          sessionStorage.setItem('partsId',this.partsId)
          this.$message.success("操作成功");
          this.$emit("refreshDataList");
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    htmlEncode: function(value) {
      //将特殊字符转码为Html转义字符
      return !value
        ? value
        : value
            .replace(/&/g, "&amp;")
            .replace(/\"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    },
    dataFormSubmit() {
      // console.log(this.dataForm, "dataFormSubmit");
      this.visible = false
      if(this.dataForm.partsId){
          this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.visible = false;
          this.$http({
            url: this.$http.adornUrl(
              "/parts/update"
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
    
    },
    HideDia() {
      this.visible = false;
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
  .datasour {
    width: 100%;
    min-height: 400px;
  }
}
</style>