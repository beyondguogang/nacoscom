let vm = new Vue({
    el:'#app',
    data:{
      msm:'',
      msg:'',
    shows_name:'',
    shows_pas:'',
    loginMsg:"",
    loginCode:"",
    userInfo:"",
    display_name:'',
    display_pas:'',
    shows:false,  /*弹框显示隐藏*/
    verification:'',/*弹框内容*/
      powerList:'',/*存储权限列表*/
      fld_name_arr:[],
    },
    methods: {
        discoloration: function () {

        },
        submit: function () {
            var username = this.$refs.username.value;
            var password = this.$refs.password.value;
            username=username.trim();
            password=password.trim();
            if(username===''){
                this.shows_name=true;
                return false;
            }else if(password===''){
                this.shows_pas=true;
                return false;
            }
            axios
                .post(serverUrl + '/Login/check_login', {
                    username: username,
                    password: password,
                })
                .then(response => {
                    var error = response.data.error;
                    if (error === 0) {
                        this.userInfo = response.data.message;
                        sessionStorage.setItem('user', JSON.stringify(this.userInfo));
                        var time = parseInt(new Date().getTime() / 1000);
                        sessionStorage.setItem('startTime', time);
                        this.shows=true;
                        this.verification="登陆成功";
                        setTimeout( ()=> {
                            this.shows=false;
                        },1000)
                        window.location.href = "./index.html";

                    } else {
                        this.shows=true;
                        this.verification="登陆失败";
                        setTimeout( ()=> {
                            this.shows=false;
                        },2000)
                        return false
                    }

                })


        },
        changes: function () {
            if (this.msm === '') {
                this.display_name = true;
                this.display_pas = '';

            }
        },
        change: function () {
            if (this.msg === '') {
                this.display_pas = true;
                this.display_name = '';
            }
        },
        in_put:function(){
            this.shows_name='';
        },
        in_pas:function(){
            this.shows_pas='';
        }
    }
})


