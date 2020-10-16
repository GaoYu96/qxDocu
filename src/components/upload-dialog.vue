<template>
  <div>
    <el-dialog
      :title="dialogName"
      :visible.sync="visible"
      class="uploadDialogSty"
      :before-close="handleClose"
    >
      <el-form label-width="100px" size="mini" class="uploadFormSty">
        <el-form-item label="模板下载:" style="height: auto !important;" v-if="!deleteTemplate">
          <el-button type="primary" @click="downFile">excel</el-button>
        </el-form-item>
        <el-form-item label="选择文件:" style="height: auto !important;">
          <el-upload
            class="upload-demo"
            ref="upload"
            :file-list="fileList"
            :headers="uploadHeaders"
            :action="baseURL+importURL"
            :auto-upload="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :limit="limit"
          >
            <el-button slot="trigger" size="small" type="primary">浏览文件</el-button>
            <div class="el-upload__tip" slot="tip">只能上传excel文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false; fileList=[];">取消</el-button>
        <el-button type="primary" @click="uploadFile()">上传</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { binarySwitch } from "@/utils";

export default {
  data() {
    return {
      visible: false,
      templateExportURL: "",
      importURL: "",
      uploadHeaders: {
        Authorization: document.cookie.replace(
          /(?:(?:^|.*;\s*)Authorization\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        )
      },
      baseURL:
        process.env.NODE_ENV !== "production"
          ? "/proxyApi"
          : window.SITE_CONFIG.baseUrl,
      fileList: [],
      limit: 1
    };
  },
  props: {
    dialogName: String,
    deleteTemplate: Boolean
  },
  methods: {
    init(_templateExportURL, _importURL) {
      //模板下载  导入
      this.visible = true;
      this.templateExportURL = _templateExportURL;
      this.importURL = _importURL;
    },
    downFile() {
      //模板下载
      let param = [{ name: "temp", value: true }];
      this.$http({
        url: this.$http.adornUrl(this.templateExportURL),
        method: "post",
        params: this.$http.adornParams({
          temp: true
        }),
        headers: {
          "Content-Type": "application/json; application/octet-stream"
        },
        responseType: "arraybuffer"
      }).then(data => {
        binarySwitch(data);
      });
    },
    // 上传文件
    uploadFile() {
      this.$refs.upload.submit();
    },
    uploadSuccess(val) {
      if (val.msg === "success") {
        this.$message({
          message: "导入成功",
          type: "success",
          duration: 1500
        });
        this.visible = false;
        this.fileList = [];
        this.$emit("refreshDataList");
      } else {
        this.$message({
          message: val.msg,
          type: "error",
          duration: 1500
        });
        this.visible = false;
        this.fileList = [];
        this.$emit("refreshDataList");
      }
    },
    uploadError(val) {
      console.log(val);
      this.$message({
        message: "导入失败",
        type: "error",
        duration: 1500
      });
      this.visible = false;
    },
    handleClose() {
      this.fileList = [];
      this.visible = false;
    }
  }
};
</script>

<style lang="scss">
//  ::v-deep{
.uploadDialogSty {
  .el-dialog {
    width: 50%;
    max-width: 600px;
  }
}
// }
</style>