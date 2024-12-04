<template>
  <el-button
      class="fixed top-58px left-10px z-2 p-2px text-16px"
      type="primary"
      text
      @click="store.drawer = !store.drawer"
  >
    <i v-if="!store.drawer" class="i-ep-expand"></i> <i v-else class="i-ep-fold"></i>
  </el-button>
  <el-row type="flex" class="w-full border-rounded-33px">
    <el-drawer v-model="store.drawer" size="90%" :lock-scroll="true" direction="ltr">
      <el-row>
        <ChatNav/>
        <ChatDomain/>
      </el-row>
    </el-drawer>
    <ChatNav class="lg:block hidden"/>
    <ChatDomain class="lg:block hidden"/>
    <ChatContent/>
  </el-row>
</template>

<script setup lang="ts">
import {userList} from "@/api/user.js"
import {onMounted, getCurrentInstance, ref} from "vue"
import Conversition from "@/class/Conversition"
import io from "socket.io-client"
import {useMainStore} from "@/store/main"
import {ElMessage} from 'element-plus'
import router from '@/router'

const store = useMainStore()
const {proxy}: any = getCurrentInstance()

const chatUrl: any = import.meta.env.VITE_BASE_API || "/"

onMounted(() => {
  init()
})

async function init() {
  if (store.token) {
    initSocket()
    if (!store.allSessionList.length) {
      getUserList()
    }
  }
}

function getUserList() {
  userList().then((res: any) => {
    if (res?.code == 200) {
      store.allSessionList = res?.data
    } else {
      proxy.$message.error(res?.message)
    }
  })
}

function initSocket() {

  store.socket = io(chatUrl, {
    auth: {
      token: store.token
    }
  })

  store.socket.on("connect", () => {
    console.log("Connected")
    store.socket.emit("joinChat")
  })

  store.socket.on("disconnect", () => {
    console.log("Disconnected")
  })

  store.socket.on("changMsgstatus", (data: any) => {
    store.conversitionList.map((x: Conversition) => {
      if (x.timestamp != null && x.timestamp == data.timestamp) {
        x.status = 1
      }
    })
  })

  store.socket.on("joinSuccess", (data: any) => {
    store.userInfo && (store.userInfo.onlineStatus = true)
    store.conversitionList = data.conversition
    store.sessionList = data.historySessionList
  })

  store.socket.on("reviceMsg", (data: Conversition) => {
    if (data.recipientId == store.userInfo?.id) {
      store.playMusic()
      if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function (status) {
          var n = new Notification("Notification", {
            body: "You have a new message",
          })
        })
      }
      for (let item of store.sessionList) {
        if (item.id == data.sendId && store.sessionSelectId == data.sendId && store.navId === '1') {
          data.isRead = true
          let query = {
            sendId: data.sendId
          }
          store.socket.emit("changeMsgRead", query)
          break
        }
      }
    }

    store.sendLocal(data)
    let len =
        store.sessionList.filter((x: any) => x.id == data.sendId)?.length ?? 0
    if (len === 0) {
      let item = store.allSessionList.filter((x: any) => x.id == data.sendId)
      store.sessionList.push(...item)
    }
    store.toBottom()
  })

  store.socket.on("squeezeOut", () => {
    store.logout()
    ElMessage.error("Logged in elsewhere, session disconnected")
    router.push({
      name: "Login"
    })
  })

  store.socket.on("forceOut", () => {
    store.logout()
    ElMessage.error("Session expired")
    router.push({
      name: "Login"
    })
  })

}
</script>

<style lang="scss" scoped>
:deep(.ep-drawer__header) {
  padding: 10px;
  margin-bottom: 0px;
}
</style>