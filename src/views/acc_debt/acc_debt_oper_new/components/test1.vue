<template>
  <div
    id="mychart"
    className="Echarts"
    style="width: 100%; height: 500px"
  ></div>
</template>

<script>
  import * as echarts from 'echarts/lib/echarts'
  import klineData from '@/views/acc_debt/acc_debt_oper_new/data/test1.json'
  import timedata from '@/views/acc_debt/acc_debt_oper_new/data/time.json'
  import axios from 'axios'

  export default {
    name: 'Test1',
    data() {
      return {
        gridData1: [[,]],
        gridData2: [[,]],
        gridData3: [[,]],
        gridData4: [[,]],
        //upcolor: '#FF0000', //增长颜色
        //upBorderColor: '#8A0000',
        //downColor: '#008000', // 下跌颜色
        //downBorderColor: '#008F28',
        volumeColor1: [],
        volumeColor2: [],
        UP_COLOR: '#E24528',
        DOWN_COLOR: '#009933',
        NORMAL_COLOR: '#33353C',
        priceMax: 0.0,
        priceMin: 0.0,
        priceInterval: 0.0,
        volumeMax: 0,
        volumeMin: 0,
        volumeInterval: 0,
        klineData: [], //k线图数据
        klineData1: [],
        hourData: [], //charts表格小时数据
        xData: [],
        culomnColor: [], //颜色
        culomnValue: [],
        lastPrice: 0.0,
        gridtest: [
          [1702948220, 2638],
          [1702948259, 2640],
          [1702948320, 2640],
          [1702948379, 2639],
          [1702948439, 2632],
          [1702948507, 2638],
          [1702948559, 2638],
          [1702948619, 2638],
          [1702948679, 2637],
          [1702948740, 2637],
          [1702948802, 2637],
          [1702948867, 2636],
          [1702948919, 2635],
          [1702948983, 2633],
          [1702949041, 2634],
          [1702949099, 2633],
          [1702949166, 2635],
          [1702949252, 2635],
          [1702949282, 2633],
          [1702949339, 2635],
          [1702949399, 2633],
          [1702949463, 2636],
          [1702949520, 2635],
          [1702949580, 2634],
          [1702949639, 2632],
          [1702949701, 2637],
          [1702949761, 2639],
          [1702949821, 2641],
          [1702949882, 2642],
          [1702949940, 2643],
          [1702949999, 2645],
          [1702950061, 2642],
          [1702950123, 2642],
          [1702950179, 2640],
          [1702950243, 2641],
          [1702950303, 2641],
          [1702950364, 2643],
          [1702950420, 2644],
          [1702950494, 2644],
          [1702950543, 2644],
          [1702950599, 2643],
          [1702950660, 2641],
          [1702950748, 2642],
          [1702950782, 2643],
          [1702950841, 2644],
          [1702950904, 2643],
          [1702950959, 2644],
          [1702951029, 2644],
          [1702951092, 2642],
          [1702951140, 2643],
          [1702951206, 2643],
          [1702951270, 2643],
          [1702951319, 2644],
          [1702951379, 2647],
          [1702951440, 2648],
          [1702951501, 2649],
          [1702951559, 2651],
          [1702951624, 2650],
          [1702951679, 2642],
          [1702951746, 2644],
          [1702951805, 2643],
          [1702951866, 2643],
          [1702951920, 2644],
          [1702951979, 2643],
          [1702952042, 2646],
          [1702952102, 2643],
          [1702953002, 2643],
          [1702953059, 2650],
          [1702953120, 2648],
          [1702953182, 2645],
          [1702953246, 2645],
          [1702953299, 2646],
          [1702953361, 2645],
          [1702953431, 2641],
          [1702953479, 2641],
          [1702953544, 2644],
          [1702953606, 2641],
          [1702953673, 2641],
          [1702953724, 2641],
          [1702953779, 2643],
          [1702953839, 2641],
          [1702953903, 2642],
          [1702953959, 2642],
          [1702954019, 2639],
          [1702954080, 2642],
          [1702954140, 2640],
          [1702954199, 2640],
          [1702954259, 2639],
          [1702954323, 2638],
          [1702954380, 2638],
          [1702954439, 2638],
          [1702954508, 2639],
          [1702954559, 2638],
          [1702954620, 2633],
          [1702954680, 2635],
          [1702954740, 2636],
          [1702954821, 2635],
          [1702954864, 2636],
          [1702954921, 2635],
          [1702954979, 2635],
          [1702955052, 2635],
          [1702955099, 2635],
          [1702955159, 2634],
          [1702955220, 2634],
          [1702955281, 2635],
          [1702955340, 2631],
          [1702955400, 2632],
          [1702955463, 2634],
          [1702955519, 2630],
          [1702955579, 2629],
          [1702955639, 2629],
          [1702955700, 2624],
          [1702955759, 2626],
          [1702955824, 2629],
          [1702955886, 2627],
          [1702955941, 2629],
          [1702956005, 2628],
          [1702956060, 2632],
          [1702956119, 2632],
          [1702956180, 2629],
          [1702956244, 2629],
        ],
      }
    },
    mounted() {
      // 数据初始化
      this.initData()
      // 图标初始化
      this.initEcharts()
    },
    methods: {
      getFormatTime(stamp) {
        let year = new Date(stamp).getFullYear()
        let month = new Date(stamp).getMonth() + 1
        month = month < 10 ? '0' + month : month
        let date = new Date(stamp).getDate()
        date = date < 10 ? '0' + date : date
        return (
          year +
          '-' +
          month +
          '-' +
          date +
          ' ' +
          new Date(stamp).toLocaleTimeString('chinese', { hour12: false })
        )
      },
      initData() {
        this.klineData = klineData
        let jsonData = klineData
        /*axios.get('./static/test1.json').then((response) => {
        //
        this.klineData1 = response.data
        //console.log('response is:' + this.klineData1)
      })
      console.log('response is:' + this.klineData1)
      let jsonData = this.klineData1*/
        this.lastPrice = jsonData[0][6]
        this.gridData1.splice(0)
        this.gridData2.splice(0)
        this.gridData3.splice(0)
        this.gridData4.splice(0)
        console.log('jsonData is:' + jsonData)
        //console.log('jsonData1 is:' + jsonData1)
        //console.log('lastprice is:' + this.lastPrice)
        for (let i = 0; i < jsonData.length; i++) {
          /*hourData.push([
    i,
    jsonData[i][2],
    jsonData[i][7],
    jsonData[i][3],
    jsonData[i][7],
    jsonData[i][3],
    jsonData[i][8],
  ])*/
          //if (i < 121)
          {
            //上午数据
            if (jsonData[i][4] > this.priceMax) {
              this.priceMax = jsonData[i][4]
            }
            if (jsonData[i][5] < this.priceMin || this.priceMin === 0) {
              this.priceMin = jsonData[i][5]
            }
            this.gridData1.push([jsonData[i][14], Number(jsonData[i][3])])

            if (jsonData[i][10] > this.volumeMax) {
              this.volumeMax = jsonData[i][10]
            }
            if (jsonData[i][10] < this.volumeMin || this.volumeMin === 0) {
              this.volumeMin = jsonData[i][10]
            }
            if (i === 0) {
              if (jsonData[i][3] >= jsonData[i][6]) {
                this.volumeColor1.push(this.UP_COLOR)
              } else {
                this.volumeColor1.push(this.DOWN_COLOR)
              }
            } else {
              if (jsonData[i][3] >= jsonData[i - 1][3]) {
                this.volumeColor1.push(this.UP_COLOR)
              } else {
                this.volumeColor1.push(this.DOWN_COLOR)
              }
            }
            this.gridData2.push([jsonData[i][14], Number(jsonData[i][10])])
          } /*else {
            //下午数据
            if (jsonData[i][4] > this.priceMax) {
              this.priceMax = jsonData[i][4]
            }
            if (jsonData[i][5] < this.priceMin || this.priceMin === 0) {
              this.priceMin = jsonData[i][5]
            }
            this.gridData3.push([jsonData[i][14], Number(jsonData[i][3])])
            if (jsonData[i][10] > this.volumeMax) {
              this.volumeMax = jsonData[i][10]
            }
            if (jsonData[i][10] < this.volumeMin || this.volumeMin === 0) {
              this.volumeMin = jsonData[i][10]
            }
            if (jsonData[i][3] >= jsonData[i - 1][3]) {
              this.volumeColor2.push(this.UP_COLOR)
            } else {
              this.volumeColor2.push(this.DOWN_COLOR)
            }
            this.gridData4.push([jsonData[i][14], Number(jsonData[i][10])])
          }*/
        }
        //this.gridtest.push('[' + this.gridData1 + ']')
        //console.log('gridtest is:' + this.gridtest)
        //console.log('grid1 data is:' + this.gridData1)
        //console.log('grid2 data is:' + this.gridData2)
        //console.log('grid3 data is:' + this.gridData3)
        //console.log('grid4 data is:' + this.gridData4)

        if (
          (this.lastPrice - this.priceMax) * -1 >
          this.lastPrice - this.priceMin
        ) {
          this.priceMin = this.lastPrice - (this.lastPrice - this.priceMax) * -1
        } else {
          this.priceMax = this.lastPrice + (this.lastPrice - this.priceMin)
        }

        this.priceInterval = (this.priceMax - this.lastPrice) / 4
        this.volumeInterval = this.volumeMax / 2
        //this.hourData = this.splitData(this.klineData)
        //this.hourData = this.klineData
        //this.initxData()
        //this.initEcharts()
      },
      initEcharts() {
        this.timedata = timedata
        let xAxisData = this.timedata
        const option = {
          grid: [
            // 第一个grid
            {
              top: 50, // 图表的外边距
              height: 380, // 图表的高度
              left: '5%',
              width: '90%', //因为是左右各一个图表，使用百分比的方式显得更方便，
            },
            // 第二个grid，第二个图表是在第一个图表的下方，所以要把它定位到底部
            {
              top: 450, //设置上方的外边距是第一个图表的高度再加10，使用top是方便我们调整下方grid的高度
              left: '5%',
              width: '90%', // 宽度与第一个图表一个大
              height: 100,
            },
            // 第三个grid，第三个图表是在第一个图表的右方，所以要把它定位到右方
          ],
          // 多个图表则会存在对个x轴y轴，所以这里的配置我们也换成数组的方式
          // x轴配置，
          xAxis: [
            // 第一个grid的x轴属性
            {
              // 告诉echarts，这个第一个grid的x轴
              gridIndex: 0,
              // 坐标轴是否留白
              boundaryGap: false,
              // x轴的刻度
              axisTick: { show: false },
              // x轴的刻度值
              axisLabel: {
                show: false,
                interval: function (index) {
                  //return index % 30 === 0 // 只有奇数索引的刻度才显示
                  if (
                    (index % 60 === 0 && index !== 240 && index !== 300) ||
                    index === 195 ||
                    index === 225 ||
                    index === 255 ||
                    index === 285 ||
                    index === 345
                  ) {
                    return true
                  }
                },
              },
              //max: 'dataMax',
              // min: 'dataMin',
              type: 'category',
              axisLine: {
                lineStyle: {
                  color: '#ECEEF2',
                },
              },
              splitLine: {
                lineStyle: {
                  color: '#ECEEF2',
                  // 设置线条喂风格为虚线
                  type: 'dashed',
                },
              },
              position: 'bottom',
              data: xAxisData,
            },
            // 第二个grid的x轴属性
            {
              // 告诉echarts，这个第一个grid的x轴
              gridIndex: 1,
              // 坐标轴是否留白
              boundaryGap: false,
              // x轴的刻度
              axisTick: { show: false },
              // max: '120',
              // min: '0',
              // splitNumber: 10,
              type: 'category',
              axisLabel: {
                show: true,
                color: '#888',
                interval: function (index) {
                  //return index % 30 === 0 // 只有奇数索引的刻度才显示
                  if (
                    (index % 60 === 0 && index !== 240 && index !== 300) ||
                    index === 195 ||
                    index === 225 ||
                    index === 255 ||
                    index === 285 ||
                    index === 345
                  ) {
                    return true
                  }
                },
              },
              axisLine: {
                lineStyle: {
                  color: '#ECEEF2',
                },
              },
              splitLine: {
                lineStyle: {
                  color: '#ECEEF2',
                  // 设置线条喂风格为虚线
                  type: 'dashed',
                },
              },
              position: 'bottom',
              data: xAxisData,
            },
          ],
          // y轴配置
          yAxis: [
            // 第一个grid的y轴属性
            {
              // 去掉刻度值旁边的指示线
              axisTick: { show: false },
              splitNumber: 9,
              gridIndex: 0,
              interval: this.priceInterval,
              max: this.priceMax,
              min: this.priceMin,
              splitLine: {
                lineStyle: {
                  color: '#ECEEF2',
                  // 设置线条喂风格为虚线
                  type: 'dashed',
                },
              },
              axisLine: {
                lineStyle: {
                  color: '#ECEEF2',
                },
              },
              axisLabel: {
                fontSize: 10,
                margin: 0,
                // y轴的数值向内显示
                align: 'left',
                formatter: (value, index) => {
                  return value.toFixed(0)
                },
                color: (value, index) => {
                  //console.log('color value is:' + parseFloat(value).toFixed(0))
                  //console.log('lastprice is:' + this.lastPrice)
                  // 中间基准线的数值为黑色
                  if (
                    parseFloat(value).toFixed(0) === this.lastPrice.toFixed(0)
                  ) {
                    return this.NORMAL_COLOR
                  }

                  // 上涨区域的数字为红色
                  if (value > this.lastPrice) {
                    return this.UP_COLOR
                  }

                  // 下方下跌的数值为绿色
                  if (value < this.klineData[0][3]) {
                    return this.DOWN_COLOR
                  }
                },
              },
            },
            // 第二个grid的y轴属性
            {
              // 去掉刻度值旁边的指示线
              axisTick: { show: false },
              splitNumber: 3,
              gridIndex: 1,
              interval: this.volumeInterval,
              max: this.volumeMax,
              min: 0,
              splitLine: {
                lineStyle: {
                  color: '#ECEEF2',
                  // 设置线条喂风格为虚线
                  type: 'dashed',
                },
              },
              axisLine: {
                lineStyle: {
                  color: '#ECEEF2',
                },
              },
              axisLabel: {
                //设置显示坐标轴的数值为不显示
                show: true,
                color: '#888',
              },
            },
            {
              // 去掉刻度值旁边的指示线
              axisTick: { show: false },
              splitNumber: 9,
              position: 'right',
              gridIndex: 0,
              interval: this.priceInterval,
              max: this.priceMax,
              min: this.priceMin,
              splitLine: {
                lineStyle: {
                  color: '#ECEEF2',
                  // 设置线条喂风格为虚线
                  type: 'dashed',
                },
              },
              axisLine: {
                lineStyle: {
                  color: '#ECEEF2',
                },
              },
              axisLabel: {
                fontSize: 10,
                margin: 0,
                // y轴的数值向内显示
                align: 'right',
                formatter: (value, index) => {
                  let persent = (value - this.lastPrice) / this.lastPrice
                  persent = persent < 0 ? persent * -1 : persent
                  persent = persent * 100
                  //console.log('persent is:' + persent.toFixed(2) + '%')
                  return persent.toFixed(2) + '%'
                },
                color: (value, index) => {
                  // 中间基准线的数值为黑色
                  if (parseFloat(value) === this.lastPrice) {
                    return this.NORMAL_COLOR
                  }

                  // 上涨区域的数字为红色
                  if (value > this.lastPrice) {
                    return this.UP_COLOR
                  }

                  // 下方下跌的数值为绿色
                  if (value < this.lastPrice) {
                    return this.DOWN_COLOR
                  }
                },
              },
            },
          ],
          /*dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: 0, //展示的数据范围，默认为50%-100%
            end: 500,
            position: 'bottom',
          },
          {
            show: true,
            xAxisIndex: [0, 1],
            type: 'slider',
            top: '90%',
            start: 0, //展示的数据范围，默认为50%-100%
            end: 50,
          },
        ],*/
          // 数据可以通过xAxisIndex，yAxisIndex属性，来指定是哪个grid的数据
          series: [
            // 第一个图表的数据
            {
              // 平滑曲线
              smooth: true,
              // 是否显示折线上的圆点
              symbol: 'none',
              // 线条颜色
              lineStyle: {
                color: '#0481F8',
                width: 1,
              },
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: this.gridData1,
              type: 'line',
              markArea: {
                data: [
                  [
                    {
                      name: '夜盘',
                      xAxis: '21:00',
                      itemStyle: {
                        color: 'rgba(112, 100, 250, 0.12)',
                      },
                    },
                    {
                      xAxis: '09:00',
                    },
                  ],
                  [
                    {
                      name: '日盘',
                      xAxis: '09:00',
                      itemStyle: {
                        color: 'rgba(112, 100, 250, 0)',
                      },
                    },
                    {
                      xAxis: '15:00',
                    },
                  ],
                ],
              },
              markLine: {
                silent: true,
                symbol: ['none', 'none'], //去掉箭头
                itemStyle: {
                  normal: {
                    lineStyle: {
                      color: '#888',
                    },
                  },
                },
                label: {
                  formatter: '{b}',
                },
                data: [
                  {
                    xAxis: '21:00',
                  },
                  {
                    xAxis: '09:00',
                  },
                  {
                    xAxis: '10:15',
                  },
                  {
                    xAxis: '11:30',
                  },
                ],
              },
              //areaStyle: {},
            },
            // 第二个图表的数据
            {
              xAxisIndex: 1,
              yAxisIndex: 1,
              // 柱状图柱子宽度
              barWidth: 1,
              data: this.gridData2,
              type: 'bar',
              // 设置柱状图颜色
              itemStyle: {
                normal: {
                  color: (params) => {
                    return this.volumeColor1[params.dataIndex]
                  },
                },
              },
              markLine: {
                silent: true,
                symbol: ['none', 'none'], //去掉箭头
                itemStyle: {
                  normal: {
                    lineStyle: {
                      color: '#888',
                    },
                  },
                },
                label: {
                  formatter: '{b}',
                },
                data: [
                  {
                    xAxis: '21:00',
                  },
                  {
                    xAxis: '09:00',
                  },
                  {
                    xAxis: '10:15',
                  },
                  {
                    xAxis: '11:30',
                  },
                ],
              },
            },
            {
              name: '占位',
              type: 'line',
              xAxisIndex: 1,
              yAxisIndex: 1, // 对应第二个x轴
              silent: true,
              markArea: {
                data: [
                  [
                    {
                      xAxis: '21:00',
                      itemStyle: {
                        color: 'rgba(112, 100, 250, 0.12)',
                      },
                    },
                    {
                      xAxis: '09:00',
                    },
                  ],
                ],
              },
            },
          ],
        }
        const myChart = echarts.init(document.getElementById('mychart'))
        myChart.setOption(option)
        //setInterval(this.initData(), 3000)
        //随着屏幕大小调节图表
        //window.addEventListener('resize', () => {
        // myChart.resize()
        //})
      },
      // 横坐标数据处理
      initxData() {
        for (let i = 0; i < this.klineData.length; i++) {
          this.xData[i] = this.klineData[i][8]
          //console.log('klineData Row is:' + this.klineData[i][1])
        }
        this.initCulomnColor()
      },
      // 初始化交易数据和交易柱状图颜色参数
      initCulomnColor() {
        this.culomnColor[0] = this.klineData[0][7] > 0 ? 1 : -1
        this.culomnValue[0] = [0, this.klineData[0][3], -1]
        for (let i = 1; i < this.klineData.length; i++) {
          this.culomnColor[i] =
            this.klineData[i][2] > this.klineData[i - 1][2] ? 1 : -1
          this.culomnValue[i] = [i, this.klineData[i][3], this.culomnColor[i]]
        }
      },
      // 数据计算以及拆分，将json数据转为数组数据
      splitData(jsonData) {
        /*console.log('kinlinedata is:' + jsonData)
const hourData = []
for (let i = 0; i < jsonData.length; i++) {
  hourData.push([
    i,
    jsonData[i][2],
    jsonData[i][7],
    jsonData[i][3],
    jsonData[i][7],
    jsonData[i][3],
    jsonData[i][8],
  ])
}
console.log('hourData is :' + hourData)
return hourData*/
      },
    },
  }
</script>
