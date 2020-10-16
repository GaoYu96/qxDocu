<template>
  <div>
    <el-form label-width="0px" size="mini" class="seniorSearchClass">
      <el-form-item
        style="height: auto !important;"
        v-for="condition in conditionItems"
        :key="condition.andCtx.keyOnly"
        class="formItem"
      >
        <el-checkbox :name="'checkSeniorSelect'+uuid" :label="condition" :checked="checked"></el-checkbox>
        <div style="margin-left: 10px;">
          <el-select v-model="condition.searchCtx" class="searchCtx">
            <el-option
              v-for="item in seniorSelect"
              :key="item.value+Math.random()"
              :label="item.label"
              :value="item.value"
              @click.native="changeFormState(item,condition)"
            ></el-option>
          </el-select>

          <el-select v-model="condition.configCtx" class="configCtx">
            <el-option
              v-for="(value,key) in condition.conditionOption"
              :key="key+Math.random()"
              :label="value.label"
              :value="key"
            ></el-option>
          </el-select>

          <el-input
            v-model="condition.inputCtx"
            placeholder="值"
            class="inputCtx"
            v-if="!condition.formChange"
            clearable
          ></el-input>
          <el-select multiple collapse-tags v-model="condition.inputCtx" clearable v-else>
            <el-option
              v-for="item in condition.db_options"
              :key="item.value+Math.random()"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <el-select v-model="condition.andCtx" class="andCtx">
            <el-option
              v-for="item in andCondition"
              :key="item.value+Math.random()"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-button type class="btnSty" @click="addSearchKey">添加</el-button>
      <el-button type="primary" plain class="btnSty" @click="seniorSearch">应用</el-button>
    </el-form>
  </div>
</template>

