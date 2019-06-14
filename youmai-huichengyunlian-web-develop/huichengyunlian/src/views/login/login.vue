<template>
  	<div class="login_page fillcontain">
			<div id="indexContainer">
				<img :src="url"/>
			</div>
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer" v-show="showLogin" v-if="active == 0">
					<div class="loginregister" >用户登录</div>
					<el-form :model="loginForm" :rules="rules" ref="loginForm">
						<el-form-item prop="username" label="登录账户">
							<el-input v-model="loginForm.username" placeholder="手机号/邮箱登录" @keyup.enter.native="submitForm('loginForm')"><span>dsfsf</span></el-input>
						</el-form-item>
						<el-form-item prop="password" label="登录密码">
							<el-input type="password" placeholder="密码" v-model="loginForm.password" @keyup.enter.native="submitForm('loginForm')"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button  type="primary" @click="submitForm('loginForm')" class="submit_btn">登录</el-button>
						</el-form-item>
						<el-row>
							<el-col :span="12" class="forget">
								<span style="color: white;">忘记密码</span>
							</el-col>
							<el-col :span="12" class="register">
								<span @click="toRegister" style="cursor: pointer;">注册账号</span>
							</el-col>
						</el-row>
					</el-form>
	  		</section>
		</transition>
	</div>
</template>

