import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
    state:{
        index: 1
    },
    mutations:{
        changIndexMu(state,index){
            state.index = index
        },
    },
    actions:{
        changIndexAc(context,index){
            context.commit('changIndexMu',index)
        }
    }
})

export default store