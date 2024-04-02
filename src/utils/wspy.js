export default {
  data() {
    return {
      websock: null,
      textArea_test: '',
      count_t: 0,
    }
  },
  methods: {
    runSocket() {
      //   let count_rev = 0;
      this.ws = new WebSocket('ws://127.0.0.1:5678')
      this.ws.onopen = this.websocketonopen
      this.ws.onerror = this.websocketonerror
      this.ws.onmessage = this.websocketonmessage
      this.ws.onclose = this.websocketclose
    },

    // 定义 websocket open属性的函数
    websocketonopen: function () {
      console.log('WebSocket连接成功')
    },
    // 定义 websocket onerror属性的函数
    websocketonerror: function (e) {
      console.log('WebSocket连接发生错误')
      console.log(e)
    },
    // 定义 websocket onmessage属性的函数
    websocketonmessage: function (e) {
      this.count_t = this.count_t + 1
      console.log(this.count_t) //打印接收到了多少次服务端的消息
      this.textArea_test = e.data //改变界面上某个控件的展示内容
    },
    // 定义 websocket onclose属性的函数
    websocketclose: function (e) {
      console.log('connection closed')
      console.log(e)
    },

    openTest() {
      this.runSocket()
    },
  },
  created() {
    this.openTest()
  },
}
