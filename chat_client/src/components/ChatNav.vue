<template>
  <div class="lg:w-7% w-30%">
    <el-menu
        default-active="2"
        class="h-100%"
        @select="handleSelect"
    >
      <div align="center" class="mb-20px">
        <el-avatar
            :src="store.userInfo?.avatar"
        >user
        </el-avatar>
        <div class="truncate mt-10px text-14px" :title="store.userInfo?.email" style="width: 80%;">
          {{ store.userInfo?.email }}
        </div>
      </div>
      <div v-for="item in store.navList" :key="item.index">
        <el-tooltip placement="left">
          <template #content>{{ item.lable }}</template>
          <el-menu-item :index="item.index" class="justify-center fw-bold text-24px">
            <el-badge :value="getUnReadCount(item.index)" :hidden="!getUnReadCount(item.index)" :max="10">
              <div :class="item.icon"></div>
            </el-badge>
          </el-menu-item>
        </el-tooltip>
      </div>
      <el-tooltip placement="left">
        <template #content>Add friend</template>
        <el-button type="primary" class="mt-40px" size="large" circle @click="showAddFriendDialog = true">
          <i i="ep-plus" class="fw-bold"></i>
        </el-button>
      </el-tooltip>
      <div>
        <el-tooltip placement="left">
          <template #content>Log out</template>
          <el-button type="danger" class="mt-40px" size="large" circle @click="logout">
            <i i="ep-switch-button" class="fw-bold"></i>
          </el-button>
        </el-tooltip>
      </div>
      
      <el-dialog
          title="Add Friend"
          :visible.sync="showAddFriendDialog"
          v-model="showAddFriendDialog"
          width="30%"
          @close="resetAddFriendForm"
      >
        <el-form :model="addFriendForm">
          <el-form-item label="Email" :label-width="formLabelWidth">
            <el-input v-model="addFriendForm.friendId" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showAddFriendDialog = false">Cancel</el-button>
          <el-button type="primary" @click="submitAddFriend">Add</el-button>
        </div>
      </el-dialog>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import Conversition from "@/class/Conversition"
import {computed} from "vue"
import {ref} from 'vue';
import router from "@/router"
import {useMainStore} from "@/store/main"

const store = useMainStore()

function logout() {
  store.logout()
  router.replace({
    name: "Login",
  })
}

const showAddFriendDialog = ref(false);
const addFriendForm = ref({
  friendId: ''
});
const formLabelWidth = '80px';

function resetAddFriendForm() {
  addFriendForm.value.friendId = '';
}

function submitAddFriend() {
  store.Addfriend(store.userInfo?.id, addFriendForm.value.friendId);
  console.log('addFriendForm', addFriendForm.value.friendId)
  showAddFriendDialog.value = false;
  window.location.reload()
}


const getUnReadCount = computed(() => {
  return (value: string) => {
    if (value !== '1') return 0
    let currentContent = store.conversitionList.filter(
        (x: Conversition) => x.recipientId == store.userInfo?.id && !x.isRead
    )
    return currentContent.length as number
  }
})

const handleSelect = (key: string) => {
  if (store.navId !== key) {
    store.navId = key
    if (store.navId === '1' && store.sessionSelectId) {
      store.conversitionList.forEach(item => {
        if (item.sendId === store.sessionSelectId && item.recipientId === store.userInfo?.id && !item.isRead) {
          item.isRead = true
        }
      })
      const query = {
        sendId: store.sessionSelectId
      }
      store.socket.emit("changeMsgRead", query)
    }
  }
}
</script>

<style lang="scss" scoped>
.ep-menu {
  .is-active {
    background: var(--ep-color-primary-light-9);
  }
}
</style>