import { defineStore } from 'pinia';
import { call } from '@/domain/call';

interface State {
  call: call | null;
  callList: Array<call>;
}

export const usecallstore = defineStore('callstore', {
  state: (): State => {
    return {
      call: null,
      callList: [],
    }
  },

  getters: {
    call: (state): call | null => {
      // console.debug('store/callstore/call'); //DELETE

      return state.call;
    },
    callList: (state): Array<call> => {
      // console.debug('store/callstore/callList'); //DELETE

      return state.callList;
    },
  },
  actions: {},
})