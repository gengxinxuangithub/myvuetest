<template>
    <div>
         <div id="indexContainer"><img :src="qrUrl"/></div>
    </div>
</template>

<script>
import axios from "axios"
export default {
    data(){
        return {
            qrUrl:'',
        }
    },
    created(){
        this.getTransferInfo()
    },
    methods:{
        getTransferInfo(){
            let _this = this;
            axios
            .get("http://www.hctx365.cn/line/forward/record?&lineId="+this.$route.query.lineId)
            .then(res=>{
                if(res.data.success&&res.data.data){
                    _this.qrUrl = "http://www.hctx365.cn/img/"+res.data.data[0].forwardQrCode;
                }
            })
        },
    }
}
</script>

<style scoped>
     #indexContainer img{
    	width: 100%;
    	height: 100%;
	}
</style>


