<template>
    <div style="height:100%;">
        <div class="header_container">
            <el-row>
                <el-col :span="18" style="height: 50px">
                    <img :src="url" class="header-icon"/>
                </el-col>
                <el-col :span="3" class="user-style">wulongbin-2@16..</el-col>
                <el-col :span="1" class="notify-style">{{ $t('manage.Notify') }}</el-col>
                <el-col :span="1" class="logout-style" style="cursor: pointer;"><span @click="logout">{{ $t('manage.LogOut') }}</span></el-col>
            </el-row>
        </div>
        <!-- <manage-center></manage-center> -->
    </div>
</template>
<script>
    export default {
        data(){
            return{
                url:require( '../../../static/image/Logo.png'),
            }
        },
		computed: {
			defaultActive: function(){
				return this.$route.path.replace('/', '');
			}
        },
        methods:{
            logout(){
                this.$router.push('index.html');
            },  
            changeLang(){
                
                let locale = this.$i18n.locale
                locale === 'zh' ? this.$i18n.locale = 'en' : this.$i18n.locale = 'zh'
                // LangStorage.setLang(this.$i18n.locale) //后面会用做切换和将用户习惯存储到本地浏览器
            },
        },
    }
</script>
<style  scoped>
        .header_container{
        height: 50px;
        /* line-height: 50px; */
        background-color: #000;
        color: white;
    }
    .header_left{
        float: left; 
        width: calc(20% - 50px);
        margin-top: 15px;
        margin-left: 50px;
        text-align: left;
    }
    .user-style,.notify-style,.logout-style{
        height: 50px;
        line-height: 50px;
    }
    .header_left_content{
        font-size: 13px;
        margin-top: 5px;
    }
    .header_tab{
        float: left; 
        width: 50%;
        margin-top: 15px;
    }
    .header_tablist{
        display: inline-block;
        width: 19%;
        cursor: pointer;
    }
    .header_right{
        float: right; 
        text-align: right;
        width: calc(30% - 50px);
        margin-top: 15px;
        margin-right: 50px;
    }
    .header_tiplist{
        display: inline-block;
        padding-right: 10px;
        cursor: pointer;
    }
    .header_tiplist + .header_tiplist{
        padding-left: 10px;
        border-left: 1px solid #000000;
    }
    .header-icon {
        width: 10%;
        top: 50%;
        position: absolute;
        transform: translateY(-50%);
        height: 65px;
    }
</style>