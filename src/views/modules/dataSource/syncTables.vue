<template>
  <el-dialog
    title="同步表结构"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="formDialog"
    width="50%"
  >
   <el-form
      :inline="true"
      :model="dataForm"
   
      @submit.native.prevent
      style="padding:15px;"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.searchCtx"
          placeholder="表名"
          class="selectCtx"
        >
        </el-input>
      </el-form-item>
       <el-form-item>
        <el-input
          v-model="dataForm.searchCtx"
          placeholder="表描述"
          class="selectCtx"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
         <el-select v-model="dataForm.address" placeholder="请选择数类型">
          <el-option
            v-for="itm in typeOption"
            :key="itm.value"
            :label="itm.label"
            :value="itm.value"
          ></el-option>
        </el-select>
       <el-button @click="getDataList('search')" type="primary">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px" size="mini">
      <el-row>
        <el-col :span="12">
      <el-form-item label="部件名称" prop="partsDesc"  >
        <el-input v-model="dataForm.partsDesc" placeholder="部件名称" ></el-input>
      </el-form-item></el-col>
       <el-col :span="12">
      <el-form-item label="类型" prop="partsType">
        <el-select v-model="dataForm.partsType" placeholder="类型">
          <el-option v-for="item in typeOption" :label="item.label" :value="item.value" :key="item.label"></el-option>
        </el-select>
      </el-form-item></el-col>
       <el-col :span="12">
      <el-form-item label="显示标题" prop="isTitle">
        <el-select v-model="dataForm.isTitle" placeholder="人员分类">
          <el-option v-for="item in title" :label="item.label" :value="item.value" :key="item.label"></el-option>
        </el-select>
      </el-form-item></el-col>
       <el-col :span="12">
       <el-form-item label="可折叠" prop="isFold">
       <el-select v-model="dataForm.isFold" >
          <el-option v-for="item in fold" :label="item.label" :value="item.value" :key="item.label"></el-option>
          
        </el-select>
      </el-form-item></el-col>
    </el-row>
    <div class="datasour">
     <el-tabs v-model="activeName" >
    <el-tab-pane label="数据来源" name="first"><comDataSour @HideDia="HideDia"  /></el-tab-pane>
    <el-tab-pane label="展示模板" name="second">展示模板</el-tab-pane>
   
  </el-tabs>

    </div>
    </el-form> -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  data() {
    return {
      visible: false,
      activeName:'first',
      dataForm: {
         partsId: 0,
            partsDesc: "",
            partsType: "",
            isTitle: "1",
            isFold: "1",
           
      },
      fold:[
        {label:'是',value:'1'},
        {label:'否',value:'0'},
      ],
      title:[
         {label:'是',value:'1'},
        {label:'否',value:'0'},
      ],
      dataRule: {
        partsDesc: [{ required: true, message: "部件名称不能为空", trigger: "blur" }],
        partsType: [
          { required: true, message: "部件描述不能为空", trigger: "change" }
        ],
      },
      typeOption:[
        {label:'多值显示',value:'multip'},
         {label:'列表显示',value:'list'},
          {label:'标签显示',value:'tag'},
           {label:'图片轮播',value:'round'},
            {label:'档案访问记录',value:'record'},
             {label:'轨迹图',value:'track'},
              
      ],

     
    };
  },
  components:{
  
  },
  computed: {
 
  },
  watch: {
 
  },
  mounted(){
  this.visible=true;
  },
  methods: {  


    dataFormSubmit() {    
      console.log(this.dataForm,"dataFormSubmit");
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.visible = false;    
           this.$http({
            url: this.$http.adornUrl(
                `/daparts/${!this.dataForm.partsId ? "save" : "update"}`
            ),
            method: 'POST',
            data: this.$http.adornData(this.dataForm)
          }).then(({data}) => {
            if(data && data.code === 0){
              this.$message.success("操作成功")
              this.$emit('refreshDataList')
            }else{
              this.$message.error(data.msg)
            }
          })
        }
      });
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
.datasour{
  width:100%;
  min-height:400px;
 
}
}
</style>