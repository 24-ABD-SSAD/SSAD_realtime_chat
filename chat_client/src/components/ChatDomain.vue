<template>
  <div class="chat-session lg:w-20% w-70% p-8px box-border">
    <el-scrollbar max-height="100%">
      <template v-for="item in handleSessionList" :key="item">

        <div
            v-if="true"
            class="session-item px-20px py-10px cursor-pointer rounded-6px"
            :class="[
            (store.navId === '1' && item.id === store.sessionSelectId) || (store.navId === '2' && item.id === store.allSessionSelectId) ? 'session-active' : '',
          ]"
            @click="selectSession(item)"
        >
          <el-row type="flex" align="middle">
            <el-badge :value="getUnReadCount(item.id)" :max="10"
                      :hidden="!(getUnReadCount(item.id) && store.navId === '1')">
              <el-avatar shape="square" class="!block" :size="40" fit="cover" :src="item.avatar"/>
            </el-badge>
            <div class="w-50% ml-10px text-left">
              <div class="truncate">{{ item.email }}</div>
              <div class="truncate text-12px mt-2px" style="color: var(--ep-color-primary-light-3)"
                   v-show="store.navId === '1'" v-html="getLastSession(item.id)"></div>
            </div>
          </el-row>
        </div>

      </template>
      <el-empty v-if="!handleSessionList.length" :image-size="100" description="Friend list is empty"/>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import User from "@/class/User"
import {computed, nextTick} from "vue"
import Conversition from "@/class/Conversition"
import {useMainStore} from "@/store/main"

const store = useMainStore()

const getUnReadCount = computed(() => {
  return (id: Number) => {
    return getUnReadCountById(id)
  }
})

const handleSessionList = computed(() => {
  return store.navId === '1' ? store.sessionList : store.allSessionList
})

const getLastSession = computed(() => {
  return (id: Number) => {
    let currentContent: Array<Conversition> = store.conversitionList.filter(
        (x: Conversition) =>
            (x.sendId === store.userInfo?.id && x.recipientId === id) ||
            (x.sendId === id && x.recipientId === store.userInfo?.id)
    );
    let result = "";
    if (currentContent.length > 0) {
      let len = currentContent.length - 1;
      switch (currentContent[len].type) {
        case 0:
          result = currentContent[len].content;
          break;
        case 1:
          result = "Image";
          break;
        case 2:
          result = "Video";
          break;
      }
    }
    return result;
  };
});

function getUnReadCountById(id: Number) {
  let currentContent = store.conversitionList.filter((item: Conversition) =>
      (item.sendId === id) && (item.recipientId === store.userInfo.id) && !item.isRead
  )
  return currentContent.length
}

function selectSession(item: User) {
  store.drawer = false
  if (store.navId === '1') {
    store.sessionSelectId = item.id
    store.recipient = item
    store.changeReaded(item.id)
    store.initEditor()
    store.toBottom()
  } else if (store.navId === "2") {
    store.allSessionSelectId = item.id
    store.readyRecipient = item
  }
}
</script>

<style scoped lang="scss">
$selectBg: var(--ep-color-primary-light-9);
.chat-session {
  :deep(p) {
    margin: 0;
  }

  border-right: 1px solid var(--ep-border-color);
  @media (max-width: 1024px) {
    border-right: none;
  }

  .session-item {
    &:hover {
      background: $selectBg;
    }
  }

  .session-active {
    background: $selectBg;
  }
}
</style>
