<template>
  <div :class="inputId+'selectBox'">
    <div class="inputSty">
      <input type="text" v-model="inputVal" :ref="inputId" style="width: 100%;" @focus="focusEven" />
      <i class="fa fa-close" v-if="showReset" @click="resetInput"></i>
    </div>
    <ul class="mUl" v-if="showSelect" @click="selectClick">
      <slot name="li" :slotData="{options, activeLi}"></slot>
      <!-- <li :class="{ 'activeLiClass': activeLi===item }" :style="item.label?'background:none !important; cursor:auto;':''" v-for="item in options" @click="selectClickEven(item.NBBSF,item.BSF,item.ZWMC)" :key="item.NBBSF">
        {{item.NBBSF?'['+item.NBBSF+']'+item.BSF+'('+item.ZWMC+')':item.label}}
      </li>-->
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputVal: "",
      options: [],
      showSelect: false,
      activeLi: "",
      count: 0,
      showReset: false,
      isClose: false
    };
  },
  props: {
    allOptions: {
      //所有select数据
      type: Array,
      default: () => {
        return [];
      }
    },
    inputId: {
      type: String,
      default: () => {
        return (
          "s" + (Math.floor(Math.random() * (9999 - 1000)) + 1000).toString()
        );
      }
    }
  },
  watch: {
    inputVal(newVal, oldVal) {
      if (newVal == "" && !this.isClose) {
        this.showSelect = true;
        this.showReset = false;
        this.options = JSON.parse(JSON.stringify(this.allOptions));
        return;
      }
      if (newVal) {
        this.filterSelect();
      }
    }
  },
  mounted() {
    if (this.inputId) {
      //input绑定键盘事件==============
      this.$refs[this.inputId].removeEventListener("keydown", this.keyDownEven);
      this.$refs[this.inputId].addEventListener("keydown", this.keyDownEven);
      //input绑定键盘事件==============
      document.body.removeEventListener("click", this.hiddenUl);
      document.body.addEventListener("click", this.hiddenUl);
    }
  },
  methods: {
    focusEven() {
      this.count = 0;
      this.isClose = false;
      this.$refs[this.inputId].removeEventListener("keydown", this.keyDownEven);
      this.$refs[this.inputId].addEventListener("keydown", this.keyDownEven);
      document.body.removeEventListener("click", this.hiddenUl);
      document.body.addEventListener("click", this.hiddenUl);
      this.showSelect = true;
      if (this.inputVal) {
        this.showReset = true;
      }
      this.options = JSON.parse(JSON.stringify(this.allOptions));
    },
    resetInput() {
      this.inputVal = "";
      this.$emit("selectClickEven", "");
    },
    selectClick(e) {
      let targetText = e.target.innerHTML;
      if (targetText.indexOf("无匹配数据") == -1 && targetText) {
        this.inputVal = targetText;
        this.$emit("selectClickEven", targetText);
        this.showSelect = false;
      } else {
        this.inputVal = "";
      }
    },
    filterSelect() {
      if (this.inputVal) {
        this.showReset = true;
      }
      let arr = JSON.parse(JSON.stringify(this.allOptions));
      let endArr = this.compareData(arr);
      if (!endArr.length) {
        endArr.push({ label: " 无匹配数据" });
      }
      this.count = 0;
      this.options = endArr;
    },
    compareData(_arr) {
      let keyword = this.inputVal.toLocaleLowerCase();
      let endArr = [];
      for (let i = 0; i < _arr.length; i++) {
        if (
          _arr[i].NBBSF.toLocaleLowerCase().indexOf(keyword) > -1 ||
          _arr[i].ZWMC.indexOf(keyword) > -1 ||
          _arr[i].BSF.toLocaleLowerCase().indexOf(keyword) > -1
        ) {
          endArr.push(_arr[i]);
        }
      }
      return endArr;
    },
    keyDownEven(e) {
      if (e.code === "ArrowDown") {
        //下键
        this.count++;
        if (this.count > this.options.length) {
          //到底部的时候回到第一个
          this.count = 1;
        }
        this.activeLi = this.options[this.count - 1];
        setTimeout(() => {
          let activeLiPosition = document.getElementsByClassName(
            "activeLiClass"
          )[0].offsetTop;
          let ulHeight = document.getElementsByClassName("mUl")[0].offsetHeight;
          let ulDiv = document.getElementsByClassName("mUl")[0];

          if (ulDiv.scrollTop + ulDiv.clientHeight === ulDiv.scrollHeight) {
            ulDiv.scrollTop = 0;
          }
          if (activeLiPosition + 11 > ulHeight + ulDiv.scrollTop) {
            ulDiv.scrollTop = ulDiv.scrollTop + 24;
          }
        }, 100);
      } else if (e.code === "ArrowUp") {
        //上键
        this.count--;
        if (this.count < 1) {
          //到顶部的时候，回到最后一个
          this.count = this.options.length;
        } else if (this.count > this.options.length) {
          this.count = 1;
        }
        this.activeLi = this.options[this.count - 1];

        setTimeout(() => {
          let activeLiPosition = document.getElementsByClassName(
            "activeLiClass"
          )[0].offsetTop;
          let ulHeight = document.getElementsByClassName("mUl")[0].offsetHeight;
          let ulDiv = document.getElementsByClassName("mUl")[0];
          if (activeLiPosition + 24 === ulDiv.scrollHeight) {
            ulDiv.scrollTop = ulDiv.scrollHeight - ulDiv.clientHeight;
          } else {
            if (activeLiPosition < ulHeight + ulDiv.scrollTop) {
              ulDiv.scrollTop = ulDiv.scrollTop - 24;
            }
          }
        }, 100);
      } else if (e.code === "Enter") {
        //回车赋值
        let selectText = document.getElementsByClassName("activeLiClass")[0]
          .innerHTML;
        this.inputVal = selectText;
        this.showSelect = false;
        this.$emit("selectClickEven", selectText);
      }
    },
    hiddenUl(e) {
      if (document.querySelector("." + this.inputId + "selectBox")) {
        if (
          !document
            .querySelector("." + this.inputId + "selectBox")
            .contains(e.target)
        ) {
          this.showSelect = false;
        }
      }
    },
    destroy() {
      this.showSelect = null;
      this.showReset = null;
      this.isClose = null;
      this.inputVal = null;
      if (this.$refs[this.inputId]) {
        this.$refs[this.inputId].removeEventListener(
          "keydown",
          this.keyDownEven
        );
        document.body.removeEventListener("click", this.hiddenUl);
      }
    }
  },
  beforeDestroy() {
    this.destroy();
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .inputSty {
    position: relative;
    .fa-close {
      position: absolute;
      right: 0px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      border: 1px solid;
      border-radius: 50%;
      background: #b6bac3;
      color: #efefef;
      width: 15px;
      height: 15px;
      font-size: 1px;
      text-align: center;
    }
  }
  .mUl {
    position: absolute;
    max-height: 292px;
    overflow: auto;
    width: 350px;
    background: #fff;
    padding: 0 4px;
    border: 1px solid #ccc;
    margin: 0px;
    z-index: 999;
    li:hover,
    .activeLiClass {
      color: #333;
      background: #91e4dc;
      cursor: pointer;
    }
  }
}
</style>
