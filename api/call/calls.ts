import { api } from '@/api';
import { call } from '@/domain/Call';

interface Error {
  response?: any;
};
interface Response {
  status: StatusCode,
  calls: call;
};

let error: Error = {};

export const fetchCalls = async (): Promise<Response> => {
  // console.debug('api/call/calls/fetchCalls'); //DELETE

  try {
    const response = await api.get('calls');

    // console.debug('api/call/calls/fetchCalls/response', response); //DELETE

    const out: Response = {
      status: response.status,
      calls: response.data,
    };

    return out;
  } catch (e) {
    return Object.assign(error, e).response;
  }
};