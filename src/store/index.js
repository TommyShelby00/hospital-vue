import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    token: '',
    avatar: '',
    orgId: '',
    docId: '',
    orgName: '',
    docName: '',
    id: '',
    roomId: '',
    searchOrg: '',
    searchDoc: ''
  },
  getters: {},
  mutations: {
    setToken(state, value) {
      state.token = value;
    },
    removeToken(state) {
      state.token = ''
    },
    setUsername(state, value) {
      state.username = value
    },
    setAvatar(state, value) {
      state.avatar = value;
    },
    setOrgId(state, value) {
      state.orgId = value;
    },
    setDocId(state, value) {
      state.docId = value;
    },
    setOrgName(state, value) {
      state.orgName = value;
    },
    setDocName(state, value) {
      state.docName = value;
    },
    setId(state, value) {
      state.id = value;
    },
    setRoomId(state, value) {
      state.roomId = value
    },
    setSearchOrg(state, value) {
      state.searchOrg = value
    },
    setSearchDoc(state, value) {
      state.searchDoc = value
    },
    restart(state) {
      state.username = '';
      state.token = '';
      state.avatar = '';
      state.orgId = '';
      state.docId = '';
      state.orgName = '';
      state.docName = '';
      state.id = '';
      state.roomId = '';
      state.searchOrg = '';
      state.searchDoc = '';
    }

  },
  actions: {},
  modules: {},
  plugins: [createPersistedState({
    storage: window.localStorage, // 使用sessionStorage存储数据
  })],
})