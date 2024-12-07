import request from "@/utils/request";

export function uploadFile(data: any) {
  return request({
    url: "/api/uploadFile",
    method: "post",
    data
  })
}