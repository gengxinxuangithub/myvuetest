<template>
    <div id="Home">
      <div class="wrapper">
          <sidebar @finish="finish"></sidebar>
          <div class="main" :class="{'content-collapse':collapse}">
            <head-top @onlineRegistration = "onlineRegistration" ></head-top>
            <!-- <tags></tags> -->
            <div class="container" v-if="showContent">
              <!--<tabs></tabs>-->
              <transition name="move" mode="out-in">
                <keep-alive>
                  <router-view v:key="key"></router-view>
                </keep-alive>
              </transition>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
  import {mapState} from 'vuex'
  import headTop from './layout/head'
  import sidebar from './layout/sidebar'
  //import tags from './layout/tags'
    export default {
      name: 'mainMenu',
      components:{
        headTop,
        sidebar,
        //tags,
      },
      data () {
        return {
            aa:null,
            showContent:false,
            registrationMessage:false,
        }
      },
      computed:{
        ...mapState({
          collapse:store=>store.collapse
        }),
        key(){
            return this.$route.path + Math.random();
        }
      },
      methods:{
        onlineRegistration(){
          this.registrationMessage = !this.registrationMessage
        },
        finish(val){
          this.showContent = val
        }
      }
    }
</script>
<style scoped>
.wrapper{
  position: relative;
}

</style>
