<template>
  <footer class="px-20px">
    <el-row type="flex" class="mb-10px">
      <el-popover placement="top" popper-class="chat-icon-popover" trigger="click">
        <template #reference>
          <div class="text-20px cursor-pointer dark:filter-invert-100">
            <img width="24" height="24" class="block" src="@/assets/emoji.svg">
          </div>
        </template>
        <el-scrollbar class="emoji" height="150px">
          <ul class="m0 p0 pr-2px flex flex-wrap">
            <li
                v-for="item in store.emojiList"
                :key="item.title"
                class="p-5px list-none hover:animate-heart-beat animate-count-animated animate-duration-1s cursor-pointer"
                :title="item.title"
            >
              <img width="30" height="30" :src="item.icon" @click="selectIcon(item.icon)"/>
            </li>
          </ul>
        </el-scrollbar>
      </el-popover>


    </el-row>
    <ChatEditor
        v-model="store.sendInfo"
        ref="editor"
        id="chatEditor"
        :height="135"
        class="answer-editor"
        placeholder="Input your message here"
    ></ChatEditor>
  </footer>
</template>

<script setup lang="ts">
import Conversition from "@/class/Conversition"
import {useMainStore} from "@/store/main"
import {ElMessage} from 'element-plus'
import {uploadFile} from "@/api/common"
import {ref, getCurrentInstance} from "vue"

const {proxy}: any = getCurrentInstance()
const store = useMainStore()
const editor = ref(null)

function selectIcon(icon: string) {
  let iconContent = `<img src='${icon}' class='emo-image' />`
  store.editor.cmd.do("insertHTML", iconContent)
}

function blurHighLight(data: any) {
  store.sendInfo = data
}


</script>