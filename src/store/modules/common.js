import {setStore,  getStore,  removeStore} from '@/util/store'
import {  validatenull} from '@/util/validate'
import {  baseUrl} from '@/config/env';
import storejs from 'store';
const common = {
  state: {
    isCollapse: false,
    isFullScren: false,
    isLock: getStore({
      name: 'isLock'
    }) || false,
    theme: getStore({
      name: 'theme'
    }) || '#409EFF',
    lockPasswd: getStore({
      name: 'lockPasswd'
    }) || '',
     homeshowtag: storejs.get('homeTagshow')||false,
  	treeIndex:'1',
  },
  mutations: {
	  setTreeIndex:(state,payload)=>{
		  state.treeIndex = payload;
	  },
    SET_COLLAPSE: (state, action) => {
      state.isCollapse = !state.isCollapse;
    },    
    SET_FULLSCREN: (state, action) => {
      state.isFullScren = !state.isFullScren;
    },
    SET_LOCK: (state, action) => {
      state.isLock = true;
      setStore({
        name: 'isLock',
        content: state.isLock,
        type: 'session'
      })
    },
    SET_THEME: (state, color) => {
      state.theme = color;
      setStore({
        name: 'theme',
        content: state.theme,
      })
    },
    SET_LOCK_PASSWD: (state, lockPasswd) => {
      state.lockPasswd = lockPasswd;
      setStore({
        name: 'lockPasswd',
        content: state.lockPasswd,
        type: 'session'
      })
    },
    CLEAR_LOCK: (state, action) => {
      state.isLock = false;
      state.lockPasswd = '';
      removeStore({
        name: 'lockPasswd'
      });
      removeStore({
        name: 'isLock'
      });
    },
    switchhometag:(state,bool)=>{
        //开关tag组件的显示
        state.homeshowtag = bool;
    },
      shutcollapse: (state) => {
        state.isCollapse = true;
      },
  }
}
export default common