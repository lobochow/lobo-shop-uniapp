import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import userStore from './user'
import cartStore from './cart'

export default new Vuex.Store({
    modules:{
        userStore,
		cartStore
    }
})