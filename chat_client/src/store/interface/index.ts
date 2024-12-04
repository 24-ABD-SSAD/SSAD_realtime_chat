import User from "@/class/User"

export interface Main {
    token: string | undefined,
    userInfo: User | null,
    drawer: boolean,
    recipient: User | null,
    readyRecipient: User | null,
    navId: string,
    sessionList: Array<any>,
    sessionSelectId: number,
    allSessionList: Array<any>,
    allSessionSelectId: number,
    socket: any,
    navList: Array<{ index: string, lable: string, icon: string }>,
    conversitionList: Array<any>,
    sendInfo: User | null,
    emojiList: Array<{ title: string; icon: string }>,
    chatScrollbar: any,
    chatEditor: any,
    editor: any,
    editorData: string,
    openMusic: boolean,
    tipMusic: HTMLMediaElement | null,
}