<template>
  <!-- 弹框外壳，通过插槽填充弹框内容 -->
  <div>
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="clickModalClose"
      :visible.sync="visible"
      :top="dialogTop"
    >
      <slot name="formContent"></slot>
      <div class="footer">
        <slot name="formFooter"></slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false
    };
  },
  props: {
    dialogTitle: {
      //弹框 Title
      type: String,
      default: "详情"
    },
    dialogTop: {
      //弹框 顶部位置
      type: String
    },
    clickModalClose: {
      //是否 点击灰色遮罩关闭弹框
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .footer {
    margin-top: 10px;
    text-align: right;
  }
}
</style>