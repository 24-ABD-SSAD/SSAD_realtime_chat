export default class User {
    id: number;
    friendId: number;
    name: string;

    onlineStatus: boolean;
    mobile: string;
    nickName: string;
    avatar: string;

    constructor(id: number, friendId: number, name: string, onlineStatus: boolean, Code: string, mobile: string, nickName: string, avatar: string) {
        this.id = id;
        this.friendId = friendId;
        this.name = name;
        this.onlineStatus = onlineStatus;
        this.mobile = mobile;
        this.nickName = nickName;
        this.avatar = avatar;
    }
}