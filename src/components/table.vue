<template>
  <div>
    <el-table 
      :data="tableData" 
      border
      @selection-change="selectionChangeHandle"
      :row-style="getAllRow"
      ref="multipleTable"
      @row-click="handleRowClick"
      :header-cell-style="getRowClass"
      :cell-style="getCell"
      :height="tableHeight"
      @current-change="clickChange"
      
    >
    <el-table-column label="" width="55" v-if="selectOne" fixed>
　　　　<template slot-scope="scope">
　　　　　　<el-radio v-model="tableRadio" :label="scope.row"><i></i></el-radio>
　　　　</template>
　　</el-table-column>
      <el-table-column type="selection" v-if="hasSelection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column type="index" v-if="hasIndex" label="序号" fixed width="50"></el-table-column>
      <template v-for="item in tableHeader">
        <!-- 自定义列  ： 需要自定义列， tableHeader 要响应配置 slot：true -->
        <el-table-column
          v-if="item.slot"
          header-align="center"
          align="center"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
          :sortable="item.sortable"
          :fixed="item.fixed"
          :show-overflow-tooltip="!item.noTips"
        >
          <template slot-scope="scope">
            <slot :name="item.prop" :row="scope.row"></slot>
          </template>
        </el-table-column>

        <el-table-column
          v-else
          header-align="center"
          align="center"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :sortable="item.sortable"
          :fixed="item.fixed"
          :show-overflow-tooltip="!item.noTips"
        >
        </el-table-column>       
      </template>
      
      <!--操作-->
      <slot name="handleColumn"></slot>
    </el-table>
    <div class="page_foot_box" v-if="showPage">
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageConfig.pageIndex"
        :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
        :page-size="pageConfig.pageSize"
        :total="pageConfig.totalCount"
        :layout="pageLayout"
      ></el-pagination>
      <div class="refreshTimeBox" v-if="showTimer">
        &nbsp;
        <el-checkbox v-model="inputRefreshTimeChecked" @change="refreshFun"></el-checkbox>
        <el-input v-model="inputRefreshTime" size="mini" @change="timerChange"></el-input>秒，定时刷新
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'm-table',
  props: {
    tableHeader: { //相应字段的基本配置
      type: Array,
      default: ()=>{
        return []
      }
    },
    tableData: { //表格数据
      type: Array,
      default: ()=>{
        return []
      }
    },
    tableHeight: { //表格高度
      type: Number,
      default: ()=>{
        return window.innerHeight - 250
      }
    },

    hasSelection: { //表格是否有复选框
      type: Boolean,
      default: ()=>{
        return true
      }
    },
    selectOne:{ //表格是否有单选框
      type: Boolean,
      default: ()=>{
        return false
      }
    },
   
    hasIndex: { //表格是否有序号
      type: Boolean,
      default: ()=>{
        return true
      }
    },
    showPage: { // 是否显示分页
      type: Boolean,
      default: ()=>{
        return false
      }
    },
    pageConfig: { // 分页配置参数
      type: Object,
      default: ()=>{
        return{
          pageIndex: 1,
          pageSize: 20,
          totalCount: 0,
        }
      }
    },
    showTimer: {
      type: Boolean,
      default: ()=>{
        return false
      }
    },
    pageLayout: {
      type: String,
      default: ()=>{
        return 'total, sizes, prev, pager, next, jumper'
      }
    },
    refreshTimeChecked:{
      type: Boolean,
      default: ()=>{
        return false
      }
    },
    refreshTime: {
      type: Number,
      default: ()=>{
        return 10
      }
    }
  },
  watch:{
    refreshTime(newval,oldval){ //监听到父组件传来的数据更新
      this.inputRefreshTime = newval
    },
    refreshTimeChecked(newval,oldval){ //监听到父组件传来的数据更新
      this.inputRefreshTimeChecked = newval
    }
  },
  data(){
    return{
      tableRadio:'',
      checked: null,
      dataListSelections: [],
      inputRefreshTime: 10,
      inputRefreshTimeChecked: false
    }
  },
  methods:{
     clickChange(item){              //单选
        this.tableRadio = item
        // console.log(item);
        this.$emit('updateOneSelections', item)
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
      //更新数据到父组件
      this.$emit('updateDataListSelections', this.dataListSelections)
    },
    // 点击行选中
    handleRowClick(row, column,event){
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    getRowClass({ row, rowIndex}) {
      // 表格头部样式
      return "font-size: 12px; text-align:center; background-color:#eef1f7; padding: 4px 0px;";
    },
    getAllRow(){
      // 设置行样式
      return " font-size: 12px; ";
    },
    getCell(){
      // 单元格样式
      return 'text-align:center; padding: 0px; '
    },
    sizeChangeHandle(val){
      // console.log(val);
      this.$emit('sizeChangeHandle', val)
    },
    currentChangeHandle(val){
      // console.log(val);
      this.$emit('currentChangeHandle', val)
    },
    refreshFun(){
      // 更新父组件的 refreshTimeChecked 数据
      this.$emit('update:refreshTimeChecked', this.inputRefreshTimeChecked)
      // 触发定时刷新方法
      this.$emit('refreshFun')
    },
    timerChange(){
      // 更新父组件的 refreshTime 数据
      this.$emit('update:refreshTime', Number(this.inputRefreshTime))
    }
  }
}
</script>

<style lang="scss" scoped>
</style>