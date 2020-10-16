<!--  -->
<template>
<div>
    <div class="left">
        <div style="text-align:center;">
        <img src="@/assets/img/touxiang.png" style="margin-top:30px;">
        <div style="width:100%;background-color:#d0d3cf;height:200px;">
            <el-tree :data="data" :props="defaultProps"></el-tree>
        </div>
        </div>
    </div>
    <div class="right">
        <div style="margin:10px 5px 30px 0;float:right">
           <el-button v-for="(item,index) in tag" :key="index" :icon="item.icon">{{item.label}}</el-button>
        </div>
        <div>
            <span>基本信息</span>
            <el-switch
  v-model="value"
  active-color="#13ce66"
  inactive-color="#ff4949">
</el-switch></div>
        <div class="tblClass">
          <div class="rightDiv">
               <li style="list-style: none"></li>
          </div>
        </div>
    </div>
</div>
</template>

<script>
import Vue from "vue/dist/vue.esm.js";
import MForm from "../../../components/form";
export default {
data() {
return {
   tag:[
       {
      label:'切换模板',
      icon:'el-icon-tickets'
       },
        {
      label:'标签管理',
      icon:'el-icon-tickets'

    //   icon:'el-icon-collection-tag'
       },
        {
      label:'录入数据',
      icon:'el-icon-tickets'

    //   icon:'el-icon-s-order'
       },
   ],
     data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
           defaultProps: {
          children: 'children',
          label: 'label'
        },
        value: true,
      tplsArr_right:[],

}
},
//生命周期 - 创建完成（访问当前this实例）
created() {

},
//生命周期 - 挂载完成（访问DOM元素）
mounted() {
          this.setLayout()
},
methods:{
    show(val){
       console.log(val);
    },
    setLayout(){
      
       let a = this.tplsArr_right.push({
        dataMap: {
         
           14: 
              ["x", "x", "x"]
             
            
          
        },
        tableList: [
          {
            tableInfo: {
              partsId: 15,
              tblId: 14,
              objCol: "b",
              showNo: 1,
              showName: "a测试表_3aaaa",
              showLine: 10,
              createTime: "2020-09-03 12:13:23",
              updateTime: "2020-09-25 16:18:47",
            },
            colsInfo: [
              {
                partsId: 15,
                tblId: 14,
                colId: 1,
                colName: "a",
                showName: "注释a",
                listShow: "1",
                detailShow: "1",
                showNo: 1,
                showType: "common",
                showTypeVal: null,
                createTime: "2020-09-03 15:01:38",
                updateTime: "2020-09-21 14:30:28",
              },
              {
                partsId: 15,
                tblId: 14,
                colId: 2,
                colName: "c",
                showName: "注释c",
                listShow: "1",
                detailShow: "1",
                showNo: 2,
                showType: "common",
                showTypeVal: null,
                createTime: "2020-09-03 15:01:38",
                updateTime: "2020-09-27 14:46:07",
              },
              {
                partsId: 15,
                tblId: 14,
                colId: 3,
                colName: "b",
                showName: "注释b",
                listShow: "1",
                detailShow: "1",
                showNo: 3,
                showType: "common",
                showTypeVal: null,
                createTime: "2020-09-03 15:01:38",
                updateTime: "2020-09-21 14:30:33",
              },
            ],
          },
        ],
        partsInfo: {
          partsId: 15,
          partsDesc: "部件测试",
          partsType: "list",
          isTitle: "1",
          isFold: "1",
          objElement: "ry",
          status: "1",
          isDelete: "1",
          createTime: "2020-09-03 10:55:32",
          updateTime: "2020-10-13 17:48:59",
          code: null,
        },
      })
       let rightArr = this.tplsArr_right;
       for (var i = 0; i < rightArr.length; i++) {
          var Profile = Vue.extend({
          template:  `<div><div style="background-color:#1aa194;">{{partsData.partsInfo.partsDesc}}<button style="float:right;" >删除</button></div>
    <div v-for="(item,index0) in partsData.tableList" :key="index0">   
    <div style="background-color:#E6F2FF">{{item.tableInfo.showName}}</div>
    
     <table border="1" cellspacing="0" cellpadding="0" style="background-color:WhiteSmoke">        
   
  <tr>
      <th v-for="(itm,index1) in item.colsInfo" :key="index1">
          {{itm.showName}}</th>
        <th><a href="#" style="color:black;">更多</a></th></tr>
       
          <tr v-for="(itm,index1) in partsData.dataMap" :key="index1">
          <td v-for="(ele,index2) in itm" :key="index2">
         {{ele}}</td><td><a href="#" style="color:black;">详情</a></td></tr>
      </table>       
    
    </div>
      </div>`,

          data: function () {
            return {
              partsData: rightArr[i],
            };
          },
          components: {
            MForm,
          },
          mounted() {},
          watch: {},
          methods: {},
        });
        new Profile().$mount(
          document
            .getElementsByClassName("rightDiv")
            [i].getElementsByTagName("li")[0]
        );
       }
    }
}
}
</script>
<style lang="scss" scoped>
::v-deep{
     .left{
         width:13%;
        //  background: wheat;
         min-height:300px;
         float: left;
        //  display: flex;
        //   flex-direction:column
     }
     .el-card__body {
    padding: 15px 20px !important;
    background-color: #d0d3cf!important;
}
.right{
    width:85%;
    min-height:600px;
    background:  #d0d3cf;
    float: right;
}
.tblClass{
  width:90%;
  background-color: azure;
  height:200px;
  margin:40px auto;
}
}

</style>