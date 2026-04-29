import { atom } from 'recoil';

export const toastState = atom({
  key: 'toastState',
  default:{
    message: '',
    type: '', // 'success', 'error', 'warning', 'info'
  },
});

export const AlertContentState = atom({
  key: 'AlertContentState',
  default: { type: 'info', title: '', message: '' }
});

export const AlertState = atom({
  key: 'AlertState',
  default: false
});
