/* eslint-disable no-console */
import axios, {AxiosResponse, AxiosError} from 'axios';

interface IResponseData<T> {
    code?: number;
    msg?: string;
    status?: number;
    data: T;
}

const instance = axios.create();

instance.defaults.timeout = 5000;

// 响应拦截器即异常处理
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        const errMsg = response.data.msg;
        if (errMsg) {
            console.log(errMsg);
        }
        return response;
    },
    (error: AxiosError) => {
        function report() {
            const reportMessage
                = error.message.includes('timeout')
                    ? `接口超时: ${error.message}`
                    : /^5\d{2}$/.test(String(error.response?.status))
                        ? `接口${error.response?.status}: ${error.config?.url}`
                        : `接口错误: ${error.message}`;
            console.log(reportMessage);
        }
        if (error.config) {
            report();
        }
        return Promise.reject(error);
    }
);

const get = <T, U>(url: string, params: T) => instance.request<IResponseData<U>>({
    method: 'get',
    url,
    params,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    }
}).then(({data}) => data);

const post = <T, U>(url: string, data: T) => instance.request<IResponseData<U>>({
    method: 'post',
    url,
    data,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=UTF-8',
    }
}).then(({data}) => data);

export default {
    get,
    post,
};
