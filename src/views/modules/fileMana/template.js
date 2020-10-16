const mTemplate = {
  list: `<div><div style="background-color:#1aa194;">{{partsData.partsInfo.partsDesc}}<button style="float:right;" @click="deleteParts(partsData.partsInfo.partsId)">删除</button></div>
    <div v-for="(item,index0) in partsData.tableList" :key="index0">
    <div style="background-color:#E6F2FF">{{item.tableInfo.showName}}</div>
     <table border="1" cellspacing="0" cellpadding="0" >        
   
  <tr style="background-color:WhiteSmoke">
      <th v-for="(itm,index1) in item.colsInfo" :key="index1">
          {{itm.showName}}</th>
        <th><a href="#" style="color:black;">更多</a></th></tr>
       
          <tr v-for="(itm,index1) in item.values" :key="index1">
          <td v-for="(i,index2) in itm" :key="index2" style="text-align:center;vertical-align:middle;">
         {{i}}</td><td><a href="#" style="color:black;">详情</a></td></tr>
      </table>       
    </div>
      </div>`,

  multivalue:
    `
    <div style="background-color:WhiteSmoke;">
    <div style="background-color:#1aa194;">{{partsData.partsInfo.partsDesc}}<button style="float:right;" @click="deleteParts(partsData.partsInfo.partsId)">删除</button></div>
    <div v-for="(item,index) in partsData.tableList" :key="index">
    <div style="background-color:#E6F2FF">{{item.tableInfo.showName}}</div>  
     <div v-for="(itm,index) in item.values" :key="index">
     <div v-for="(i,index) in itm" :key="index">
     <span >{{i.label}}</span> 
     <input v-model="i.value" disabled></input>
    </div>
    </div>
    </div>
    </div>
`,
  tag:
    `<div style="background-color:WhiteSmoke;"> <div v-for="(item,index) in partsData.tableList" :key="index">{{item.tableInfo.showName}}<br>
        <span v-for="(itm,index) in item.colsInfo" :key="index" style="border:1px solid black;margin:5px;">{{itm.showName}}</span></div> 
       </div>`,


  image: `
       <div style="background-color:WhiteSmoke;">
       <span>图片</span><br>
      
 </div>
 `

}

export default mTemplate