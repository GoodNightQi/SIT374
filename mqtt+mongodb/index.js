/**
 * mongoDb 开始
 */
//引入第三方包
 const mongoose = require("mongoose");
 const Msg=require("./Models/Msg")
 mongoose
   .connect("mongodb://localhost/mqttmsg")
   .then(() => console.log("MongoDB 已连接"))
   .catch((err) => console.log(err));
/**
 * mongoDb 结束
 */
const mqtt = require('mqtt')
const host = 'broker.emqx.io'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
})

const topic = '/nodejs/mqtt'
client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })
  client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
})
client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
  const msg=new Msg({message:payload.toString()})
  msg.save();
  console.error(`消息:"${payload.toString()}",已入库！`)
})