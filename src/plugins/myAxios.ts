import axios, {AxiosInstance} from "axios";

const myAxios : AxiosInstance = axios.create({
    baseURL: 'http://localhost:8081/api',
    withCredentials: true // 允许携带凭证
});

// myAxios.defaults.withCredentials = true; // 允许携带cookie

// 添加请求拦截器
myAxios.interceptors.request.use(function (config) {
    console.log('我要发请求啦', config)
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
myAxios.interceptors.response.use(function (response) {
    console.log('我要收到响应啦', response)
    // 对响应数据做点什么
    return response.data;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default myAxios;
