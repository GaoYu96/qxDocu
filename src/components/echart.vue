<template>
  <div style="width:100%;height:100%;" :ref="elId"></div>
</template>

<script>
// import echarts from 'echarts';
import uuidv1 from 'uuid/v1'
export default {
  props: {
    chartData: {
      type: [Object, Array]
    },
    // 图表类型
    chartType: {
      type: String,
      default: 'bar'
    }
  },
  data() {
    return {
      _ehcart: null,
      elId: ''
    }
  },
  computed: {
    options() {
      switch (this.chartType) {
        case 'bar':
          return {
            tooltip: {
              trigger: "axis"
            },
            barWidth: 20,
            legend: {
              // left: '15%',
              top: '5%',
              data: ["数据增量", "问题数据增量"],
              textStyle: {
                //图例文字的样式
                color: "#333"
              }
            },
            grid: {
              left: '15%',
              bottom: '18%',
              top: '17%'
            },
            xAxis: [
              {
                type: "category",
                data: this.chartData.xData,
                axisPointer: {
                  type: "shadow"
                },
                axisLine: {
                  lineStyle: {
                    color: "#17b3a3" //x轴颜色
                  }
                },
                // 字体倾斜
                axisLabel: {
                  interval: 0,
                  rotate: 0,
                  color: '#333',
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
                name: "数据增量",
                type: "bar",
                itemStyle: { color: "#0e83d6" },
                data: this.chartData.yData?this.chartData.yData.sjzl:[],
              },
              {
                name: "问题数据增量",
                type: "bar",
                itemStyle: { color: "#dd536b" },
                barGap: '0',
                data: this.chartData.yData?this.chartData.yData.wtsjzl:[],
              },
            ]
          }
        case 'spaceBar':
          return {
            tooltip: {
              trigger: "axis"
            },
            legend: {
              left: '15%',
              top: '5%',
              data: ["已更新", "未更新"],
              textStyle: {
                //图例文字的样式
                color: "#333"
              }
            },
            xAxis: [
              {
                type: "category",
                data: [
                  "近7天",
                  "近30天",
                  "近90天",
                  "近180天",
                ],
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
                name: "已更新",
                type: "bar",
                itemStyle: { color: "#0e83d6" },
                data: this.chartData.ygx,
                barWidth : 20
              },
              {
                name: "未更新",
                type: "bar",
                itemStyle: { color: "#3ed1cf" },
                data: this.chartData.wgx,
                barWidth : 20
              },
            ]
          }
        case 'pie':
          return {
            tooltip: {
              trigger: 'item',
            },
            color: ['#0f78f4', '#dd536b', '#9462e5', '#a6a6a6', '#e1bb22', '#39c362', '#3ed1cf'],
            // legend: {
            //     type: 'scroll',
            //     orient: 'vertical',
            //     right: 10,
            //     top: 20,
            //     bottom: 20,
            //     data: this.chartData.xData? this.chartData.xData: []
            // },
            series: [
              {
                name: this.chartData.seriesName?this.chartData.seriesName:'',
                type: 'pie',
                radius: '55%',
                data: this.chartData.yData? this.chartData.yData: [],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },
                center: ['50%', '50%'],
                minAngle: 20,
              }
            ]
          };
        case 'line':
          return {
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              left: '18%',
              bottom: '20%'
            },
            legend: {
              top: 20,
              left: 12,
              textStyle: {
                //图例文字的样式
                color: "#333"
              }
            },
            color: ['#0f78f4', '#dd536b', '#9462e5', '#a6a6a6', '#e1bb22', '#39c362', '#3ed1cf'],

            xAxis: {
              type: 'category',
              boundaryGap: false,
              axisLine: {
                lineStyle: {
                  color: "#17b3a3" //x轴颜色
                }
              },
              axisLabel: {
                color: '#333'
              },
              data: this.chartData.xData
            },
            yAxis: {
              type: 'value',
              splitLine: {
                show: true,
                lineStyle: {
                  color: ['#eee'],
                  width: 1,
                  type: 'solid'
                }
              },
              axisLine: {
                lineStyle: {
                  color: "#17b3a3" //x轴颜色
                }
              },
              axisLabel: {
                color: '#555'
              },
            },
            series: this.chartData.yData
          };
        case 'morebar':
          return{
            color: ['#006699', '#4cabce', '#e5323e'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'shadow'
              }
            },
            grid: {
              top: 10,
              bottom: 50
            },
            xAxis: [{
              type: 'category',
              axisTick: {show: false},
              data: this.chartData.xData
            }],
            yAxis: [{
              type: 'value'
            }],
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
            series: [{
              name: '结构化',
              type: 'bar',
              barGap: 0,
              // label: labelOption,
              data: this.chartData.jgh
            },
            {
              name: '半结构化',
              type: 'bar',
              // label: labelOption,
              data: this.chartData.bjgh
            },
            {
              name: '非结构化',
              type: 'bar',
              // label: labelOption,
              data: this.chartData.fjgh
            }]
          }
      }
    }
  },
  created() {
    //获取随机id
    this.elId = uuidv1()
  },
  watch: {
    chartData: {
      handler: function () {
        this.$nextTick(() => {
          this.initChart()
        })
      },
      deep: true
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.resetChart);
  },
  methods: {
    initChart() {
      if (this._ehcart) {
        this._ehcart.setOption(this.options)
      } else {
        this._ehcart = echarts.init(this.$refs[this.elId])
        this._ehcart.setOption(this.options)
      }
    },
    resetChart(){
      if(this._ehcart){
        this._ehcart.resize();
      }
    },
    computedLineNum(data) {
      let series = []
      let dsName = []
      data.forEach(item => {
        dsName = series.map(item => item.name)
        if (!dsName.includes(item.dsName)) {
          series.push({
            name: item.dsName,
            type: "line",
          })
        }
			})
			let yData = []
      series.forEach((sItem, index) => {
        yData = data.filter(item => item.dsName === sItem.name)
        sItem.data = yData.map(item => Number(item.totalRecord))
      })
      return series
    },
    resizeChart(){
      this._ehcart.resize();
    }
  },
  destroyed(){
    window.removeEventListener('resize', this.resetChart);
    this._ehcart = null
  }
}
</script>
