export default {
  data() {
    return {
      ws: null,
      msg: 'hello world',
    }
  },
  created() {
    this.connectWebsocket()
  },
  methods: {
    connectWebsocket() {
      this.ws = new WebSocket('ws://127.0.0.1:8090/ZJJGWeb_war/websocket')
      this.ws.onmessage = (event) => {
        this.handleWebsocketMessage(event)
        console.log('connect is connected')
      }
      this.ws.onclose = () => {
        this.reconnectWebsocket()
      }
    },
    handleWebsocketMessage(event) {
      console.log('received message: ' + event.data)
    },
    /*reconnectWebsocket() {
      setTimeout(() => {
        this.connectWebsocket()
      }, 10000)
    },*/
    sendWebsocketMessage(data) {
      this.ws.send(data)
    },
  },
}
