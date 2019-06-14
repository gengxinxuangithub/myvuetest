// http响应拦截器
import axios from 'axios'

axios.interceptors.response.use(
    function(response) {
        if(response.status != 200) {
            this.$router.push('login');
        }else {
            return response
        }
    }
)