<script>
import encrypt from "@/utils/encrypt";
import uuidv1 from "uuid/v1";
export default {
  data() {
    return {
      uuid: "",
      checked: true,
      seniorSelect: [],
      visible: false,
      selected: true,
      conditionOption: {
        eq: { label: "等于", value: "(`@`=?)", type: "string" },
        not_eq: { label: "不等于", value: "(`@`!=?)", type: "string" },
        lt: { label: "小于", value: "(`@`<?)", type: "string" },
        leq: { label: "小于或等于", value: "(`@`<=?)", type: "string" },
        gt: { label: "大于", value: "(`@`>?)", type: "string" },
        geq: { label: "大于或等于", value: "(`@`>=?)", type: "string" },
        like: {
          label: "包含",
          value: "(`@` like ?)",
          pre: "%",
          post: "%",
          type: "string"
        }, //value=%xxx%
        not_like: {
          label: "不包含",
          value: "(`@` not like ?)",
          pre: "%",
          post: "%",
          type: "string"
        }, //value=%xxx%
        start_with: {
          label: "开始以",
          value: "(`@` like ?)",
          post: "%",
          type: "string"
        }, //value=xxx%
        not_start_with: {
          label: "开始不是以",
          value: "(`@` not like ?)",
          post: "%",
          type: "string"
        }, //value=xxx%
        end_with: {
          label: "结束以",
          value: "(`@` like ?)",
          pre: "%",
          type: "string"
        }, //value=%xxx
        not_end_with: {
          label: "结束不是以",
          value: "(`@` not like ?)",
          pre: "%",
          type: "string"
        }, //value=%xxx
        is_null: { label: "是null", value: "(`@` is null)", type: "none" }, // 没value
        not_null: {
          label: "不是null",
          value: "(`@` is not null)",
          type: "none"
        }, // 没value
        is_empty: {
          label: "是空的",
          value: "(`@` is null or trim(`@`)='')",
          type: "none"
        }, // 没value
        not_empty: {
          label: "不是空的",
          value: "(`@` is not null and trim(`@`)!='')",
          type: "none"
        }, // 没value
        in_list: { label: "在列表", value: "(`@` in (?))", type: "list" }, // type=list
        not_in_list: {
          label: "不在列表",
          value: "(`@` not in (?))",
          type: "list"
        } // type=list
      },
      allConditionOption: {},
      saveAllConditionOption: {},
      andCondition: [
        { label: "and", value: "and", keyOnly: Math.random() },
        { label: "or", value: "or", keyOnly: Math.random() },
        { label: "and not", value: "and not", keyOnly: Math.random() },
        { label: "or not", value: "or not", keyOnly: Math.random() }
      ],
      conditionItems: [
        { searchCtx: "", configCtx: "", inputCtx: "", andCtx: "" }
      ],
      checkVal: [],
      sqlStr: "",
      paramArr: [],
      seniorSearchUrl: "",
      formChange: false,
      db_options: [],
      mergeSeniorSearch: false,
      mergeSeniorObj: {
        sql: "",
        params: ""
      }
    };
  },
  created() {
    //获取随机id
    this.uuid = uuidv1();
  },
  methods: {
    init(_tableHeader, _seniorSearchUrl) {
      if (this.conditionItems[0].inputCtx) {
        return;
      }
      this.seniorSelect = [];
      this.allConditionOption = this.conditionOption;
      this.seniorSearchUrl = _seniorSearchUrl;
      for (let i = 0; i < _tableHeader.length; i++) {
        if (_tableHeader[i].db_prop === null) {
          continue;
        }
        let obj = {
          label: _tableHeader[i].label,
          value: _tableHeader[i].db_prop
            ? _tableHeader[i].db_prop
            : _tableHeader[i].prop,
          options: _tableHeader[i].db_options ? _tableHeader[i].db_options : []
        };
        this.seniorSelect.push(obj);
      }
      // 设置select初始值
      this.$set(
        this.conditionItems[0],
        "conditionOption",
        this.conditionOption
      );
      this.$set(this.conditionItems[0], "formChange", false);
      this.$set(
        this.conditionItems[0],
        "searchCtx",
        this.seniorSelect[0].value
      );
      this.$set(this.conditionItems[0], "configCtx", "eq");
      // 当select值是下来框时
      if (this.seniorSelect[0].options.length > 0) {
        this.$set(
          this.conditionItems[0],
          "db_options",
          this.seniorSelect[0].options
        );
        this.$set(
          this.conditionItems[0],
          "conditionOption",
          this.filterConditionOption(["eq", "not_eq", "in_list", "not_in_list"])
        );
        this.$set(this.conditionItems[0], "formChange", true);
      }
    },
    resetConditionItems() {
      this.conditionItems = [
        { searchCtx: "", configCtx: "", inputCtx: "", andCtx: "" }
      ];
    },
    // 改变表单状态
    changeFormState(item, searchCondition) {
      if (item.options.length) {
        searchCondition.formChange = true;
        searchCondition.db_options = [];
        searchCondition.db_options = item.options;
        searchCondition.conditionOption = this.filterConditionOption([
          "eq",
          "not_eq",
          "in_list",
          "not_in_list"
        ]);
      } else {
        searchCondition.formChange = false;
        searchCondition.inputCtx = "";
        searchCondition.db_options = [];
        searchCondition.conditionOption = this.allConditionOption;
      }
    },
    filterConditionOption(arr) {
      let obj = {};
      for (let key in this.allConditionOption) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === key) {
            obj[key] = this.allConditionOption[key];
          }
        }
      }
      return obj;
    },
    addSearchKey() {
      let obj = {
        searchCtx: this.seniorSelect[0].value,
        configCtx: "eq",
        inputCtx: "",
        andCtx: "",
        conditionOption: this.allConditionOption
      };
      this.conditionItems.push(obj);
      this.conditionItems[this.conditionItems.length - 2].andCtx = this
        .conditionItems[this.conditionItems.length - 2].andCtx
        ? this.conditionItems[this.conditionItems.length - 2].andCtx
        : this.andCondition[0].value;
    },
    handleClose() {
      this.visible = false;
    },
    seniorSearch() {
      this.checkVal = [];
      let obj = document.getElementsByName("checkSeniorSelect" + this.uuid);

      for (let k in obj) {
        if (obj[k].checked) {
          this.checkVal.push(obj[k]._value);
        }
      }
      // 处理参数 ===============================
      this.sqlStr = "";
      this.paramArr = [];

      for (let i = 0; i < this.checkVal.length; i++) {
        if (!this.checkVal[0].searchCtx) {
          break;
        }
        let getObjValue = this.conditionOption[this.checkVal[i].configCtx];

        let str = getObjValue.value;
        let searchInputCtx = "";
         console.log(str,getObjValue,"str,getObjValue");             // getObjValue: {label: "等于"      type: "string   value: "(`@`=?)"}
                                                                                   

        if (typeof this.checkVal[i].inputCtx === "string") {
          searchInputCtx = this.checkVal[i].inputCtx.replace(/，/g, ",");
        }
        if (typeof this.checkVal[i].inputCtx === "object") {
          for (let q = 0; q < this.checkVal[i].inputCtx.length; q++) {
            if (!searchInputCtx) {
              searchInputCtx = this.checkVal[i].inputCtx[q];
            } else {
              searchInputCtx += "," + this.checkVal[i].inputCtx[q];
            }
          }
        }
        str = str.replace(/@/g, this.checkVal[i].searchCtx);
          console.log(str,"str");                        //e.g.  (`ID`=?) str
        if (this.sqlStr) {
          this.sqlStr =
            this.sqlStr + " " + this.checkVal[i - 1].andCtx + " " + str;
        } else {
          this.sqlStr = str;
        }
           console.log(this.sqlStr,"this.sqlStr");
        if (getObjValue.type === "none") {
          continue;
        }
        if (getObjValue.type !== "none") {
          let paramObj = "";
          if (getObjValue.pre && getObjValue.post) {
            paramObj = {
              type: getObjValue.type,
              value: "%" + searchInputCtx + "%"
            };
          }
          if (
            (getObjValue.pre && !getObjValue.post) ||
            (!getObjValue.pre && getObjValue.post)
          ) {
            paramObj = {
              type: getObjValue.type,
              value: getObjValue.pre
                ? "%" + searchInputCtx
                : searchInputCtx + "%"
            };
          }
          if (!getObjValue.pre && !getObjValue.post) {
            paramObj = {
              type: getObjValue.type,
              value: searchInputCtx
            };
          }
          this.paramArr.push(paramObj);
        }
      }
      // 处理参数 ===============================

      // 合并超级查询条件（用在基于某高级查询条件下 再进行高级查询）
      if (this.mergeSeniorSearch && this.paramArr.length) {
        this.sqlStr = this.mergeSeniorObj.sql
          ? this.sqlStr + " and " + this.mergeSeniorObj.sql
          : this.sqlStr;
        if (this.mergeSeniorObj.params.length) {
          this.paramArr.push(this.mergeSeniorObj.params[0]);
        }
      } else if (this.mergeSeniorObj.params.length) {
        this.sqlStr = this.mergeSeniorObj.sql;
        this.paramArr = this.mergeSeniorObj.params;
      }
      console.log(this.sqlStr, this.paramArr);

      this.$emit(
        "getSeniorData",
        {
          sql: encrypt.jiami(this.sqlStr),
          params: encrypt.jiami(this.paramArr)
        },
        { sql: this.sqlStr, params: this.paramArr }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .seniorSearchClass {
    .formItem {
      .el-checkbox__label {
        display: none;
      }
    }
    .el-form-item__content {
      display: flex;
      justify-content: flex-start;
    }
    .el-form-item {
      margin-bottom: 5px;
    }
    .searchCtx {
      width: 150px;
    }
    .configCtx {
      width: 120px;
    }
    .inputCtx {
      width: 180px;
    }
    .andCtx {
      width: 100px;
    }
    .btnSty {
      margin: 10px 8px 10px 0px;
    }
    .el-input__suffix-inner {
      pointer-events: auto;
      z-index: 99999999999 !important;
    }
  }
}
</style>