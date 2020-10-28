<template>
  <div>
    <el-dialog
      :title="dataForm.templateId ? '修改' : '添加'"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="60%"
      class=""
    >
      <div class="leftClass">
        工作台
        <el-form
          :model="dataForm"
          ref="dataForm"
          label-width="100px"
          size="mini"
        >
          <el-form-item label="标题" prop="templateDesc">
            <el-input
              v-model="dataForm.templateDesc"
              placeholder="请输入标题"
            ></el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="showNo">
            <el-input
              v-model="dataForm.showNo"
              placeholder="请输入排序号"
            ></el-input>
          </el-form-item>
          <el-form-item label="对象要素">
            <el-select v-model="dataForm.objElement" placeholder="请选择">
              <el-option
                v-for="itm in objType"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="rightClass" ref="tempCon">
        <div>
          <el-button type="primary" @click="dataFormSubmit()"
            >保存模板</el-button
          >
          <el-button type="primary" @click="showSelect('', '')"
            >选择部件</el-button
          >
          <!-- <el-button type="primary" @click="showSelect('', 'left')"
            >左边</el-button
          > -->
        </div>
        <div id="tempContent" class="tempContent">
          <div class="left" id="left">
            <!-- <draggable v-model="tplsArr_left" @update="datadragEnd" :option="{group:'people'}"> -->
            <draggable
              v-model="tplsArr_left"
              @update="datadragEnd"
              group="people"
            >
              <transition-group>
                <div
                  v-for="element in tplsArr_left"
                  :key="element.partsInfo.partsId"
                  class="leftDiv"
                >
                  <li style="list-style: none"></li>
                </div>
              </transition-group>
            </draggable>
          </div>
          <div class="right" id="right">
            <!-- <draggable @update="datadragEnd" v-model="tplsArr_right"  v-bind="dragOptions"> -->
            <draggable
              @update="datadragEnd1"
              v-model="tplsArr_right"
              group="people"
            >
              <transition-group>
                <div
                  v-for="element in tplsArr_right"
                  :key="element.partsInfo.partsId"
                  class="rightDiv"
                >
                  <li style="list-style: none"></li>
                </div>
              </transition-group>
            </draggable>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="visible = false">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择部件"
      :visible.sync="dialogVisible"
      width="30%"
      :append-to-body="true"
    >
      <div>
        <ul v-for="item in partsTypeList" :key="item.partsId">
          <li>
            <el-radio
              @change="chooseParts(item, val)"
              style="margin-right: 10px"
              :label="item.partsId"
              v-model="onepart"
            >
              {{ item.partsDesc }}
            </el-radio>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue/dist/vue.esm.js";
import draggable from "vuedraggable";
import MForm from "../../../components/form";

