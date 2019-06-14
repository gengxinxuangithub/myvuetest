/**
 * Created by 不动的推动者 on 2018/5/2.
 */
import {
  COLLAPSE,
  RECORDLIST
}from './mutation-type'

export default {
  //侧边栏
  ['COLLAPSE'](state) {
    state.collapse = !state.collapse
  },
  ['FLAGPICTURE'](state, data) {
    state.flagPicture = data
  }
}
