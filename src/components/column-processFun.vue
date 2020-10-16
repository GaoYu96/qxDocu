<script>
export default {
  data () {
    let checkColName = (rule, value, callback)=>{
      if(!value){
        callback(new Error("字段名不能为空!"))
      }else{
        callback()
      }
    }
    return {
      visible: false,
      dataForm: {
        procesFunc: '',
        dataSource: '',
        translateCodes: '',
        idxStartPosition: 0,
        idxEndPosition: -1,
        replacedChar: '',
        replaceChar: '',
        replaceNum: -1,
        replaceOrder: '0',//默认从左到右
        targetType: '',
        timeFormat: 'yyyyMMdd',
        originFormat: '',
        targetFormat: '',
        encryption: 'md5',
        operate: '0',
      },
      dataRule:{
        columnName: [{ required: true, validator: checkColName, trigger: "blur" }],
        columnType: [{ required: true, message: "字段类型不能为空", trigger: "blur" }],
        columnDesc: [{ required: false, message: "字段描述不能为空", trigger: "blur" }],
        translateCodes: [{ required: true, message: "翻译代码集不能为空", trigger: "change" }],
        idxStartPosition: [{ required: true, message: "索引下标开始位置不能为空", trigger: "blur" }],
        idxEndPosition: [{ required: true, message: "索引下标结束位置不能为空", trigger: "blur" }],
        replacedChar: [{ required: true, message: "被替换字符不能为空", trigger: "blur" }],
        replaceChar: [{ required: true, message: "替换字符不能为空", trigger: "blur" }],
        replaceNum: [{ required: true, message: "替换次数不能为空", trigger: "blur" }],
        replaceOrder: [{ required: false, message: "替换顺序不能为空", trigger: "change" }],
        targetType: [{ required: true, message: "目标类型不能为空", trigger: "change" }],
        timeFormat: [{ required: true, message: "日期时间格式不能为空", trigger: "change" }],
        originFormat: [{ required: true, message: "源格式不能为空", trigger: "change" }],
        targetFormat: [{ required: true, message: "目标格式不能为空", trigger: "change" }],
        encryption: [{ required: false, message: "加密方式不能为空", trigger: "change" }],
        operate: [{ required: false, message: "操作不能为空", trigger: "change" }],
        dataSource: [{ required: true, message: "数据来源不能为空", trigger: "change" }]
      },
      dmjVisible: false,
      jqVisible: false,
      thVisible: false,
      lxVisible: false,
      rqVisible: false,
      jmVisible: false,
      currentColumn:''
    }
  },
  props:{
    propsOptions: Object
  },
  methods: {
    init(){

    },
    initState(){
      this.dmjVisible = false
      this.jqVisible = false
      this.thVisible = false
      this.lxVisible = false
      this.rqVisible = false
      this.jmVisible = false
    },
    handleFuncParams(columnName,func){ //函数参数处理
      switch(func){
        case "proc_zd_fy":
          return this.paramsHandle(columnName, [this.dataForm.translateCodes])
          break;
        case "proc_zd_nt":
          return this.paramsHandle(columnName, [this.dataForm.translateCodes])
          break;
        case "proc_zf_jq":
          return this.paramsHandle(columnName, [this.dataForm.idxStartPosition, this.dataForm.idxEndPosition])
          break;
        case "proc_zf_replace":
          return this.paramsHandle(columnName, [this.dataForm.replacedChar, this.dataForm.replaceChar, this.dataForm.replaceNum, this.dataForm.replaceOrder])
          break;
        case "proc_zh_lx":
          return this.paramsHandle(columnName, [this.dataForm.targetType, this.dataForm.timeFormat])
          break;
        case "proc_zh_dateformat":
          return this.paramsHandle(columnName, [this.dataForm.originFormat, this.dataForm.targetFormat])
          break;
        case "proc_zf_jm":
          return this.paramsHandle(columnName, [this.dataForm.encryption, this.dataForm.operate])
          break;
        default:
          return this.paramsHandle(columnName, [])
      }
    },
    paramsHandle(_columnName, _paramsArr){
      if(this.currentColumn.NEWCOL_DATASOURCE){ //预处理新增未提交的
        _columnName = this.currentColumn.NEWCOL_DATASOURCE
      }
      // 使用全角的 '｜' 进行分割
      if(_paramsArr.length === 1){
        return _columnName ? '{'+_columnName+'}｜'+_paramsArr[0] : _paramsArr[0]
      }else if(_paramsArr.length > 1){
        let paramsString = ''
        for( let i=0; i<_paramsArr.length; i++ ){
          if(paramsString===''){
            paramsString = _paramsArr[i]
          }else{
            paramsString += '｜'+_paramsArr[i]
          }
        }
        return _columnName ? '{'+_columnName+'}｜'+paramsString : paramsString
      }else{
        return _columnName ? '{'+_columnName+'}' : ''
      }
    },
    // 预处理函数 联动
    funcChange(_funcId){
      for(let i=0; i< this.propsOptions.funcOption.length; i++){
        if(this.propsOptions.funcOption[i].FUNC_NAME === _funcId){
          this.dataForm.funcRemark = this.propsOptions.funcOption[i].REMARK
        }
      }
      this.$refs['dataForm'].clearValidate();
      switch(_funcId) {
        case "proc_zd_fy":
          this.dmjVisible = true;
          this.jqVisible = false;
          this.thVisible = false;
          this.lxVisible = false;
          this.rqVisible = false,
          this.jmVisible = false;
          break;
        case "proc_zd_nt":
          this.dmjVisible = true;
          this.jqVisible = false;
          this.thVisible = false;
          this.lxVisible = false;
          this.rqVisible = false,
          this.jmVisible = false;
          break;
        case "proc_zf_jq":
          this.dmjVisible = false;
          this.jqVisible = true;
          this.thVisible = false;
          this.lxVisible = false;
          this.rqVisible = false,
          this.jmVisible = false;
          break;
        case "proc_zf_replace":
          this.dmjVisible = false;
          this.jqVisible = false;
          this.thVisible = true;
          this.lxVisible = false;
          this.rqVisible = false,
          this.jmVisible = false;
          break;
        case "proc_zh_lx":
          this.dmjVisible = false;
          this.jqVisible = false;
          this.thVisible = false;
          this.lxVisible = true;
          this.rqVisible = false,
          this.jmVisible = false;
          break;
        case "proc_zh_dateformat":
          this.dmjVisible = false;
          this.jqVisible = false;
          this.thVisible = false;
          this.lxVisible = false;
          this.rqVisible = true,
          this.jmVisible = false;
          break;
        case "proc_zf_jm":
          this.dmjVisible = false;
          this.jqVisible = false;
          this.thVisible = false;
          this.lxVisible = false;
          this.rqVisible = false,
          this.jmVisible = true;
          break;
        default: 
          this.dmjVisible = false;
          this.jqVisible = false;
          this.thVisible = false;
          this.lxVisible = false;
          this.rqVisible = false,
          this.jmVisible = false;
      }
    }
  }
}
</script>