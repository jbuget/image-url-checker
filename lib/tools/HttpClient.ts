import axios, { AxiosRequestConfig } from 'axios';

class HttpClient {
  private _headers?: any;
  private _timeout?: number;

  set headers(value: any) {
    this._headers = value;
  }

  set timeout(value: number) {
    this._timeout = value;
  }

  async head(url: string): Promise<HttpResponse> {
    const config: AxiosRequestConfig = {};
    if (this._headers) {
      config.headers = this._headers;
    }
    if (this._timeout) {
      config.timeout = this._timeout;
    }
    const response = await axios.head(url, config);
    return new HttpResponse(response);
  }
}

class HttpResponse {
  private readonly _response: any;

  constructor(response: any) {
    this._response = response;
  }

  get statusCode(): number {
    return this._response.status;
  }

  get headers(): any {
    return this._response.headers;
  }
}

export { HttpClient, HttpResponse };
