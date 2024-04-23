import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { message, notification } from "antd";
import { userInfoUtils } from "./common";
import { useLoginStore } from "@stores/index";

interface IRequestOptions {
  url: string;
  options?: AxiosRequestConfig;
}
interface IResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

class HttpClient {
  private readonly instance: AxiosInstance;
  constructor(baseURL?: string) {
    this.instance = axios.create({ baseURL });
    this.instance.interceptors.response.use(
      this.handleSuccessResponse,
      this.handleErrorResponse
    );

    this.instance.interceptors.request.use(
      this.handleRequest,
      this.handleErrorRequest
    );
  }

  private handleRequest(requestConfig: InternalAxiosRequestConfig) {
    const a = useLoginStore.getState().token;
    console.log("token", a);
    const token = userInfoUtils.getToken();

    let headers = {} as InternalAxiosRequestConfig["headers"] as any;
    if (requestConfig.url?.includes("/oauth/token")) {
      headers = {
        ...requestConfig.headers,
        Authorization: "Basic enN5OnpzeTEyMzQ1Ng==",
      };
    } else {
      if (token) {
        headers = {
          ...requestConfig.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }
    requestConfig.headers = headers;
    return requestConfig;
  }

  private handleErrorRequest(error: any) {
    return Promise.reject(error);
  }
  private handleSuccessResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }
  private handleErrorResponse(error: any): Promise<never> {
    message.error(error.message || "请求失败");
    return Promise.reject(error);
  }
  public async request<T = any>(
    url: string,
    options: IRequestOptions["options"]
  ): Promise<IResponse<T>> {
    const response = await this.instance.request<T>({
      url,
      ...options,
    });

    const data = response.data || ({} as any);

    if (data?.code) {
      if (data?.code !== 200 && data?.msg !== "success") {
        notification.open({
          description: `${data?.data}` || "请求失败！",
          message: "请求错误",
          type: "error",
        });
        return {
          code: data?.code,
          message: data.msg,
          data: response.data,
        };
      }
    }

    return {
      code: response.status,
      message: response.statusText,
      data: response.data,
    };
  }
}

const http = new HttpClient();

export default http;
