import axios from 'axios';

class HttpClient {
  async head(url: string): Promise<HttpResponse> {
    const response = await axios.head(url);
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
