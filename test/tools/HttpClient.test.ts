import axios from 'axios';
import { HttpClient, HttpResponse } from '../../lib/tools/HttpClient';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('#head', () => {

  it('should call Axios', async () => {
    // given
    const httpClient = new HttpClient();
    const url = 'http://some.url';
    mockedAxios.head.mockResolvedValueOnce({});

    // when
    await httpClient.head(url);

    // then
    expect(axios.head).toHaveBeenCalledWith(url);
  });

  it('should return an HttpResponse object', async () => {
    // given
    const httpClient = new HttpClient();
    const url = 'http://some.url';
    mockedAxios.head.mockResolvedValueOnce({
      data: null,
      status: 200,
      statusText: 'OK',
      headers: {
        'content-length': 6553,
        'content-type': 'image/jpeg',
      },
      config: {}
    });

    // when
    const response = await httpClient.head(url);

    // then
    expect(response).toBeInstanceOf(HttpResponse);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-length']).toBe(6553);
    expect(response.headers['content-type']).toBe('image/jpeg');
  });
});