var commonPartsData = {};
var commonCodeTemp = "";
export default {
  data() {
    return {
      visible: false,
      dialogVisible: false,
      radio: 1,
      isLeft: false,
      codeTemp: "",
      dataForm: {
        daTemplatePartsEntityList: [],
        iconId: 0,
        isDefault: "1",
        isDelete: "0",
        objElement: "",
        showNo: 0,
        status: "1",
        templateDesc: "",
        templateId: 0,
      },
      tplsArr_left: [],
      tplsArr_right: [],
      partsTypeList: [],
      dataRule: {
        xm: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        gmsfhm: [
          { required: true, message: "身份证号不能为空", trigger: "change" },
        ],

        ryfl: [
          { required: true, message: "人员分类不能为空", trigger: "blur" },
        ],
      },
      onepart: "",
      showColContent: false,
      partsData: {},
      objType: [
        { label: "人员", value: "ry" },
        { label: "地址", value: "address" },
        { label: "案件", value: "case" },
        { label: "物品", value: "thing" },
        { label: "组织", value: "org" },
        { label: "虚拟身份", value: "virtualId" },
      ],
      params: {
        partsId: "",
      },
      dragOptions: {
        name: "tplArr",
        pull: true,
        put: true,
      },
      dragOptions1: {
        name: "tplArr",
        pull: true,
        put: true,
      },
    };
  },

  components: {
    draggable,
    MForm,
  },
  computed: {},
  watch: {
    tplsArr_right(o, n) {
      console.log(this.tplsArr_right, "监测");
      setTimeout(() => {
        this.setLayout();
      }, 200);
    },
    tplsArr_left(o, n) {
      console.log(this.tplsArr_left, "监测");
      setTimeout(() => {
        this.setLayout();
      }, 200);
    },
  },

  mounted() {},
  methods: {
    datadragEnd(evt) {
      evt.preventDefault();
      console.log("拖动前的索引 :" + evt.oldIndex);
      console.log("拖动后的索引 :" + evt.newIndex);
      console.log(this.tplsArr_right, this.tplsArr_left);
    },
    datadragEnd1(evt) {
      evt.preventDefault();
      console.log("拖动前的索引 :" + evt.oldIndex);
      console.log("拖动后的索引 :" + evt.newIndex);
      console.log(this.tplsArr_right, this.tplsArr_left);
    },
    showSelect(right, left) {
      this.isLeft = false;
      if (left) {
        console.log("左边");
        this.isLeft = true;
      } else if (!left) {
        this.isLeft = false;
      }
      this.dialogVisible = true;
      // this.initLeft();
    },

    init(_row) {
      this.visible = true;

      if (_row) {
        this.getTempData(_row);
      }
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        (this.tplsArr_left = []),
          (this.tplsArr_right = []),
          this.$http({
            url: this.$http.adornUrl("/parts/list"),
            method: "post",
            data: this.$http.adornData(
              {
                limit: 99999999,
                page: 1,
                searchCtx: "",
              },
              false
            ),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.partsTypeList = data.page.list;
            }
          });
          // this.initLeft()
      });
    },
    // initLeft() {
    //   console.log("initleft");
    //   var leftFirst = {
    //     partsInfo: {
    //       code: `<div>aa</div>`,
    //       isDelete: "1",
    //       isFold: "1",
    //       isTitle: "1",
    //       objElement: "1",
    //       partsDesc: "",
    //       partsId: 0,
    //       partsType: "list",
    //       status: "1",
    //     },
    //     tableList: [
    //       {
    //         colsInfo: [],
    //         tableInfo: {},
    //         values: [],
    //       },
    //     ],
    //   };
    //   this.tplsArr_left.push(leftFirst);
    // },
    getTempData(val) {
      //模板修改时，获取模板信息
      this.dataForm = {
        objElement: val.objElement,
        templateDesc: val.templateDesc,
        templateId: val.templateId,
      };
      val.daTemplatePartsEntityList.forEach((item, index) => {
        var params = {
          partsId: item.partsId,
        };
        this.$http({
          url: this.$http.adornUrl("/templateData/addPartsView"),
          method: "GET",
          params: params,
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // this.$emit('refreshDataList')
            this.tplsArr_right.push(data.data);
            setTimeout(() => {
              this.setLayout();
            }, 500);
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },

    chooseParts(item) {
      commonPartsData = {};
      commonCodeTemp = "";
      this.params.partsId = item.partsId;
      this.$http({
        url: this.$http.adornUrl("/templateData/addPartsView"),
        method: "GET",
        params: this.params,
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // this.$emit('refreshDataList')
          // this.tplsArr_right.push(data.data);
          // console.log(this.tplsArr_right);
          //  this.tplsArr_left.push(data.data);
          // if (this.isLeft) {
          //   this.tplsArr_left.push(data.data);
          // } else {
          //   this.tplsArr_right.push(data.data);
          // }
          this.tplsArr_right.push(data.data);
          console.log(this.tplsArr_left.length, "left");
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    add() {
      // this.setLayout();
      this.dialogVisible = false;
    },

    setLayout() {
      console.log(this.tplsArr_left,this.tplsArr_right,"setLayout");
 if (this.tplsArr_right.length > 0) {
        console.log(this.tplsArr_right,"添加右边");
        let rightArr = this.tplsArr_right;
        for (var i = 0; i < rightArr.length; i++) {
          var Profile = Vue.extend({
            template: rightArr[i].partsInfo.code,
            data: function () {
              return {
                partsData: rightArr[i],
              };
            },
            components: {
              MForm,
            },
            mounted() {},
            watch: {},
            methods: {
              deleteParts(val) {
                rightArr.forEach((item, index) => {
                  if (item.partsInfo.partsId === val) {
                    rightArr.splice(index, 1);
                  }
                });
              },
            },
          });
          new Profile().$mount(
            document
              .getElementsByClassName("rightDiv")
              [i].getElementsByTagName("li")[0]
          );
        }
      }
    else  if (this.tplsArr_left.length > 0) {
        //布局，将部件挂载到页面
        // console.log(this.tplsArr_left,"添加左边");
        let leftArr = this.tplsArr_left;
        for (var i = 0; i < leftArr.length; i++) {
          var Profile = Vue.extend({
            template: leftArr[i].partsInfo.code,
            data: function () {
              return {
                partsData: leftArr[i],
              };
            },
            components: {
              MForm,
            },
            mounted() {},
            watch: {},
            methods: {
              deleteParts(val) {
                leftArr.forEach((item, index) => {
                  if (item.partsInfo.partsId === val) {
                    leftArr.splice(index, 1);
                  }
                });
              },
            },
          });
          new Profile().$mount(
            document
              .getElementsByClassName("leftDiv")
              [i].getElementsByTagName("li")[0]
          );
        }
      } 
    },

    dataFormSubmit() {
      console.log(this.tplsArr_left, this.tplsArr_right);
      if (this.tplsArr_left.length > 0) {
        this.tplsArr_left.forEach((item, index) => {
          //记录部件在左右列表的位置
          this.dataForm.daTemplatePartsEntityList.push({
            partsId: item.partsInfo.partsId,
            templateId: 0,
            x: index,
            y: -1,
          });
        });
      }
      if (this.tplsArr_right.length > 0) {
        this.tplsArr_right.forEach((item, index) => {
          this.dataForm.daTemplatePartsEntityList.push({
            partsId: item.partsInfo.partsId,
            templateId: 0,
            x: -1,
            y: index,
          });
        });
      }
      // console.log(this.dataForm, "dataForm");
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.visible = false;
          this.$http({
            url: this.$http.adornUrl(
              `/template/${!this.dataForm.templateId ? "save" : "update"}`
            ),
            method: "POST",
            data: this.$http.adornData(this.dataForm),
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
    },
  },
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
  .leftClass {
    width: 20%;
    min-height: 200px;
    float: left;
    // background: blanchedalmond;
  }
  .rightClass {
    width: 78%;
    min-height: 200px;
    float: right;
    // background: blanchedalmond;
  }
  li {
    list-style-type: none;
  }
  .tempContent {
    border: 1px solid #ccc;
    width: 100%;
    height: calc(100vh - 240px);
    .left {
      display: inline-block;
      width: 48%;
      height: 100%;
      border: 1px dashed #ccc;
      background: white;
    }
    .right {
      display: inline-block;
      width: 50%;
      height: 100%;
      border: 1px dashed #ccc;
      vertical-align: top;
      background: white;
    }
  }
}
</style>