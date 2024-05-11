<template>
  <div>
    <!--<el-button @click="showChart">点击事件</el-button>!-->
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-autocomplete
              v-model.trim="queryForm.instrumentName"
              :trigger-on-focus="false"
              :fetch-suggestions="querySearchByInstrumentName"
              placeholder="合约名称"
              prefix-icon="el-icon-search"
              clearable
              @select="selectHandleByInstrumentName"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-autocomplete
              v-model.trim="queryForm.instrumentID"
              :trigger-on-focus="false"
              :fetch-suggestions="querySearchByInstrumentID"
              placeholder="合约代码"
              prefix-icon="el-icon-search"
              clearable
              @select="selectHandleByInstrumentID"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="queryForm.workDay"
              type="date"
              placeholder="选择日期"
              value-format="yyyyMMdd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="showChart"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
    <div id="myEcharts">
      <one-minute-echarts
        v-if="showChartData"
        ref="OneMinuteEcharts"
        :params="paras"
      ></one-minute-echarts>
    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts/lib/echarts'
  import OneMinuteEcharts from './components/OneMinuteEcharts'
  //import Test1 from './components/test1'
  import store from '@/store'
  import { GetInstrument } from '@/api/future_instrument'
  //import {GetAccInfoList} from "@/api/xzhouse_gjinfo";
  export default {
    components: {
      OneMinuteEcharts,
      //Test1,
    },
    data() {
      return {
        showChartData: false,
        list: [],
        instrumentlist: [],
        paras: {
          Loginuser: store.getters['user/username'],
          Instrumentid: '',
          Instrumentname: '',
          WorkDay: '',
          Flag: '0',
        },
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          instrumentID: '',
          instrumentName: '',
          workDay: '',
        },
      }
    },
    methods: {
      showChart() {
        this.paras.Instrumentid = this.queryForm.instrumentID
        this.paras.Instrumentname = this.queryForm.instrumentName
        this.paras.WorkDay = this.queryForm.workDay
        this.showChartData = true // 处理按钮点击事件
        //console.log('workday is' + this.queryForm.workDay)
      },
      arrayReuse(arr) {
        const res = new Map()
        return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
      },
      createStateFilterByInstrumentName(queryString) {
        return (list) => {
          return list.instrumentname.indexOf(queryString) >= 0
        }
      },

      createStateFilterByInstrumentID(queryString) {
        return (list) => {
          return list.instrumentid.indexOf(queryString) >= 0
        }
      },
      querySearchByInstrumentName(queryString, callback) {
        GetInstrument(store.getters['user/username'])
          .then((res) => {
            let retdata = res.data
            if (res.code === '200') {
              retdata.forEach((item, index) => {
                item.value = item.instrumentname
              })
              let instrumentnames = (this.instrumentlist = retdata)
              let results = queryString
                ? instrumentnames.filter(
                    this.createStateFilterByInstrumentName(queryString)
                  )
                : instrumentnames
              results = this.arrayReuse(results)
              clearTimeout(this.timeout)
              this.timeout = setTimeout(() => {
                callback(results)
              }, 100 * Math.random())
            } else {
              this.$message({
                type: 'error',
                message: res.data.code,
              })
            }
          })
          .catch((err) => {
            callback([]) //如果搜索不到数据需要传空   才会隐藏下拉框
          })
      },

      querySearchByInstrumentID(queryString, callback) {
        GetInstrument(store.getters['user/username'])
          .then((res) => {
            let retdata = res.data
            if (res.code === '200') {
              retdata.forEach((item, index) => {
                item.value = item.instrumentid
              })
              let instrumentids = (this.instrumentlist = retdata)
              let results = queryString
                ? instrumentids.filter(
                    this.createStateFilterByInstrumentID(queryString)
                  )
                : instrumentids
              results = this.arrayReuse(results)
              clearTimeout(this.timeout)
              this.timeout = setTimeout(() => {
                callback(results)
              }, 100 * Math.random())
            } else {
              this.$message({
                type: 'error',
                message: res.data.code,
              })
            }
          })
          .catch((err) => {
            callback([]) //如果搜索不到数据需要传空   才会隐藏下拉框
          })
      },

      selectHandleByInstrumentName(item) {
        this.queryForm.instrumentName = item.instrumentname
        this.queryForm.instrumentID = item.instrumentid
      },
      selectHandleByInstrumentID(item) {
        this.queryForm.instrumentID = item.instrumentid
        this.queryForm.instrumentName = item.instrumentname
      },
    },
  }
</script>
