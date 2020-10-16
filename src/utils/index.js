import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import vuethis from '@/main'
/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  Vue.cookie.delete('Authorization')
  // store.commit('resetStore')
  // router.options.isAddDynamicMenuRoutes = false
}

/*
  处理返回二进制流文件
*/
export function binarySwitch (_data, fileName) {
  if(_data.data.msg){
    vuethis.$message.error(_data.data.msg)
  }
  let _fileName = ''
  if(fileName){
    _fileName = fileName
  }else{
    let contentDis = _data.headers['content-disposition']
  
    if(contentDis){
      let contentDisArr = contentDis.split(';')
      if(contentDisArr.length>2){
        let msg = contentDisArr[2].substr(contentDisArr[2].indexOf('=')+1)
        vuethis.$message.error(msg)
        return;
      }
      _fileName = contentDisArr[1].substr(contentDisArr[1].indexOf('=')+1)
    }
  }
  const datas = _data.data
  const url = window.URL.createObjectURL(new Blob([datas], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', _fileName?_fileName:'')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
/*
  证件号码校验
*/
export function verifyIdCard (id) {
 // 1 "验证通过!", 0 //校验不通过
  var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
  //号码规则校验
  if(!format.test(id)){
      return {'status':0,'msg':'身份证号码不合规'};
  }
  //区位码校验
  //出生年月日校验   前正则限制起始年份为1900;
  var year = id.substr(6,4),//身份证年
      month = id.substr(10,2),//身份证月
      date = id.substr(12,2),//身份证日
      time = Date.parse(month+'-'+date+'-'+year),//身份证日期时间戳date
      now_time = Date.parse(new Date()),//当前时间戳
      dates = (new Date(year,month,0)).getDate();//身份证当月天数
  if(time>now_time||date>dates){
      return {'status':0,'msg':'出生日期不合规'}
  }
  //校验码判断
  var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2) //系数
  var b = new Array('1','0','X','9','8','7','6','5','4','3','2');  //校验码对照表
  var id_array = id.split("");
  var sum = 0;
  for(var k=0;k<17;k++){
      sum+=parseInt(id_array[k])*parseInt(c[k]);
  }
  if(id_array[17].toUpperCase() != b[sum%11].toUpperCase()){
      return {'status':0,'msg':'身份证校验码不合规'}
  }
  return {'status':1,'msg':'校验通过'}
}

// 命名实体提示内容表格式化
export function nerTypeHandle(_NER_TYPE, _TOTAL){
  if(_NER_TYPE){
    let count = 0
    var tab='<table border=1 width=482">'
    let ner_type = JSON.parse(_NER_TYPE)
    for(let key in ner_type){
      if(count === 0){
        tab+='<tr><td>实体</td><td>可能性</td></tr>'
        let itemArrs = []
        itemArrs.push(key)
        itemArrs.push(ner_type[key])
        tab+='<tr style="font-size: 14px; color: #eaedf3;">'
        for(var j=0;j<itemArrs.length;j++){
          if(!j){
            tab+="<td>"+itemArrs[j]+"</td>"
          }else{
            let percent = itemArrs[j]/_TOTAL*100>100?100:itemArrs[j]/_TOTAL*100
            tab+="<td>"+ percent.toFixed(2) + '%'+"</td>"
          }
        }
        tab+='</tr>'
      }else{
        let itemArrs = []
        itemArrs.push(key)
        itemArrs.push(ner_type[key])
        tab+='<tr>'
        for(var j=0;j<itemArrs.length;j++){
          if(!j){
            tab+="<td>"+itemArrs[j]+"</td>"
          }else{
            let percent = itemArrs[j]/_TOTAL*100>100?100:itemArrs[j]/_TOTAL*100
            tab+="<td>"+ percent.toFixed(2) + '%'+"</td>"
          }              
        }
        tab+='</tr>'
      }
      count++
    }    
    tab+='</table>';
    return tab
  }else{
    return ''
  }
}
// 值域提示内容表格式化
export function valDomainHandle(_VAL_DOMAIN){
  let VAL_DOMAIN_TIPS = ''
  if(_VAL_DOMAIN !== 'null' && _VAL_DOMAIN && _VAL_DOMAIN !== '{}'){
    let valDomain = JSON.parse(_VAL_DOMAIN)
    if(valDomain.hasOwnProperty('max')){
      let maxVal = valDomain.max?valDomain.max:'-'
      let minVal = valDomain.min?valDomain.min:'-'
      let avgVal = valDomain.avg?valDomain.avg:'-'
      let middleVal = valDomain.middle?valDomain.middle:'-'
      let mostVal = valDomain.most?valDomain.most:'-'
      VAL_DOMAIN_TIPS = '最大值：'+maxVal + '<br>' + '最小值：'+minVal + '<br>' + '平均数：'+avgVal + ' <br>' + '中位数：'+middleVal + '<br>' + '众数：'+mostVal + '<br>'
    }else{
      VAL_DOMAIN_TIPS = '<span style="display: inline-block;font-size: 15px; color: #29dcca; margin-bottom: 8px;">‘值’总数：' + valDomain.valCnt + '</span><br>'+'<span>值域分布：</span><br>'
      let count = 0
      let valsObjs = valDomain.vals
      let temp_valsObjs = Object.keys(valsObjs).sort(function(a,b){return valsObjs[b]-valsObjs[a]})
      let end_valsObjs = {}
      if(temp_valsObjs.length>10){
        let firstFour = temp_valsObjs.slice(0,5)
        let afterFour = temp_valsObjs.slice(-5)
        let tenVals = firstFour.concat(afterFour)
        temp_valsObjs = tenVals
      }
      
      for(let i=0;i<temp_valsObjs.length;i++){
        end_valsObjs[temp_valsObjs[i]]=valsObjs[temp_valsObjs[i]];
      }
      
      var tab='<table border=1 width=482">'
      for(let key in end_valsObjs){
        if(count === 0){
          tab+='<tr><td>值</td><td>数量</td></tr>'
          let itemArrs = []
          itemArrs.push(key)
          itemArrs.push(valDomain.vals[key])
          tab+='<tr style="font-size: 14px; color: #eaedf3;">'
          for(var j=0;j<itemArrs.length;j++){
            if(!j){
              tab+="<td>"+itemArrs[j]+"</td>"
            }else{
              tab+="<td width=80>"+ itemArrs[j] +"</td>"
            }     
          }
          tab+='</tr>'
        }else{
          let itemArrs = []
          itemArrs.push(key)
          itemArrs.push(valDomain.vals[key])
          tab+='<tr>'
          for(var j=0;j<itemArrs.length;j++){
              tab+="<td>"+itemArrs[j]+"</td>"
          }
          tab+='</tr>'
        }
        count++
      }    
      tab+='</table>';
      VAL_DOMAIN_TIPS += tab
    }    
    return VAL_DOMAIN_TIPS
  }else{
    return ''
  }
}
// 去重值处理
export function repeatRatioHandle(_REPEAT_RATIO, _TOTAL){
  for(let key in _REPEAT_RATIO){
    _REPEAT_RATIO[key] = _REPEAT_RATIO[key]/_TOTAL*100>100?100+'%':_REPEAT_RATIO[key]/_TOTAL*100+'%'
  }
  return JSON.stringify(_REPEAT_RATIO)
}