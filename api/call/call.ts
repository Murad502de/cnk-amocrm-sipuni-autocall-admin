import { api } from '@/api';
import { call } from '@/domain/Call';

interface Error {
  response?: any;
};
interface CreateResponse {
  status: StatusCode,
  callUuid: string;
};
interface FetchResponse {
  status: StatusCode,
  call: call;
};
interface Response {
  status: StatusCode,
};

let error: Error = {};

export const createCall = async (
  name: string,
  sipuniCallId: number,
  amoPipelineId: number
): Promise<CreateResponse> => {
  console.debug('api/call/calls/createCall/name', name); //DELETE
  console.debug('api/call/calls/createCall/sipuniCallId', sipuniCallId); //DELETE
  console.debug('api/call/calls/createCall/amoPipelineId', amoPipelineId); //DELETE

  const payload = {
    name,
    amo_pipeline_id: amoPipelineId,
    sipuni_call_id: sipuniCallId,
  };

  console.debug('api/call/calls/createCall/payload', payload); //DELETE

  try {
    const response = await api.post(`calls`, payload);

    console.debug('api/call/calls/createCall/response', response); //DELETE

    const out: CreateResponse = {
      status: response.status,
      callUuid: response.data,
    };

    return out;
  } catch (e) {
    return Object.assign(error, e).response;
  }
};
export const fetchCallDetail = async (uuid: string): Promise<FetchResponse> => {
  console.debug('api/call/calls/fetchCallDetail', uuid); //DELETE

  try {
    const response = await api.get(`calls/${uuid}`);

    console.debug('api/call/calls/fetchCallDetail/response', response); //DELETE

    const out: FetchResponse = {
      status: response.status,
      call: response.data,
    };

    return out;
  } catch (e) {
    return Object.assign(error, e).response;
  }
};
export const updateCall = async (
  uuid: string,
  name: string,
  sipuniCallId: number,
  amoPipelineId: number
): Promise<Response> => {
  console.debug('api/call/calls/updateCall/uuid', uuid); //DELETE
  console.debug('api/call/calls/updateCall/name', name); //DELETE
  console.debug('api/call/calls/updateCall/sipuniCallId', sipuniCallId); //DELETE
  console.debug('api/call/calls/updateCall/amoPipelineId', amoPipelineId); //DELETE

  const payload = {
    name,
    amo_pipeline_id: amoPipelineId,
    sipuni_call_id: sipuniCallId,
  };

  console.debug('api/call/calls/createCall/payload', payload); //DELETE

  try {
    const response = await api.put(`calls/${uuid}`, payload);

    console.debug('api/call/calls/updateCall/response', response); //DELETE

    const out: Response = {
      status: response.status,
    };

    return out;
  } catch (e) {
    return Object.assign(error, e).response;
  }
};
export const deleteCall = async (uuid: string): Promise<Response> => {
  console.debug('api/call/calls/deleteCall', uuid); //DELETE

  try {
    const response = await api.delete(`calls/${uuid}`);

    console.debug('api/call/calls/deleteCall/response', response); //DELETE

    const out: Response = {
      status: response.status,
    };

    return out;
  } catch (e) {
    return Object.assign(error, e).response;
  }
};