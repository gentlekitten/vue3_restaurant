// // store.ts
// import { InjectionKey } from 'vue'
// import { createStore, useStore as baseUseStore, Store } from 'vuex'
// import axios from 'axios'

// export interface State {
//     token: string | null
// }

// export const key: InjectionKey<Store<State>> = Symbol()

// export const store = createStore<State>({
//     state: {
//         token: sessionStorage.getItem('user') ? sessionStorage.getItem('user') : ''
//     },
//     mutations: {
//         SET_TOKEN(state, token) {
//             state.token = token
//         }
//     },
//     actions: {
//         LoginByUsername(state) {
//             return new Promise((resolve, reject) => {
//                 axios.get(
//                     'http://rap2.taobao.org:38080/app/mock/248005/api/getUserInfo'
//                 ).then((response:any) => {
//                     const data = response.data.data
//                     sessionStorage.setItem('user', data) // 登录成功后将token存储在cookie之中
//                     state.commit('SET_TOKEN', data)
//                     resolve(response)
//                 }).catch(error => {
//                     reject(error)
//                 })
//             })
//         }
//     }
// })

// // 定义自己的 `useStore` 组合式函数
// export function useStore() {
//     return baseUseStore(key)
// }