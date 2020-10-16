<template>
  <el-dialog
    title='新增'
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="formDialog"
    width="50%"
  >
    <el-form  label-width="120px" size="mini">
       <div class="upper">
          <el-input
          v-model="redListText"
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 120}"
          placeholder="每行输入一个红名单"
        ></el-input>
       </div>
    <div class="datasour">
    <el-form-item>
        
          <span>添加所选</span>
          <el-select v-model="redListPara.level" placeholder="请选择类型" class="selClass">
          <el-option
            v-for="itm in levelOption"
            :key="itm.value"
            :label="itm.label"
            :value="itm.value"
          ></el-option>
        </el-select>

      </el-form-item>
 <el-form-item>
        
          <span>限制选项</span>
          <el-radio v-model="radio" label="1">红名单替换</el-radio>
  <el-radio v-model="radio" label="0">限制查询</el-radio>
  

      </el-form-item>
      <span style="color:red;margin-left:120px;">限制查询为限制入口参数值进行查询</span>
    </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import MTable from '@/components/table.vue'
export default {
  data() {
    return {
      visible: false,
      activeName:'first',
      radio:'1',
     
       levelOption:[
          {label:'一级/一般敏感级',value:'1'},
          {label:'二级/敏感级',value:'2'},
          {label:'三级/核心敏感级',value:'3'},
      ],
      dataList:[],
      redListText:'',
      redListPara:{
        id:0,
        keyword:'',
        keywords:[],
        level:'',
        rule:''
      }
      

     
    };
  },
  components:{
 MTable,
  },
  computed: {
 
  },
  watch: {
 
  },
  methods: {  
    init(_row) {
      this.visible = true;
   

    },

    dataFormSubmit() {    
      this.redListPara.keywords=this.redListText.split((/[\s\n]/))
       this.redListPara.rule=this.radio
      console.log(this.redListPara);
          this.visible = false;    
           this.$http({
            url: this.$http.adornUrl(
               "/sensitiveInfo/save"
            ),
            method: 'POST',
            data: this.$http.adornData(this.redListPara)
          }).then(({data}) => {
            if(data && data.code === 0){
              this.$message.success("添加成功")
              this.$emit('refreshDataList')
            }else{
              this.$message.error(data.msg)
            }
          })
        
      
    },
    HideDia(){
      this.visible = false
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
    vertical-align:bottom;
    // margin-bottom: 5px;
    height:28px;
  
}
.el-input--mini {
    font-size: 12px;
    vertical-align:bottom;
    // outline:none;
}
.upper{
    width:100%;
  min-height:300px;
  // background: blanchedalmond;
}
.datasour{
  width:100%;
  min-height:200px;
  margin-top: 10px;
 
}
.selClass{
    width:150px;
    margin-left: 10px;
}
}
</style>