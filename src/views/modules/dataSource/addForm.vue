<template>
  <el-dialog
    title='新增'
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="formDialog"
  >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px" size="mini">
      <el-form-item label="数据源名称" prop="name"  >
        <el-input v-model="dataForm.name" placeholder="数据源名称" ></el-input>
      </el-form-item>
      <el-form-item label="数据源类型" prop="type">
        <!-- <el-input v-model="dataForm.tblType" placeholder="数据源类型"></el-input> -->
         <el-select v-model="dataForm.type" filterable >
          <el-option v-for="itm in dataResourceSelect" :key="itm.label" :label="itm.label" :value="itm.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据源描述" prop="desc">
        <el-input v-model="dataForm.desc" placeholder="数据源描述"></el-input>
      </el-form-item>
        <el-form-item prop="connUrl" v-if="showConnConfig && !showSysConfig">
        <label slot="label">
          <tips-component :tipsObj="conneUrlTipsObj"></tips-component>
        </label>
        <el-input v-model="dataForm.connUrl" placeholder="连接URL"></el-input>
      </el-form-item>
      <el-form-item label="连接用户" prop="connUser" v-if="showConnConfig">
        <el-input v-model="dataForm.connUser" placeholder="连接用户"></el-input>
      </el-form-item>
      <el-form-item label="连接密码" prop="connPasswd" v-if="showConnConfig && notEdit">
        <el-input class="pwdSty" :type="showPwd?'text':'password'" v-model="dataForm.connPasswd" placeholder="连接密码"></el-input>
        <i :class="['fa pwdEye', showPwd?'fa-eye':'fa-eye-slash']" @click="showPwd=!showPwd"></i>
      </el-form-item>
      
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import TipsComponent from '@/components/tips-component';
export default {
  data() {
    return {
      visible: false,
       showConnConfig: false,
      showSysConfig: false,
      showProjectConfig: false,
      showHIVEConfig: false,
      notEdit:false,
      // dataForm: {
      //    name: "",
      //       kind: "",
      //       description: "",
           
        
      //       sjly:"",
      //       system:"",
           
      // },
      dataForm: {
        ID: 0,
        name: "",
        desc: "",
        type: "",
        connUser: "",
        connPasswd: "",
        connUrl: "",
        connConf: {},
        delSts: "",
        
      },
         dataResourceSelect: [
        {label: 'MYSQL', value: 'MYSQL'},
        {label: 'ORACLE', value: 'ORACLE'},
        {label: 'ORACLE11g', value: 'ORACLE11g'},
        {label: 'ODPS', value: 'ODPS'},
        {label: 'DB2', value: 'DB2'},
        {label: 'HIVE', value: 'HIVE'},
        {label: 'DERBY', value: 'DERBY'},
        {label: 'PHOENIX', value: 'PHOENIX'},
        {label: 'FILESYS', value: 'FILESYS'},
        {label: 'SQLSERVER', value: 'SQLSERVER'},
        {label: 'SQLSERVER2000', value: 'SQLSERVER2000'},
        {label: 'POSTGRESQL', value: 'POSTGRESQL'},
        {label: '达梦7', value: 'DM7'},
        {label: '达梦8', value: 'DM8'},
        {label: 'GAUSS', value: 'GAUSS'},
        {label: 'TiDB', value: 'TiDB'},
      ],
      dataRule: {
        name: [{ required: true, message: "数据源名称不能为空", trigger: "blur" }],
        type: [{ required: true, message: "数据源类型不能为空", trigger: "change" }],
        desc: [{ required: true, message: "数据源描述不能为空", trigger: "blur" }],
        
      },
            conneUrlTipsObj:{
        labelName: '连接URL',
        tipsContent: ''
      },


    };
  },
    components:{
    TipsComponent
  },
  computed: {
    type(){
      return this.dataForm.type
    }
  },
   watch: {
    type(newVal, oldVal) {
      this.$refs['dataForm'].clearValidate();
      if(newVal == "FILESYS"){
        this.showSysConfig = true
        this.showConnConfig = true
        this.showProjectConfig = false
        this.showHIVEConfig = false
      }
      else if(newVal == "ODPS"){
        this.showProjectConfig = true
        this.showConnConfig = false
        this.showSysConfig = false
        this.showHIVEConfig = false
        if(!this.dataForm.ID){
          this.$set(this.dataForm,'connUrl','http://<host>/api')
        }
      }
      else if(newVal !== ""){
        this.showHIVEConfig = false
        switch (newVal) {
          case 'MYSQL': 
          console.log("mysql");
              this.conneUrlTipsObj.tipsContent = "连接示例：jdbc:mysql://127.0.0.1:3306/test?characterEncoding=utf8";
              if(!this.dataForm.ID){
                this.dataForm.connUrl = 'jdbc:mysql://<ip>:<port>/<database>?characterEncoding=utf8';
              }
              break;
          case 'ORACLE': 
              if(!this.dataForm.ID){
                this.dataForm.connUrl = 'jdbc:oracle:thin:@//<ip>:<port>/<serverName>';
              }
              this.conneUrlTipsObj.tipsContent = `
                连接示例：<br/>
                sid连接方式：jdbc:oracle:thin:@127.0.0.1:1521:sid <br/>
                serverName连接方式：jdbc:oracle:thin:@//127.0.0.1:1521/serverName`;
              break;
          case 'DB2': 
              if(!this.dataForm.ID){
                this.dataForm.connUrl = 'jdbc:db2://<ip>:<port>/<database>';
              }
              this.conneUrlTipsObj.tipsContent = `连接示例：jdbc:db2://localhost:50000/SAMPLE`;
              break;
          case 'DERBY': 
              if(!this.dataForm.ID){
                this.dataForm.connUrl = 'jdbc:derby://<ip>:<port>/<database>';
              }
              this.conneUrlTipsObj.tipsContent = `连接示例：jdbc:derby://localhost:1527/emp`;
              break;
          case 'ORACLE11g': 
              if(!this.dataForm.ID){
                this.dataForm.connUrl = 'jdbc:oracle:thin:@//<ip>:<port>/<serverName>';
              }
              this.conneUrlTipsObj.tipsContent = `
                连接示例：<br/>
                sid连接方式：jdbc:oracle:thin:@127.0.0.1:1521:sid <br/>
                serverName连接方式：jdbc:oracle:thin:@//127.0.0.1:1521/serverName`;
              break;
          case 'HIVE': 
              if(!this.dataForm.ID){
                this.dataForm.connUrl = 'jdbc:hive2://<ip>:<port>,<ip>:<port>';
              }
              this.showHIVEConfig = true;
              this.conneUrlTipsObj.tipsContent = `
                连接示例： 集群连接：jdbc:hive2://127.0.0.1:24002,127.0.0.2:24002,127.0.0.3:24002/;serviceDiscoveryMode=zooKeeper;zooKeeperNamespace=hiveserver2;sasl.qop=auth-conf; auth=KERBEROS;principal=hive/hadoop.hadoop.com@HADOOP.COM <br/>
                简单连接：jdbc:hive2://127.0.0.1:10000,127.0.0.2:10000 `
              break;
          case 'SQLSERVER': 
              if(!this.dataForm.ID){
                this.dataForm.connUrl = 'jdbc:microsoft:sqlserver://<ip>:<port>';
              }
              this.conneUrlTipsObj.tipsContent = `
                连接示例： sqlServer2000：jdbc:microsoft:sqlserver://127.0.0.1:1433 <br/>
                sqlserver2005+：jdbc:sqlserver://127.0.0.1:1433`
              break;
          case 'SQLSERVER2000': 
              if(!this.dataForm.ID){
                this.dataForm.connUrl = 'jdbc:microsoft:sqlserver://<ip>:<port>';
              }
              this.conneUrlTipsObj.tipsContent = `
                连接示例： sqlServer2000：jdbc:microsoft:sqlserver://127.0.0.1:1433 <br/>
                sqlserver2005+：jdbc:sqlserver://127.0.0.1:1433`
              break;
          case 'POSTGRESQL': 
              if(!this.dataForm.ID){
                this.dataForm.connUrl = 'jdbc:postgresql://<ip>:<port>/<database>';
              }
              this.conneUrlTipsObj.tipsContent = "连接示例：jdbc:postgresql://127.0.0.1:5432/test"
              break;
          case 'DM7': 
              this.conneUrlTipsObj.tipsContent = "连接示例：jdbc:dm://localhost:5236";
              if(!this.dataForm.ID){
                this.dataForm.connUrl = 'jdbc:dm://<ip>:<port>';
              }
              break;
          case 'DM8': 
              this.conneUrlTipsObj.tipsContent = "连接示例：jdbc:dm://localhost:5236";
              if(!this.dataForm.ID){
                this.dataForm.connUrl = 'jdbc:dm://<ip>:<port>';
              }
              break;
          case 'GAUSS': 
              if(!this.dataForm.ID){
                this.dataForm.connUrl = 'jdbc:postgresql://<ip>:<port>/<database>';
              }
              this.conneUrlTipsObj.tipsContent = "连接示例：jdbc:postgresql://127.0.0.1:5432/test"
              break;
          case 'TiDB': 
              this.conneUrlTipsObj.tipsContent = "连接示例：jdbc:dm://localhost:5236";
              if(!this.dataForm.ID){
                this.dataForm.connUrl = 'jdbc:dm://<ip>:<port>';
              }
              break;
          case 'PHOENIX': 
              if(!this.dataForm.ID){
                this.dataForm.connUrl = 'jdbc:phoenix:<host>:<port>/<dbname>';
              }
              this.showHIVEConfig = true;
              this.conneUrlTipsObj.tipsContent = `jdbc:phoenix:cdh150:2181/hbase`
              break;
        }
        this.showConnConfig = true        
        this.showProjectConfig = false
        this.showSysConfig = false
      }
    }
  },
  methods: {  
    init() {
      this.visible = true;
        this.$nextTick(() => {
        this.notEdit = true
        this.$refs['dataForm'].clearValidate();
        this.$refs["dataForm"].resetFields();
        this.dataForm.connUser = '';
        this.dataForm.connPasswd = '';
        this.dataForm.connUrl = '';
        this.showProjectConfig = false
        this.showConnConfig = false
        this.showSysConfig = false
        this.showHIVEConfig = false
        // if (this.dataForm.ID) {
        //   // this.notEdit = false
        //   this.dataForm.connUser = '';
        //   this.dataForm.connPasswd = '';
        //   this.dataForm.connUrl = '';
        //   this.$http({
        //     url: this.$http.adornUrl(
        //       `/meta/datasource/info/${this.dataForm.ID}`
        //     ),
        //     method: "get",
        //     params: this.$http.adornParams()
        //   }).then(({ data }) => {
        //     if (data && data.code === 0) {
        //       let connConf = JSON.parse(data.metaDatasource.connConf)
        //       this.dataForm.dsName = data.metaDatasource.name;
        //       this.dataForm.dsDesc = data.metaDatasource.desc;
        //       this.dataForm.type = data.metaDatasource.type;
        //       this.dataForm.connUser = data.metaDatasource.connUser;
        //       this.dataForm.connUrl = data.metaDatasource.connUrl;
        //       if(this.dataForm.type === "ODPS"){
        //         this.dataForm.project = connConf.project
        //       }else if(this.dataForm.type === "FILESYS"){
        //         this.dataForm.sysType = connConf.sysType
        //         this.dataForm.hostname = connConf.hostname
        //         this.dataForm.port = connConf.port
        //         this.dataForm.rootPath = connConf.rootPath
        //       }else if(this.dataForm.type === "HIVE"){
        //         this.dataForm.isKerberos = connConf.isKerberos
        //       }else if(this.dataForm.type === "PHOENIX"){
        //         this.dataForm.isKerberos = connConf.isKerberos
        //       }
        //       this.dataForm.delSts = data.metaDatasource.delSts;
        //       this.dataForm.updated = data.metaDatasource.updated;
        //     }
        //   });
        // }
      });
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].resetFields()
    //     if (_row) {
    //       this.dataForm = {
    //         fxzId:_row.fxzId,
    //         rowkey: _row.rowkey,
    //         xm: _row.xm,
    //         gmsfhm: _row.gmsfhm,
    //         zw: _row.zw,
    //         ryfl: _row.ryfl,
    //         sjly:_row.sjly,
    //         lxdh:_row.lxdh,
    //       }
    //       console.log(this.dataForm);
    //     } 
    //     else{
    //       this.dataForm.rowkey=0
    //        console.log(this.dataForm);
    //     }
    //   });

      // if(_row){
      //   this.dataForm = JSON.parse(JSON.stringify(_row))
      // }

      // 获取数据源
      //   this.$http({
      //     url: this.$http.adornUrl('/meta/datasource/list'),
      //     method: 'post',
      //     data: this.$http.adornData({
      //       limit: 99999999,
      //       page: 1,
      //       searchCtx: ''
      //     },false)
      //   }).then(({data}) => {
      //     if (data && data.code === 0) {
      //       this.lyDsOptions = data.page.list
      //     }
      //   })
    },

    dataFormSubmit() {    
    
      
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
        let connConfParams = {}
          if(this.dataForm.type === "ODPS"){
            connConfParams.project = this.dataForm.project
          }else if(this.dataForm.type === "FILESYS"){
            connConfParams.sysType = this.dataForm.sysType
            connConfParams.hostname = this.dataForm.hostname
            connConfParams.port = this.dataForm.port
            connConfParams.rootPath = this.dataForm.rootPath
            this.dataForm.connUrl = ''
          }else if(this.dataForm.type === "HIVE"){
            connConfParams.isKerberos = this.dataForm.isKerberos
          }else if(this.dataForm.type === "PHOENIX"){
            connConfParams.isKerberos = this.dataForm.isKerberos
          }else{
            connConfParams = {}
          }
          this.visible = false;
            console.log(this.dataForm,"dataFormSubmit");
           this.$http({
            url: this.$http.adornUrl(
               '/meta/datasource/save'
            ),
            method: 'POST',
            data: this.$http.adornData({
              id: this.dataForm.ID || undefined,
              name: this.dataForm.name,
              desc: this.dataForm.desc,
              type: this.dataForm.type,
              connUser: this.dataForm.connUser,
              connPasswd: this.dataForm.connPasswd,
              connUrl: this.dataForm.connUrl,
              connConf: JSON.stringify(connConfParams),
              // updated: this.dataForm.updated,
              delSts: this.dataForm.delSts,
            })
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
    font-size: 14px;
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
}
</style>