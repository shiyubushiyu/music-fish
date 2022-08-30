// 网络请求类
export class VRequest {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  request(options) {
    const { url, data } = options;
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        url: `${this.baseURL}${url}`,
        success(res) {
          resolve(res.data);
        },
        fail(err) {
          console.log("err:", err);
          reject(err);
        },
      });
    });
  }
  get(options) {
    return this.request({ ...options, method: "get" });
  }
  post(options) {
    return this.request({ ...options, method: "post" });
  }
}
