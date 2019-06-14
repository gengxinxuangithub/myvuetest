/**
 * Created by 不动的推动者 on 2018/5/2.
 */
import {
  COLLAPSE,
  RECORDLIST,
  FLAGPICTURE
}from './mutation-type'


export default {
  getCollapse({commit}){
    commit('COLLAPSE');
  },

  getFlagPicture({ commit }, data) {
    commit('FLAGPICTURE', data);
  }
}
