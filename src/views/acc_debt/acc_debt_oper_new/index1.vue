<template>
  <div ref="myChart"></div>
</template>

<script>
  import * as echarts from 'echarts/lib/echarts'
  //import klineData from '../acc_debt_test/data/test1.json'
  import timedata from '@/views/acc_debt/acc_debt_oper_new/data/time.json'
  import axios from 'axios'
  import { GetGjinfoList } from '@/api/xzhouse_gjinfo'
  import store from '@/store'
  import { GetOneMinuteMD } from '@/api/future_md'
  //import { tv_update_TrendsSort } from '@/api/tv_manage/tv_manage' //这个自己封装好的接口文件

  export default {
    name: 'OneMinuteEcharts',
    //获取父组件的数据,（没必要获取父组件的数据可以删掉）
    data() {
      return {
        interval_timer: null,
        fileindex: 0,
        // 实时数据数组
        dataIndex: 0, //datagrid 索引
        prePrice: 0.0,
        gridData1: [[,]],
        gridData2: [[,]],
        gridData3: [[,]],
        gridData4: [[,]],
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
        querydata: {
          username: '',
          instrumentid: '',
          workday: '',
          updatemin: '',
          flag: '',
        },
        timearray: [
          '21:19',
          '21:20',
          '21:21',
          '21:22',
          '21:23',
          '21:24',
          '21:25',
          '21:26',
          '21:27',
          '21:28',
          '21:29',
          '21:30',
          '21:31',
          '21:32',
          '21:33',
          '21:34',
          '21:35',
          '21:36',
          '21:37',
          '21:38',
          '21:39',
          '21:40',
          '21:41',
          '21:42',
          '21:43',
          '21:44',
          '21:45',
          '21:46',
          '21:47',
          '21:48',
          '21:49',
          '21:50',
          '21:51',
          '21:52',
          '21:53',
          '21:54',
          '21:55',
          '21:56',
          '21:57',
          '21:58',
          '21:59',
          '22:00',
          '22:01',
          '22:02',
          '22:03',
          '22:04',
          '22:05',
          '22:06',
          '22:07',
          '22:08',
          '22:09',
          '22:10',
          '22:11',
          '22:12',
          '22:13',
          '22:14',
          '22:15',
          '22:16',
          '22:17',
          '22:18',
          '22:19',
          '22:20',
          '22:21',
          '22:22',
          '22:23',
          '22:24',
          '22:25',
          '22:26',
          '22:27',
          '22:28',
        ],
        // 折线图echarts初始化选项
        echartsOption: {
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
              data: timedata,
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
              data: timedata,
            },
          ],
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
                  if (value < this.lastPrice) {
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
            //console.log('xAis is:' + this.gridData1),
          ],
        },
      }
    },
    //监听父组件传过来的值,判断是否开启定时器，（没必要获取父组件的数据可以删掉用mounted() 周期函数）

    //不需要父组件数据的用这个
    mounted() {
      this.getOneMinuteChart()
    },
    beforeDestroy() {
      if (this.interval_timer) {
        clearInterval(this.interval_timer)
      }
    },
    methods: {
      getOneMinuteChart() {
        this.myChart = echarts.init(this.$refs.myChart, 'light') // 初始化echarts, theme为light
        this.myChart.setOption(this.echartsOption) // echarts设置初始化选项
        this.querydata.username = store.getters['user/username']
        this.querydata.instrumentid = 'SA405'
        this.querydata.workday = '20231222'
        this.querydata.flag = '0'
        this.addData()
        this.querydata.flag = '1'
        //setInterval(this.addData(), 60000) // 每三秒更新实时数据到折线图
        this.interval_timer = setInterval(async () => {
          await this.addData()
        }, 3000)
      },
      // 获取当前时间
      getTime: function () {
        var ts = arguments[0] || 0
        var t,
          h,
          i,
          t = ts ? new Date(ts * 1000) : new Date()
        h = t.getHours()
        i = t.getMinutes()
        // 定义时间格式
        return (h < 10 ? '0' + h : h) + ':' + (i < 10 ? '0' + i : i)
      },
      // 添加实时数据
      async addData() {
        // 从接口获取数据并添加到数组(这是自己封装好的接口)
        //this.klineData = klineData
        //let jsonData = klineData
        //this.fileindex = 2
        //let filename = './static/test' + this.fileindex.toString() + '.json'
        //console.log('filename is:' + filename)
        // axios.get(filename).then((response) => {
        //this.klineData = response.data
        //console.log('response is:' + this.klineData1)
        //const { data, code, msg } = await GetOneMinuteMD(this.querydata)
        //console.log('response is:' + this.klineData1)*/
        console.log('querydata flag is:' + this.querydata.flag)
        if (this.querydata.flag === '0') {
          this.gridData1.splice(0)
          this.gridData2.splice(0)
          this.gridData3.splice(0)
          this.gridData4.splice(0)
          const { data, code, msg } = await GetOneMinuteMD(this.querydata)
          this.klineData = data
          this.querydata.flag = '1'
        } else {
          this.querydata.updatemin = this.timearray[this.fileindex]
          //this.querydata.updatemin = this.getTime()
          const { data, code, msg } = await GetOneMinuteMD(this.querydata)
          this.klineData = data
          this.fileindex += 1
        }
        let jsonData = this.klineData
        this.lastPrice = jsonData[0]['presettlementprice']
        console.log('jsonData length is:' + jsonData.length)
        //console.log('jsonData is:' + jsonData[0]['presettlementprice'])
        //console.log('jsonData1 is:' + jsonData)
        //console.log('lastprice is:' + this.lastPrice)
        for (let i = 0; i < jsonData.length; i++) {
          {
            //上午数据
            if (jsonData[i]['highestprice'] > this.priceMax) {
              this.priceMax = jsonData[i]['highestprice']
            }
            if (
              jsonData[i]['lowestprice'] < this.priceMin ||
              this.priceMin === 0
            ) {
              this.priceMin = jsonData[i]['lowestprice']
            }
            this.gridData1.push([
              jsonData[i]['updateminute'],
              Number(jsonData[i]['lastprice']),
            ])

            if (jsonData[i]['volume'] > this.volumeMax) {
              this.volumeMax = jsonData[i]['volume']
            }
            if (
              jsonData[i]['volume'] < this.volumeMin ||
              this.volumeMin === 0
            ) {
              this.volumeMin = jsonData[i]['volume']
            }
            if (this.dataIndex === 0) {
              if (this.gridData1[this.dataIndex][1] >= this.lastPrice) {
                this.volumeColor1.push(this.UP_COLOR)
              } else {
                this.volumeColor1.push(this.DOWN_COLOR)
              }
              this.prePrice = this.gridData1[this.dataIndex][1]
              this.dataIndex += 1
            } else {
              if (this.gridData1[this.dataIndex][1] >= this.prePrice) {
                this.volumeColor1.push(this.UP_COLOR)
              } else {
                this.volumeColor1.push(this.DOWN_COLOR)
              }
              this.prePrice = this.gridData1[this.dataIndex][1]
              this.dataIndex += 1
            }
            this.gridData2.push([
              jsonData[i]['updateminute'],
              Number(jsonData[i]['volume']),
            ])
          }
        }
        //console.log('griddata1 len is:' + this.gridData1.length)
        //console.log('griddata2 len is:' + this.gridData2.length)
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
        //console.log('gridData1 is: ' + this.gridData1)
        this.echartsOption.series[0].data = this.gridData1
        this.echartsOption.series[1].data = this.gridData2
        this.echartsOption.yAxis[0].min = this.priceMin
        this.echartsOption.yAxis[0].max = this.priceMax
        this.echartsOption.yAxis[0].interval = this.priceInterval
        this.echartsOption.yAxis[1].max = this.volumeMax
        this.echartsOption.yAxis[1].interval = this.volumeInterval
        this.echartsOption.yAxis[2].min = this.priceMin
        this.echartsOption.yAxis[2].max = this.priceMax
        this.echartsOption.yAxis[2].interval = this.priceInterval
        this.myChart.setOption(this.echartsOption)
        //})
        //})
      },
    },
  }
</script>
