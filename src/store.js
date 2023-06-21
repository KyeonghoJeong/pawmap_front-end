import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    beforePage: '',
  },
  mutations:{
    updateBeforePage(state, data){
      state.beforePage = data;
    },
  },
  getters:{
    getBeforePage: (state) => {
      return state.beforePage;
    },
  }
})