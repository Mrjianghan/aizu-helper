import { getToken, setToken, removeToken } from '@/util/auth'
import { setStore, getStore } from '@/util/store'
import { validatenull } from '@/util/validate'
import {  getUserInfo, logout } from '@/api/login'
import { GetMenu } from '@/api/menu';
import storejs from 'store';
import { Message } from 'element-ui'
import router from '@/router/router'
const user = {
    state: {
        userInfo: getStore({ name: 'userInfo' }) || {},
        permissions: getStore({ name: 'permissions' }) || {},
        roles: getStore({ name: 'roles' }) || [],
        menu: [],
        access_token: getStore({ name: 'gzb_saas_access_token' }) || '',
        companyLogo:storejs.get('companyLogo'),
    },    
    actions: {
        GetTableData({ commit, state, dispatch }, page) {
            return new Promise((resolve, reject) => {
                getTableData(page).then(res => {
                    const data = res.data;
                    resolve(data);
                })
            })
        },
        GetUserInfo({ commit, state, dispatch },payload) {
            commit('SET_PERMISSIONS', payload.permissions)            
            commit('SET_USER_INFO', payload)            
        },
        // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.access_token).then(() => {
                    commit('SET_ACCESS_TOKEN', '')
                    commit('SET_USER_INFO','')
                    // commit('SET_ROLES', [])
                    commit('DEL_ALL_TAG');
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //注销session
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_ACCESS_TOKEN', '')
                commit('SET_USER_INFO','')
                // commit('SET_ROLES', [])
                commit('DEL_ALL_TAG');
                removeToken()
                resolve()
            })
        },
        //获取系统菜单  后台接口获取
        GetMenu({ commit }) {
            return new Promise((resolve,reject) => {
                GetMenu().then((res) => {
                    if(res.success){
                        let sortArr = res.data.sort((a,b)=>{
                            return a.sort - b.sort;
                        });
                        const data = res.data;
                        commit('SET_MENU', data);
                        resolve(data);
                    }else{
                        Message({
                            message: res.message,
                            type: 'error'
                        });
                    }                    
                }).catch((err)=>{
                    reject(err);
                })
            })
        },
    },
    mutations: {        
        changeLogo (state, payload) {
            state.companyLogo = payload
          },
        SET_ACCESS_TOKEN: (state, access_token) => {
            state.access_token = access_token;
            setStore({ name: 'gzb_saas_access_token', content: state.access_token, type: 'session' })
        },
        SET_MENU: (state, menu) => {
            state.menu = menu;
        },
        SET_USER_INFO: (state, userInfo) => {
            state.userInfo = userInfo
            setStore({ name: 'userInfo', content: state.userInfo, type: 'session' })
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
            setStore({ name: 'roles', content: state.roles, type: 'session' })
        },
        SET_PERMISSIONS: (state, permissions) => {
            let list = {}
            for (let i = 0; i < permissions.length; i++) {
                list[permissions[i]] = true
            }
            state.permissions = list
            setStore({ name: 'permissions', content: state.permissions, type: 'session' })
        }
    }
}
export default user