<template>
  <div
    id="mychart"
    className="Echarts"
    style="width: 100%; height: 500px"
  ></div>
</template>

<script>
  import * as echarts from 'echarts/lib/echarts'
  import klineData from './data/test1.json'

  export default {
    data() {
      return {
        upcolor: '#FF0000', //增长颜色
        upBorderColor: '#8A0000',
        downColor: '#008000', // 下跌颜色
        downBorderColor: '#008F28',
        klineData: [], //k线图数据
        hourData: [], //charts表格小时数据
        xData: [],
        culomnColor: [], //颜色
        culomnValue: [],
      }
    },
    mounted() {
      // 数据初始化
      this.initData()
      // 图标初始化
      this.initEcharts()
    },
    methods: {
      initData() {
        this.klineData = klineData
        this.hourData = this.splitData(this.klineData)
        //this.hourData = this.klineData
        this.initxData()
      },
      initEcharts() {
        const option = {
          title: {
            text: '玻璃合约401',
            left: 0,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross', //十字准星指示器
            },
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
              color: '#000',
            },
            formatter: function (param) {
              param = param[0]
              return [
                '时间: ' + param.data[6] + '<hr size=1 style="margin: 3px 0">',
                '价格: ' + param.data[1] + '<br/>',
                '涨跌额: ' + param.data[2] + '<br/>',
                '成交量: ' + param.data[3] + '<br/>',
                '涨跌幅: ' + param.data[4] + '<br/>',
              ].join('')
            },
          },

          visualMap: {
            type: 'piecewise',
            show: false, //不展示map，只应用对应颜色划分逻辑
            seriesIndex: 1, //指定取哪个系列的数据
            dimension: 2,
            // 定义每一段的颜色
            pieces: [
              {
                value: -1,
                color: this.downColor,
              },
              {
                value: 1,
                color: this.upcolor,
              },
            ],
          },
          // 图像位置配置
          grid: [
            {
              left: '10%',
              right: '10%',
              height: '50%',
            },
            {
              left: '10%',
              right: '10%',
              top: '65%',
              height: '18%',
            },
          ],
          // 横坐标数据
          xAxis: [
            // 折线图
            {
              type: 'category',
              data: this.xData,
              boundaryGap: false,
              axisLine: { onZero: false },
              splitLine: { show: false },
              min: 'dataMin',
              max: 'dataMax',
            },
            // 柱状图
            {
              type: 'category',
              gridIndex: 1, //x 轴所在的 grid 的索引，默认位于第一个 grid。
              data: this.xData,
              boundaryGap: false,
              axisLine: { onZero: false },
              axisTick: { show: false },
              splitLine: { show: false },
              axisLabel: { show: false },
              min: 'dataMin',
              max: 'dataMax',
            },
          ],
          // 纵坐标配置
          yAxis: [
            {
              scale: true,
              splitArea: {
                show: true,
              },
            },
            {
              scale: true,
              gridIndex: 1, // y 轴所在的 grid 的索引，默认位于第一个 grid
              splitNumber: 2,
              axisLabel: { show: false },
              axisLine: { show: false },
              axisTick: { show: false },
              splitLine: { show: false },
            },
          ],
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0, 1],
              start: 50, //展示的数据范围，默认为50%-100%
              end: 100,
            },
            {
              show: true,
              xAxisIndex: [0, 1],
              type: 'slider',
              top: '90%',
              start: 50, //展示的数据范围，默认为50%-100%
              end: 100,
            },
          ],
          series: [
            {
              type: 'line',
              data: this.hourData,
              symbol: 'none', //无标记图案
              lineStyle: {
                width: 1,
              },
              smooth: true,
              areaStyle: {},
            },
            {
              name: 'Volume',
              type: 'bar',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: this.culomnValue,
            },
          ],
        }
        const myChart = echarts.init(document.getElementById('mychart'))
        myChart.setOption(option)
        //随着屏幕大小调节图表
        window.addEventListener('resize', () => {
          myChart.resize()
        })
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
        console.log('kinlinedata is:' + jsonData)
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
        return hourData
      },
    },
  }
</script>