<script>
	import {clearError} from '@/utils';
    import {mapActions, mapState} from 'vuex'
		import axios from "axios"
		import {
    pca,
    pcaa
	} from 'area-data';
	  import {
    httpPost,
    httpGet,
    httpGetParams,
    httpDelete,
    httpPut
	} from "@/axios/api";
	export default {
	    data(){
			var validateSecondPass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.editPassword.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				showRegister:false,
				url:require( '../../../static/image/login_back.jpg'),
				loginForm: {
					username: '',
					password: '',
				},
				rules: {
					username: [
						{ required: true, message: '用户名', trigger: 'blur' },
					],
					password: [
						{ required: true, message: '密码', trigger: 'blur' }
					]
				},
				rules2: {
					username: [
						{ required: true, message: '用户名', trigger: 'blur' },
					],
					password: [
						{ required: true, message: '密码', trigger: 'blur' }
					],
					secondPassword: [
						{ required: true, message: '密码', trigger: 'blur' },
						{ validator: validateSecondPass, trigger: 'blur' }
					]
				},
				rules3:{
					clinicAdminName:[
						{required:true, message:'管理员姓名', trigger:'blur'}
					],
					clinicAdminPassword:[
						{required:true, message:'管理员密码', trigger:'blur'}
					],
					clinicAdminTelphone:[
						{required:true, message:'管理员手机号', trigger:'blur'},
						{pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,message: '手机号格式不正确'}
					],
					clinicname:[
						{required:true, message:'诊所名称', trigger:'blur'}
					],
					detailpos:[
						{required:true, message:'详细地址', trigger:'blur'}
					],
					size:[
						{required:true, message:'诊所规模', trigger:'blur'},
						{ type: 'number', message:'数字', trigger:'blur'}
					],
					excellent:[
						{required:true, message:'专业领域', trigger:'blur'}
					],
					clinicBriefDesc:[
						{required:true, message:'诊所介绍', trigger:'blur'}
					],
				},
				showLogin: false,
				active: 0,
				pca,
				pcaa,
				formLabelWidth: '100px',
				editPassword:{
					mobileIdentifyCode: '',
					password: '',
					username: '',
					secondPassword: ''
				},
				addClinic: {
					clinicname: '',
					size: "",
					detailpos: "",
					excellent: '',
					clinicAdminName: '',
					clinicAdminPassword: '',
					clinicAdminTelphone: '',
					clinicBriefDesc:'',
				},
				placeholders: ["选择省", "选择市", "选择地区"],
				selected: [], //数组对应的就是选中的那个省市区。根据type来确定是省市区汉字的数组还是编码组成的数组。
				selectedEdit: [], //数组对应的就是选中的那个省市区。根据type来确定是省市区汉字的数组还是编码组成的数组。
				dialogImageUrl: '',
				dialogImageUrl1: '',
				imgList: [],
				imgList1: [],
				dialogVisible: false,
				dialogVisible1: false,
			}
		},
		computed:{
			//...mapState(["tenantId","register"]),
		},
		mounted(){
			this.showLogin = true;
		},
		created(){
			if(window.location.href.indexOf('localhost') > -1){
				this.loginForm.username = '15389277682'
				//this.loginForm.username = '17723457678'
				this.loginForm.password = 'qaz12345'
			}
		},
		methods: {
			sureSubmit(addClinic){
				console.log(this.imgList)
				 let params = {
						"clinicAdminName": this.addClinic.clinicAdminName,
						"clinicAdminPassword": this.addClinic.clinicAdminPassword,
						"clinicAdminTelphone": this.addClinic.clinicAdminTelphone,
						"clinicAdminId": "",
						"clinicAddressDetail": this.addClinic.detailpos,
						"clinicCityCode": Number(this.selected[1]),
						"clinicCountryCode": Number(this.selected[2]),
						"clinicId": "",
						"clinicMajorField": this.addClinic.excellent,
						"clinicName": this.addClinic.clinicname,
						"clinicProvinceCode": Number(this.selected[0]),
						"clinicRemark": "",
						"clinicScale": this.addClinic.size,
						"clinicStatus": 0,
						"clinicQualification": this.qualifyList,
						"clinicWelcomePage":this.qualifyList1,
						"clinicValidDate": "",
						"clinicBriefDesc":this.addClinic.clinicBriefDesc
					}
				this.$refs[addClinic].validate((valid) => {
					let _this = this
					if (valid) {
						httpPost("http://www.yyzssoft.com/general/register", params).then(response => {
						if (response.success) {
							_this.dialogFormVisibleEdit = false;
							_this.$message({
								duration: 2000,
								message: '注册成功',
								type: 'success'
							});
							_this.showRegister = false
							// setTimeout(function() {
							// 	_this.$router.go(0);
							// },1000)
						}else{
							_this.$message({
								duration: 2000,
								message: response.message,
								type: 'error'
							});
						}
						}).catch(error => {
							_this.$message({
								duration: 2000,
								message: '注册出错了！',
								type: 'error'
							});
						});
					} else {
						return false;
					}
				});
			},
			toChangePass(){
				this.active = 1;
			},
			/*跳转忘记密码界面*/
			sureCheckPass(editPassword){
				this.$refs[editPassword].validate((valid) => {
					if (valid) {
						_.each(this.editPassword, (item, index) => {
							delete this.editPassword['secondPassword']
						})
						httpPut("/general/user/password", this.editPassword).then(response => {
						if (response.success) {
							_this.dialogFormVisibleEdit = false;

							_this.$message({
							duration: 2000,
							message: '修改成功了！',
							type: 'success'
							});
						}else{
							_this.$message({
							duration: 2000,
							message: response.message,
							type: 'error'
						});
						}

						}).catch(error => {
						_this.$message({
							duration: 2000,
							message: '修改出错了！',
							type: 'error'
						});
						});
					} else {
						return false;
					}
				});
			},
			/*跳转注册界面*/
			toRegister(){
				// this.showRegister = true
				// this.$nextTick(()=>{
				// 	clearError(this.$refs.addClinic.fields)
				// })
				// this.addClinic = {
				// 	clinicname: '',
				// 	size: "",
				// 	detailpos: "",
				// 	excellent: '',
				// 	clinicAdminName: '',
				// 	clinicAdminPassword: '',
				// 	clinicAdminTelphone: '',
				// 	clinicBriefDesc:'',
				// };
			},
			/*点击登录*/
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						var fd = new FormData();
						fd.append('username', this.loginForm.username)
						fd.append('password', this.loginForm.password)
						let config = {
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						}

						let _this = this;
						axios
						.post("/auth/login",fd,config)
						.then(res=>{
							if(res.data){
								if(res.data.status=="ok"){
									localStorage.setItem("username", this.loginForm.username)
									localStorage.setItem("password", this.loginForm.password)
									localStorage.setItem("tenantName", !!res.data.userInfo?res.data.userInfo.tenantName:'')
									_this.$store.state.tenantName = res.data.userInfo.tenantName;
									_this.$store.state.tenantId = res.data.userInfo.tenantCode;
									_this.$message({
										duration:2000,
										showClose: true,
										message: res.data.msg,
										type: 'success'
									});
																		
									if(!res.data.userInfo.authList || res.data.userInfo.authList.length == 0){
										this.$message.error('您暂无权限访问慧城天下，请联系管理员 姜珊波 17792855667 申请权限!')
									}else{
										let data = res.data.userInfo.authList[0]
										_this.$store.state.result={
											routePermit:{}, ticketPermit:{}, user:{},role:{},tenant:{},menu:{}//,config:{}
     								}
										if(data.leaf){
											_this.$router.push(data.menuUrl);
										}else{
											_this.$router.push(data.childrenMenuList[0].menuUrl);
										}
									}
								}else{
									_this.$message({
										duration:2000,
										showClose: true,
										message: res.data.msg,
										type: 'warning'
									});
								}
							}
						}).catch(error=>{
							console.log(error)
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			next() {
					if (this.active++ > 2) this.active = 0;
			},
			backLogin(){
				location.reload();
			},
			// 上传相关
			handleRemove(file, fileList) {
				if(fileList.length < 5){
					 $(".el-upload--picture-card").eq(0).removeClass("display-picJ")
				}
				this.dowithImgPath(fileList, "qualifyList");
			},
			// 上传相关
			handleRemove1(file, fileList) {
				if(fileList.length < 5){
					 $(".el-upload--picture-card").eq(1).removeClass("display-picJ")
				}
				this.dowithImgPath(fileList, "qualifyList1");
			},
			handleSuccess1(response, file, fileList) {
				if(fileList.length==5){
					$(".el-upload--picture-card").eq(1).addClass("display-picJ")
				}
				this.dowithImgPath(fileList, "qualifyList1");
			},
			handleSuccess(response, file, fileList) {
				if(fileList.length==5){
					$(".el-upload--picture-card").eq(0).addClass("display-picJ")
				}
				this.dowithImgPath(fileList, "qualifyList");
			},
			dowithImgPath(fileList, object) {
				if (fileList.length > 0) {
				let list = [];
				for (let a = 0; a < fileList.length; a++) {
					if (fileList[a].response) {
					list.push(fileList[a].response.data[0].filePath);
					} else {
					list.push(fileList[a].url.split("/").pop());
					}
				}
				this[object] = list;
				} else if (fileList == 0) {
				this[object] = [];
				}
			},
			handleRemoveEdit(file, fileList) {
				this.dowithImgPath(fileList, "qualifyListEdit");
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			handlePictureCardPreview1(file) {
				this.dialogImageUrl1 = file.url;
				this.dialogVisible1 = true;
			},
		}
	}
</script>

<style  scoped>

	#indexContainer img{
		position: absolute;
    	width: 100%;
    	height: 100%;
	}
	.bottom-title {
		position: absolute;
		width: 100%;
		bottom: 2%;
		padding: 10px;
		text-align: center;
	}
	.bottom-title .chName{
		color: #322b2b;
		font-size: 14px;
	}
	.login-title {
		position: absolute;
		top: 6%;
		padding: 10px;
		left: 10%;
	}
	.login-title .chName{
		font-weight: bold;
		font-size: 35px;
		color:#328B6F;
		text-shadow: 0px 0px 1px #4ED1AC;
	}
	.login-title .enName{
		color:#328B6F;
		font-size: 18px;
		text-shadow: 0px 0px 1px #4ED1AC;
	}
	.loginregister{
		font-size: 24px;
		margin-bottom:10px;
		color: #409EFF;
		text-align: left;
	}
	.text_left{
		text-align: left;
	}
	.login_page{
		left: 0;
		top: 0;
		bottom: 0;
		position: absolute;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		right: 0;
		/* background-image: url("../../static/image/login-background.jpg") */
	}
	.else-button{
 		font-size:12px;
		float:right;
		cursor: pointer;
	}
	.else-button + .else-button {
		padding-right:10px;
	}
	.manage_tip{
		position: absolute;
		width: 100%;
		top: -100px;
		left: 0;
		color: white;
		font-size: 25px;
	}
	.forget{
		text-align: left;
		font: 13.3333px Arial;
	}
	.register{
		text-align: right;
		
		font: 13.3333px Arial;
	}
	.submit_btn{
		width:100%;
		text-align: center;
		float: left;
	}
	.form_contianer{
		padding: 25px;
		border-radius: 5px;
		text-align: center;
		background-color: #fff;
		width: 20%;
		transform: translate(-50%,-50%);
		-webkit-transform:translate(-50%,-50%);
		-ms-transform: translate(-50%,-50%);
		-moz-transform: translate(-50%,-50%);
		position: absolute;
		left: 50%;
		top: 50%;
	}
	.tip{
		font-size: 12px;
		color: red;
	}
	.form-fade-enter-active, .form-fade-leave-active {
	  	transition: all 1s;
	}
	.form-fade-enter, .form-fade-leave-active {
	  	transform: translate3d(0, -50px, 0);
	  	opacity: 0;
	}
	.steps-password{
		width: 30%;
		margin: 0 auto;
		margin-top: 2.4%;
	}
	.token-get{
		display: flex;
		flex-direction: row;
	}
	.form_contianer-clinic{
		padding: 25px;
		border-radius: 5px;
		text-align: center;
		background-color: #fff;
		width: 60%;
		top: 55%;
		transform: translate(-50%,-50%);
		-webkit-transform:translate(-50%,-50%);
		-ms-transform: translate(-50%,-50%);
		-moz-transform: translate(-50%,-50%);
		position: absolute;
		margin-top:15px;
		left: 50%;
		border: 1px solid #ddd
	}
</style>
<style>
  @import '../common/common.css';
  	.display-picJ{
		display: none !important;
	}
</style>

