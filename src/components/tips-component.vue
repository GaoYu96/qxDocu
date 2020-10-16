<template>
  <span>
    <span v-if="tipsObj.labelName">{{tipsObj.labelName}}</span>
    <el-tooltip class="item" effect="dark" placement="top-start">
      <div slot="content">
        <span v-html="tipsObj.tipsContent"></span>
      </div>
      <i class="fa fa-question-circle"></i>
    </el-tooltip>
  </span>
</template>

<script>
export default {
  props:{
    tipsObj: Object
  }
}
</script>