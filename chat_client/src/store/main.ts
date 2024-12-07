import {defineStore} from 'pinia'
import emojiList from "@/json/emoji.json"
import Conversition from "@/class/Conversition"
import edit from "wangeditor";
import Cookies from 'js-cookie'
import {getUserInfo} from '@/api/user'
import {Main} from '@/store/interface'
import {nextTick} from 'vue'

export const useMainStore = defineStore({
    id: 'main',
    state: (): Main => {
        return {
            token: Cookies.get('Authorization'),
            userInfo: null,
            drawer: false,
            recipient: null,
            readyRecipient: null,
            navId: '2',
            sessionList: [],
            sessionSelectId: 0,
            allSessionList: [],
            allSessionSelectId: 0,
            socket: null,
            navList: [
                {index: '1', lable: "Message List", icon: "i-ep-chat-dot-round"},
                {index: '2', lable: "User List", icon: "i-ep-user"},
            ],
            conversitionList: [],
            sendInfo: null,
            emojiList: emojiList,
            chatScrollbar: null,
            chatEditor: null,
            editor: null,
            editorData: '',
            openMusic: false,
            tipMusic: null
        }
    },
    actions: {
        setToken(data: any) {
            Cookies.set('Authorization', data?.token)
            this.token = data?.token
        },

        getUserInfo() {
            return new Promise((resolve, reject) => {
                getUserInfo().then((res: any) => {
                    if (res.code === 200) {
                        this.userInfo = res.data
                        resolve('获取成功')
                    } else
                        reject()
                }).catch(() => {
                    reject()
                })
            })
        },

        playMusic() {
            if (this.tipMusic != null && this.openMusic) {
                this.tipMusic.currentTime = 0
                this.tipMusic.play()
            }
        },

        toBottom() {
            const timer = setTimeout(() => {
                this.chatScrollbar?.setScrollTop(9999)
                clearTimeout(timer)
            }, 300)
        },

        changeReaded(id: number) {
            let userConversition = this.conversitionList.filter(
                (x) =>
                    x.sendId == id &&
                    x.recipientId == this.userInfo?.id &&
                    !x.isRead
            );
            if (userConversition.length) {
                userConversition.map((x) => {
                    x.isRead = true
                })
            }
            const query = {
                sendId: id
            }
            this.socket.emit("changeMsgRead", query)
        },

        initEditor() {
            if (this.editor != null) {
                this.editor.destroy();
                this.editor = null;
            }
            this.editor = new edit("#chatEditor")
            this.editor.config.showFullScreen = false
            this.editor.config.focus = true

            this.editor.config.menus = []

            this.editor.config.onchange = (html: any) => {
                this.editorData = html
            };

            this.editor.config.uploadImgMaxLength = 1
            this.editor.config.customUploadImg = function (
                files: any,
                insert: Function
            ) {
                insert(files)
            };
            nextTick(() => {
                this.editor.create()
                this.editor.txt.html(this.editorData)
            })
        },
        sendLocal(conversition: Conversition) {
            this.conversitionList.push(conversition)
            this.toBottom();
        },
        sendInfos(conversition: Conversition) {
            let data = {
                conversition
            }
            if (this.socket != null) {
                this.socket.emit("sendMsg", data);
            }
        },

        logout() {
            Cookies.remove('Authorization')
            this.$patch((state) => {
                state.userInfo = null
                state.token = undefined
                state.sessionList = []
                state.sessionSelectId = 0
                state.allSessionList = []
                state.allSessionSelectId = 0
            })
            if (this.socket != null) {
                this.socket.disconnect()
            }
        },
        Addfriend(id, friendId) {
            let data = {
                id,
                friendId
            }
            if (this.socket != null) {
                this.socket.emit("addFriend", data);
            }
        },
        Addgroup(id, groupId) {
            let data = {

                id,
                groupId
            }
            if (this.socket != null) {
                this.socket.emit("addGroup", data);
            }
        },
        deletefriends(id, friendId) {
            console.log(id, friendId)
            let data = {
                id,
                friendId
            }
            if (this.socket != null) {
                this.socket.emit("deleteFriend", data);
            }
        },
        Cgroup(id, name) {
            let data = {

                id,
                name
            }
            if (this.socket != null) {
                this.socket.emit("cGroup", data);
            }
        }
    }
})