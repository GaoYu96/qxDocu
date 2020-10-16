<template>
  <div>
      
 <div style="background-color:WhiteSmoke;">
    <div style="background-color:#1aa194;">{{formData.patrs.partsDesc}}</div>

    <el-form label-width="100px" size="mini">
      <el-form-item
        v-for="(item, index) in formData.tableList"
        :key="index"
        :label="item.tableInfo.showName"
        :prop="item.tableInfo.showName"
      >
        <el-input v-model="item.tableInfo.colName" disabled></el-input>
      </el-form-item>
    </el-form>
  </div>
  </div>
</template>

<script>
export default {
  name: "m-form",
  props: {
    formData: {
      // 数据
      type: Object
    }
  },
  watch: {},
  data() {
    return {
      tableRadio: "",
      checked: null,
      dataListSelections: [],
      inputRefreshTime: 10,
      inputRefreshTimeChecked: false
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>