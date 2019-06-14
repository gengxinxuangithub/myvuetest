import router from "./router";

router.beforeEach((to, from, next) => {

  const user = localStorage.getItem('username');
  const pass = localStorage.getItem('password');
  if(to.path == '/login'){
    next();
  }else{
    if (user && pass) {
      next();
    } else {
      next('/login')
    }
  }

})