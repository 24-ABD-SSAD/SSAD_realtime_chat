<template>
  <div class="lg:w-73% w-100%">
    <div
        v-show="store.navId === '1' && store.sessionSelectId !== 0"
    >
      <ChatHead></ChatHead>
      <div class="px-20px h-500px">
        <el-scrollbar class="rounded-6px box-border" max-height="100%" ref="chatScrollbar"
                      style="background: var(--ep-color-primary-light-9);">
          <div
              class="p-20px">
            <template v-for="(item, index) in conversitionList" :key="index">
              <div class="text-12px my-20px text-center" style="color: var(--ep-color-primary-light-3);">
                {{ renderMessageDate(item, index, conversitionList) }}
              </div>
              <el-row type="flex" class="mb-20px" :class="item.sendId == store.userInfo?.id && 'flex-row-reverse'">
                <el-avatar
                    :size="42"
                    :src="item.avatar"
                />
                <div v-if="item.type === 0" :class="item.sendId == store.userInfo?.id ? 'mr-10px': 'ml-10px'"
                     style="color: var(--ep-color-primary)"
                     class="text break-words px-15px rounded-6px text-left py-12px" v-html="item.content"></div>
                <div v-else :class="item.sendId == store.userInfo?.id ? 'mr-10px': 'ml-10px'">
                  <el-image
                      v-if="item.type === 1"
                      class="w-200px ha max-h-200px"
                      :src="item.content"
                      :preview-src-list="[item.content]"
                      :initial-index="4"
                      fit="cover"
                  />
                  <video
                      v-if="item.type === 2"
                      width="300"
                      height="180"
                      controls
                  >
                    <source :src="item.content" type="video/mp4"/>
                    No support video playback
                  </video>
                </div>
                <el-icon v-if="item.status === 0" :class="item.sendId == store.userInfo?.id ? 'mr-10px': 'ml-10px'"
                         class="is-loading pt-5px" size="40px">
                  <i i="ep-loading" style="color: var(--ep-color-primary-light-3)"></i>
                </el-icon>
              </el-row>
            </template>
          </div>
        </el-scrollbar>
      </div>

      <ChatFoot class="mt-20px"></ChatFoot>
    </div>


    <el-row
        v-if="store.navId === '2' && store.allSessionSelectId !== 0"
        class="lg:h-736px h-500px px-20px"
        type="flex"
        align="middle"
        justify="center"
    >
      <div>
        <el-avatar :size="120" :src="store.readyRecipient?.avatar">
          user
        </el-avatar>
        <div class="text-left mt-40px">
          <div>
            <span>Email: </span>
            {{ store.readyRecipient?.email }}
          </div>
          <div class="mt-10px">
            <span>Account: </span>
            {{ store.readyRecipient?.name }}
          </div>
        </div>
        <el-button
            type="primary"
            size="large"
            round
            class="w-180px mt-30px"
            @click="readySend"
        >Send Message
        </el-button
        >
        <div>
          <el-button
              type="danger"
              size="large"
              round
              class="w-180px mt-30px"
              @click="deletefriends"
          >Delete
          </el-button
          >
        </div>
      </div>
    </el-row>

    <el-row v-else-if="store.navId !== '1' || store.sessionSelectId === 0" type="flex" align="middle" justify="center"
            class="lg:h-736px h-500px">
      <div>
        <el-avatar :size="120" :src="store.userInfo?.avatar">
          user
        </el-avatar>
        <div class="text-left mt-20px">
          <div class="text-center text-26px fw-700 mb-30px" style="color: var(--ep-color-primary-light-3)">My Info</div>
          <div>
            <span>Email: </span>
            {{ store.userInfo?.email }}
          </div>
          <div class="mt-10px">
            <span>Account: </span>
            {{ store.userInfo?.name }}
          </div>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import Conversition from "@/class/Conversition"
import {onMounted, computed, ref, nextTick} from "vue"
import {useMainStore} from "@/store/main"
import {formatTime} from "@/utils"

const store = useMainStore()
const chatScrollbar = ref(null)

function deletefriends() {
  console.log('deletefriends', store.readyRecipient?.id)
  store.deletefriends(store.userInfo?.id, store.readyRecipient?.id)
  window.location.reload()
}

onMounted(() => {
  nextTick(() => {
    store.chatScrollbar = chatScrollbar.value
  })
})

const conversitionList = computed(() => {
  return store.conversitionList.filter(
      (x: Conversition) =>
          (x.sendId == store.userInfo?.id && x.recipientId == store.recipient?.id) ||
          (x.recipientId == store.userInfo?.id && x.sendId == store.recipient?.id)
  )
})

const renderMessageDate = computed(() => {
  return (message: any, index: number, messages: Array<any>) => {
    if ((message && index === 0) || (message && message.timestamp - messages[index - 1].timestamp > 5 * 60 * 1000)) {
      return `- - ${formatTime(message.timestamp)} - -`
    }
    return "";
  }
})

function readySend() {
  store.sessionSelectId = store.readyRecipient.id
  store.recipient = store.readyRecipient
  store.navId = '1'
  store.initEditor()
  let len =
      store.sessionList.filter((x: any) => x.id == store.readyRecipient?.id)
          ?.length ?? 0
  if (!len) {
    store.sessionList.push(store.readyRecipient)
    let query = {
      recipient: store.readyRecipient
    }
    store.socket.emit("insertHistorySession", query)
  }
  store.toBottom()
  store.changeReaded(store.readyRecipient.id)
}

</script>

<style scoped lang="scss">
.emo-image {
  height: 30px;
  width: 30px;
  vertical-align: middle;
  display: inline-block;
}

.text {
  background: var(--ep-color-primary-light-7);
  max-width: calc(100% - 140px);
  line-height: 20px;

  :deep(p) {
    margin: 0;
  }
}
</style>
