<template>
  <div style="width:100%; height:100%;" :ref="echartId"></div>
</template>

<script>
import uuidv1 from "uuid/v1";
// import echarts from "echarts";
// import 'echarts/lib/chart/tree'
// import "echarts-wordcloud/dist/echarts-wordcloud";
import "echarts-wordcloud/dist/echarts-wordcloud.min";
export default {
  data() {
    return {
      echartId: "",
      _ehcart: null
    };
  },
  props: {
    // 图表类型
    chartType: {
      type: String,
      default: "bar"
    },
    // 数据
    chartData: {
      type: [Object, Array]
    },
    seriesName: {
      type: String
    }
  },
  computed: {
    options() {
      switch (this.chartType) {
        case "bar":
          return {
            tooltip:{
              formatter: '{b0}：{c0}'
            },
            grid: {
              top: 10,
              bottom: 50
            },
            barMaxWidth: 20,
            xAxis: {
              type: "category",
              data: this.chartData ? this.chartData.xData : []
            },
            yAxis: {
              type: "value"
            },
            dataZoom: [
              {
                type: 'slider',
                show: true,
                height: 12,
                xAxisIndex: [
                  0
                ],
                bottom:'8',
                start: 10,
                end: 90,
                handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                handleSize: '110%',
                handleStyle:{
                  color:"#d3dee5",
                },
                textStyle:{
                  color:"#000"
                },
                borderColor:"#90979c",
              }
            ],
            series: [
              {
                name: this.seriesName?this.seriesName:'',
                type: "bar",
                data: this.chartData ? this.chartData.yData : [],
                itemStyle: {
                  color: '#17B3A3'
                }
              }
            ]
          };
        case "morebar":
          let morebarSeriesArr = [
            {
              type: "bar",
              name: '任务总数',
              itemStyle: {
                color: 'rgb(56, 154, 244)'  
              },
              stack: '任务',
              data: []
            },
            {
              type: "bar",
              name: '已完成任务数',
              stack: '任务',
              itemStyle: {
                color: 'rgb(23, 179, 163)'
              },
              data: []
            },
            {
              type: "bar",
              name: '运行中任务数',
              stack: '任务',
              itemStyle: {
                color: 'rgb(47, 69, 84)'  
              },
              data: []
            },
            {
              type: "bar",
              name: '异常任务数',
              stack: '任务',
              itemStyle: {
                color: 'rgb(253, 111, 151)'  
              },
              data: []
            },
          ];
          let morebarColors = [
            "#389af4", "#FD6F97",
            "#ff8c37", "#ffdcc3",
            "#ffc257", "#ffedcc",
            "#fd6f97", "#fed4e0",
            "#a181fc", "#e3d9fe",
          ];
          this.chartData.xData = []
          this.chartData.yData.forEach((item, index)=>{
            this.chartData.xData.push(item.dsName ? (item.dsDesc?item.dsName+'('+item.dsDesc+')':item.dsName) : item.sysName)
            for(let key in item){
              if(key == 'rwzs'){
                morebarSeriesArr[0].data.push({name: '任务总数', value: item.rwzs, id: item.dsId?item.dsId:item.sysId})
              }else if(key == 'ywcrws'){
                morebarSeriesArr[1].data.push({name: '已完成任务数', value: item.ywcrws, id: item.dsId?item.dsId:item.sysId})
              }else if(key == 'yxzrws'){
                morebarSeriesArr[2].data.push({name: '运行中任务数', value: item.yxzrws, id: item.dsId?item.dsId:item.sysId})
              }else if(key == 'ycrws'){
                morebarSeriesArr[3].data.push({name: '异常任务数', value: item.ycrws, id: item.dsId?item.dsId:item.sysId})
              }
            }
          })
          return {
            tooltip:{
              trigger: 'axis'
            },
            grid: {
              top: 10,
              bottom: 50
            },
            barMaxWidth: 20,
            xAxis: [{
              type: "category",
              axisLabel: {
                interval: 0,
                show: true,
                splitNumber: 15,
                textStyle: {
                    fontSize: 10,
                    color: '#000'
                },
              },
              data: this.chartData.xData.length ? this.chartData.xData : []
            }],
            yAxis: {
              type: "value"
            },
            dataZoom: [
              {
                type: 'slider',
                show: true,
                height: 12,
                xAxisIndex: [
                  0
                ],
                bottom:'8',
                start: 10,
                end: 90,
                handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                handleSize: '110%',
                handleStyle:{
                  color:"#d3dee5",
                },
                textStyle:{
                  color:"#000"
                },
                borderColor:"#90979c"
              }
            ],
            series: morebarSeriesArr
          };
        case "pie":
          let colors = [
            ["#389af4", "#dfeaff"],
            ["#ff8c37", "#ffdcc3"],
            ["#ffc257", "#ffedcc"],
            ["#fd6f97", "#fed4e0"],
            ["#a181fc", "#e3d9fe"],
            ["#a181fc", "#e3d9fe"],
            ["#a181fc", "#e3d9fe"],
            ["#a181fc", "#e3d9fe"],
            ["#a181fc", "#e3d9fe"],
            ["#a181fc", "#e3d9fe"],
          ];
          let titleArr = [];
          let seriesArr = [];  
          console.log(this.chartData);
                  
          this.chartData.forEach(function(item, index) {
            titleArr.push({
              text: item.num,
              subtext: item.name,
              left: index * 20 + 10 + "%",
              top: "40%",
              textAlign: "center",
              textStyle: {
                fontWeight: "normal",
                fontSize: "15",
                color: colors[index][0],
                textAlign: "center"
              },
              subtextStyle: {
                fontSize: "15",
                color: colors[index][0]
              }
            });
            seriesArr.push({
              name: item.name,
              type: "pie",
              clockWise: false,
              radius: [60, 70],
              itemStyle: {
                normal: {
                  color: colors[index][0],
                  shadowColor: colors[index][0],
                  shadowBlur: 0,
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  }
                }
              },
              hoverAnimation: false,
              center: [index * 20 + 10 + "%", "50%"],
              data: [
                {
                  value: item.num,
                  other: {
                    ratio: item.ratio
                  },
                  label: {
                    normal: {
                      formatter: function(params) {
                        // return params.data.other.ratio*100 + "%";
                      },
                      position: "center",
                      show: true,
                      textStyle: {
                        fontSize: "20",
                        fontWeight: "bold",
                        color: colors[index][0]
                      }
                    }
                  }
                },
                {
                  value: 100 - (item.ratio*100),
                  name: "invisible",
                  itemStyle: {
                    normal: {
                      color: colors[index][1]
                    },
                    emphasis: {
                      color: colors[index][1]
                    }
                  }
                }
              ]
            });
          });
          return {
            title: titleArr,
            series: seriesArr
          };
        case "wordcloud":
          return {
            grid: {
              left: '4%',   // 与容器左侧的距离
              right: '4%', // 与容器右侧的距离
              containLabel: true
            },
            series: [
              {
                name: this.seriesName?this.seriesName:'',
                type: "wordCloud",
                gridSize: 5,
                shape: "circle",
                sizeRange: [12, 35],
                // width: 800,
                // height: 500,
                rotationRange: [0, 0],
                textStyle: {
                  normal: {
                    color: function() {
                      return (
                        "rgb(" +
                        [
                          Math.round(Math.random() * 160),
                          Math.round(Math.random() * 160),
                          Math.round(Math.random() * 160)
                        ].join(",") +
                        ")"
                      );
                    }
                  },
                  emphasis: {
                    shadowBlur: 10,
                    shadowColor: "#333"
                  }
                },
                data: this.chartData?this.chartData:[]
              }
            ]
          };
        case "tree":
          return {
            series: [
              {
                type: "tree",
                data: [this.chartData?this.chartData:[]],
                top: "1%",
                left: "15%",
                bottom: "1%",
                right: "20%",
                symbolSize: 7,
                label: {
                  normal: {
                    position: "left",
                    verticalAlign: "middle",
                    align: "right",
                    fontSize: 9
                  }
                },
                leaves: {
                  label: {
                    normal: {
                      position: "right",
                      verticalAlign: "middle",
                      align: "left"
                    }
                  }
                },
                expandAndCollapse: true,
                animationDuration: 550,
                animationDurationUpdate: 750
              }
            ]
          };
        case "lines":
          let legendName = ['数据总数','问题数量','问题占比率'];
          let xData = [];
          let seriesArrs = [];
          let totalRowsArr = []; //数据总数
          let errNumArr = []; //问题数量
          let errRatioArr = []; //问题占比率
          if(this.chartData){
            for(let i = 0; i<this.chartData.length; i++){
              xData.push( this.chartData[i].DATE )
              totalRowsArr.push(this.chartData[i].RECORD)
              errNumArr.push(this.chartData[i].ERR_RECORD)
              errRatioArr.push(this.chartData[i].ERR_RATIO)
            }
          }
          let seriesObj = [
            {color: "#058cff", name: '数据总数', value: totalRowsArr },
            {color: "#36BDAF", name: '问题数量', value: errNumArr },
            {color: "#BF871E", name: '问题占比率', value: errRatioArr }
          ]
          for(let i = 0; i<seriesObj.length; i++){
            seriesArrs.push({
              name: seriesObj[i].name,
              type: "line",
              yAxisIndex: i === 2 ? 1 : 0, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
              smooth: true, //平滑曲线显示
              showAllSymbol: true, //显示所有图形。
              symbol: "circle", //标记的图形为实心圆
              symbolSize: 10, //标记的大小
              itemStyle: {
                //折线拐点标志的样式
                color: seriesObj[i].color
              },
              lineStyle: {
                  color: seriesObj[i].color
              },
              areaStyle:{
                  color: "rgba(5,140,255, 0.2)"
              },
              data: seriesObj[i].value
            })
          }
          return {
            tooltip:{
              formatter: '{a}:<br /> {b0}: {c0}'
            },
            legend: {
              data: legendName, 
              top: "2%",
              textStyle: {
                color: "#000"
              }
            },
            xAxis: {
              data: xData,
              axisLine: {
                show: true //隐藏X轴轴线
              },
              axisTick: {
                show: true //隐藏X轴刻度
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: "#000" //X轴文字颜色
                }
              },
              axisLine: {
                lineStyle: {
                  color: "#000"
                }
              }
            },
            yAxis: [
              {
                type: "value",
                name: "数量",
                nameTextStyle: {
                  color: "#000"
                },
                splitLine: {
                  show: false
                },
                splitLine: {
                  show: false
                },
                axisTick: {
                  show: true
                },
                axisLine: {
                  show: true
                },
                axisLabel: {
                  show: true,
                  formatter: '{value}',
                  textStyle: {
                    color: "#000"
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: "#000"
                  }
                }
              },
              {
                type: "value",
                name: "占比",
                nameTextStyle: {
                  color: "#000"
                },
                position: "right",
                splitLine: {
                  show: false
                },
                splitLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                    show: true,
                    lineStyle:{
                        color: '#000'
                    }
                },
                axisLabel: {
                  show: true,
                  formatter: "{value} %", //右侧Y轴文字显示
                  textStyle: {
                    color: "#000"
                  }
                }
              },
              {
                type: "value",
                gridIndex: 0,
                min: 50,
                max: 100,
                splitNumber: 8,
                splitLine: {
                  show: false
                },
                axisLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  show: false
                },
                splitArea: {
                  show: true,
                  areaStyle: {
                    color: ["rgba(250,250,250,0.0)", "rgba(250,250,250,0.05)"]
                  }
                }
              }
            ],
            series: seriesArrs
          };
        case 'scatter':
          return {
            tooltip:{
              formatter(params){
                return params.data.name+ ': '+params.data.value
              }
            },
            grid: {
              top: 10,
              bottom: 50
            },
            xAxis: {},
            yAxis: {},
            series: [
              {
                type: "scatter",
                symbolSize: function (parmas) {    //显示打点的值，即点的大小根据一个方法除数取整
                  return Math.sqrt(parmas) * 1;
                },
                data: this.chartData,
                itemStyle: {
                  color: function(e){
                    return e.data.color
                  }
                },
              }
            ]
          };
        case 'rank-h': //横向排行
        // 数据 data json 对象格式 [{name: ,value: }] 
          function getYaxisData(data,k){ //配置y轴数据
            let key = k || "value";
            let res = [];
            if (data) {
              data.forEach(function (t) {
                  res.push(t[key]);
              });
            }
            return res;
          }
          return{
            tooltip:{
              formatter: '{b0}: {c0}次'
            },
            grid: {
              top: '2%',
              bottom: -15,
              right: 30,
              left: 0,
              containLabel: true
            },
            xAxis: { show: false },
            yAxis: [{
              inverse: true,
              axisLine: { show: false },
              splitLine: { show: false },
              axisTick: { show: false },
              data: getYaxisData(this.chartData.data, 'name'),
            }],
            series: [{
              name: '排行',
              type: 'bar',
              barWidth: 10,
              data: this.chartData.data,
              itemStyle: {
                color: (val) => {
                  if (val.dataIndex < 3) {
                    return this.chartData.top3_color?this.chartData.top3_color[val.dataIndex]:'#1990FF';
                  } else {
                    return '#1990FF'
                  }
                },
                barBorderRadius: 30,
              }
            }]
          };
        case 'brokenLine': //折线
          return{
            tooltip:{
              // trigger: 'axis'
              formatter: (params)=>{                
                return '<span style="display: inline-block; border-radius:100%; width: 10px; height: 10px; margin-right: 5px; background:'+params.color+'"></span>日期：'+params.data.name+'<br/> 服务名：'+params.seriesName+'<br/>响应次数：'+params.data.value
              }
            },
            grid: {
              top: 10,
              bottom: 50
            },
            xAxis: { 
              show: true,
              data: this.chartData.xData 
            },
            yAxis: {
              type: "value"
            },
            dataZoom: [
              {
                type: 'slider',
                show: true,
                height: 12,
                xAxisIndex: [
                  0
                ],
                bottom:'8',
                start: 10,
                end: 90,
                handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                handleSize: '160%',
                handleStyle:{
                  color:"#d3dee5",
                },
                textStyle:{
                  color:"#000"
                },
                borderColor:"#90979c"
              }
            ],
            series: this.chartData.data
          };
        case 'oneBar-showMore': //一条柱子展示多种类型数据
          return{
            tooltip:{
              trigger: 'axis'
            },
            grid: {
              top: 10,
              bottom: 50
            },
            barMaxWidth: 20,
            xAxis: [{
              type: "category",
              axisLabel: {
                interval: 0,
                show: true,
                splitNumber: 15,
                textStyle: {
                    fontSize: 10,
                    color: '#000'
                },
              },
              data: this.chartData.xData.length ? this.chartData.xData : []
            }],
            yAxis: {
              type: "value"
            },
            dataZoom: [
              {
                type: 'slider',
                show: true,
                height: 12,
                xAxisIndex: [
                  0
                ],
                bottom:'8',
                start: 10,
                end: 90,
                handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                handleSize: '110%',
                handleStyle:{
                  color:"#d3dee5",
                },
                textStyle:{
                  color:"#000"
                },
                borderColor:"#90979c"
              }
            ],
            series: this.chartData.data
          }
        case 'graph': //关系图
        console.log(this.chartData.datas, this.chartData.links);
        
          return{
            series: [{
              layout: 'force',
              seriesName: this.seriesName,
              type: "graph",
              data: this.chartData.datas,
              links: this.chartData.links
            }]
          }
      }
    }
  },
  watch: {
    chartData: {
      handler: function() {
        this.$nextTick(() => {
          this.init();
        });
      },
      deep: true
    }
  },
  created() {
    //获取随机id
    this.echartId = uuidv1();
  },
  mounted() {
    this.init();
    window.addEventListener("resize", this.resetChart);
  },
  methods: {
    init() {
      if (this._ehcart) {
        this._ehcart.setOption(this.options);
        this._ehcart.on("click", this.showDialog);
      } else {
        this._ehcart = echarts.init(this.$refs[this.echartId]);
        this._ehcart.setOption(this.options);
        this._ehcart.on("click", this.showDialog);
      }
    },
    resetChart(){
      if(this._ehcart){
        this._ehcart.resize();
      }
    },
    showDialog(e) {
      this.$emit("showQuoteDetail",e);
    },
    resizeChart(){
      this._ehcart.resize();
    }
  },
  destroyed(){
    window.removeEventListener("resize", this.resetChart);
    this._ehcart = null
  }
};
</script>
