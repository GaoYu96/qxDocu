<template>
  <div :ref="echartId" style="height: 100%; width: 100%;"></div>
</template>

<script>
import uuidv1 from 'uuid/v1'
export default {
  data(){
    return{
      option:{
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: []
      },
      echartId: '',
      chartHeight: '100%',
      chartDiv: null
    }
  },
  props: {
    chartType: {
      type: String,
      required: true
    },
    chartData: {
      type: [Object, Array]
    }
  },
  computed: {
    options(){
      switch(this.chartType){
        case 'bar':
          return {
            
          }
        case 'morebar':
          return {
            tooltip: {
              trigger: "axis"
            },
            // legend: {
            //   left: '15%',
            //   top: '5%',
            //   data: ["数据元", "字典表", "限定词"],
            //   textStyle: {
            //     //图例文字的样式
            //     color: "#333"
            //   }
            // },
            xAxis: [
              {
                type: "category",
                data: this.chartData.yTitle,
                axisPointer: {
                  type: "shadow"
                },
                axisLine: {
                  lineStyle: {
                    color: "#17b3a3" //x轴颜色
                  }
                },
                axisLabel: {
                  color: '#333'
                }
              }
            ],
            yAxis: [
              {
                type: "value",
                axisLabel: {
                  formatter: "{value} "
                },
                axisLine: {
                  lineStyle: {
                    color: "#17b3a3" //x轴颜色
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: ['#eee'],
                    width: 1,
                    type: 'solid'
                  }
                }
              }
            ],
            series: [
              {
                name: "数据元",
                type: "bar",
                itemStyle: { color: "#0e83d6" },
                data: this.chartData.seriesData.sjy,//[213,35,123,33,54,453],//this.chartData.ygx,
                barWidth : 20
              },
              {
                name: "数据字典",
                type: "bar",
                itemStyle: { color: "rgb(53, 216, 211)" },
                data: this.chartData.seriesData.sjzd,//[213,35,123,33,54,453],//this.chartData.ygx,
                barWidth : 20
              },
              {
                name: "限定词",
                type: "bar",
                itemStyle: { color: "rgb(176, 214, 91)" },
                data: this.chartData.seriesData.xdc,//[213,35,123,33,54,453],//this.chartData.ygx,
                barWidth : 20
              },
            ]
          }
        case 'pie':
          return {
            tooltip: {
              // trigger: "axis"
              formatter: "{b}<br>{a}: 总占比{d}%",
              position: function (pos, params, dom, rect, size) {
                // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                var obj = {top: 70};
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                return obj;
              }
            },
            color: this.chartData.color,
            series: [
              {
                name: this.chartData.seriesName?this.chartData.seriesName:'',
                type: 'pie',
                radius: ['20%', '60%'],//'55%',
                data: this.chartData.yData? this.chartData.yData: [],//this.chartData.dataArr? this.chartData.dataArr: [],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },
                center: ['50%', '50%'],
                hoverAnimation: false, //鼠标移入变大
                // minAngle: 20,
              }
            ]
          }
        case 'line':
          return {

          }
        case "wordcloud":
          return {
            grid: {
              left: '4%',   // 与容器左侧的距离
              right: '4%', // 与容器右侧的距离
              containLabel: true
            },
            series: [
              {
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
          }
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
      }
    }
  },
  watch:{
    chartData: {
      handler: function () {
        this.$nextTick(() => {
          this.initChart()
        })
      },
      deep: true
    }
  },
  created() {
    //获取随机id
    this.echartId = uuidv1()
  },
  mounted(){
    this.chartHeight = document.getElementsByClassName('graph-box')[0].offsetHeight + 'px';
    this.initChart();
  },
  methods:{
    initChart(){
      this.chartDiv = this.$echarts.init(this.$refs[this.echartId])
      this.chartDiv.setOption(this.options)
      this.chartDiv.on("click", this.showDialog);
    },
    showDialog(e) {
      this.$emit("showQuoteDetail",e);
    },
  }
}
</script>