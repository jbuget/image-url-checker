import axios from 'axios';

class HttpClient {
  private _headers: any;

  set headers(value: any) {
    this._headers = value;
  }

  async head(url: string): Promise<HttpResponse> {
    let config;
    if (this._headers) config = { headers: this._headers };
    const response = config ? await axios.head(url, config) : await axios.head(url);
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
