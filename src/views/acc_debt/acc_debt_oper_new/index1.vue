<template>
  <div>
    <button @click="showChart">点击事件</button>
    <div id="myEcharts">
      <test v-if="showChartData" ref="test"></test>
    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts/lib/echarts'
  import Test from './components/test'
  //import Test1 from './components/test1'

  export default {
    components: {
      Test,
      //Test1,
    },
    data() {
      return {
        showChartData: false,
      }
    },
    methods: {
      showChart() {
        this.showChartData = true // 处理按钮点击事件
      },
    },
  }
</script>
