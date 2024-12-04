import request from "@/utils/request"

export function getUserInfo() {
    return request({
        url: "/api/userInfo",
        method: "get"
    })
}

export function userList() {
    return request({
        url: "/api/userList",
        method: "get"
    })
}

export function login(data: any) {
    return request({
        url: "/api/login",
        method: "post",
        data
    })
}

export function sendEmailCode(data: any) {
    return request({
        url: "/api/sendEmailCode",
        method: "post",
        data
    })
}

export function reguser(data: any) {
    return request({
        url: "/api/reguser",
        method: "post",
        data
    })
}