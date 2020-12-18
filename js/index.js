let vm=new Vue({
    el: '#app',
    components: {
        
    },
    data: {
        show_tips:null,
        reversal: '',
        reversal1: '',
        isActive: false,
        isItemList: false,
        isItemList1: false,
        isItemList2: false,
        projectList: "",
        heo: true,
        sty: '',
        pro: '',
        temprojectid:"a",
        shows:0,
        index:'',
        user:"",
        fld_username:"",
        userInfo:"",
        current_state:'没有权限',
        show_tips_box:false,
        add:'',
    },

    mounted:function() {
        let obj=window.location.href;
        if(obj.indexOf('#')!=-1){
            var hash=unescape(obj.substring(obj.indexOf('#')+1));
            //var name=unescape(obj.substring(obj.indexOf('=')+1));
            var hash_val=hash.split('&');
            var arr=[];
            for(var i=0;i<hash_val.length; i++){
                //console.log(hash_val[i])
                var vald=hash_val[i].split('=');
                //console.log(vald)
                arr.push(vald[1]) ;
            }
           
        };
        // console.log(sessionStorage.getItem('user_copy'))
        // var params = (function oneValues() {
        //     var query = location.search.substr(1)
        //     query = query.split('&')
        //     var params = {}
        //     for (let i = 0; i < query.length; i++) {
        //         let q = query[i].split('=')
        //         if (q.length === 2) {
        //             params[q[0]] = q[1]
        //         }
        //     }
        //     return params  //返回?号后面的参数名与参数值的数组
        // }());
        // if(sessionStorage.getItem('user_copy')==null){
        //     alert(1)
 
        // console.log(params)
        // console.log(decodeURIComponent(params.num),decodeURIComponent(params.time),decodeURIComponent(params.add))
        // // console.log(sessionStorage.getItem('userInfo'))
        // //判断登陆是否过期
        // // this.userInfo=sessionStorage.getItem('user');
        
        // console.log(sessionStorage.getItem('user'))
        // alert(1)
        
        // var user=sessionStorage.getItem('user');
        var user,time,startTime,add;
        // if(sessionStorage.getItem('user')==null){
        //     alert(2)
        //     user=decodeURIComponent(params.num);
        //     time=parseInt(new Date().getTime()/1000);
        //     startTime=decodeURIComponent(params.time);
        //     add=decodeURIComponent(params.add)
        //     this.userInfo=user;
        //     window.sessionStorage.setItem('user_add',add);
        //     this.add=window.sessionStorage.getItem('user_add');
        //     window.sessionStorage.setItem('user_copy',user)
        // }else{
            user=sessionStorage.getItem('user');
            time=parseInt(new Date().getTime()/1000);
            startTime=sessionStorage.getItem('startTime');
            this.userInfo=user;
        // }
        if(user==""||user==null ||user==undefined ||user=='null'){
            window.location.href="./login.html";
            return false;
        }
        
        
        var timeCha=(time-startTime)-(30*60);
        if(timeCha>0){
            sessionStorage.setItem('user',null);
            window.location.href="./login.html";
            return false;
        }
        var userObj=JSON.parse(user);
        // alert(1212)
        // }else{
        //     if(params.add!=null){
        //         console.log(decodeURIComponent(params.add))
        //         this.add=decodeURIComponent(params.add);
        //         window.sessionStorage.setItem('user_add',this.add);
        //     }else{
        //         this.add=window.sessionStorage.getItem('user_add');
        //     }
        //     this.userInfo=sessionStorage.getItem('user_copy');
        //     var userObj=JSON.parse(this.userInfo);
        // }
        this.getAuth();

        
        this.fld_username=userObj.fld_name;
        this.getProject();
// console.log(this.userInfo)
    },
    computed:{
        
    },
    methods: {
        
        getProject: function () {
            axios
                .post(serverUrl+'/nacos/projectList',{userInfo:this.userInfo})
                .then(response => {
                    if(response.data.error==-1){
                        // alert(response.data.message);
                        return false;
                    }else{
                        this.projectList = response.data.projectList;
                    }
                    
                })
        },
        getProjectId: function (e) {
            
            this.temprojectid=e.toElement.attributes.projectId.value;
            //console.log(this.temprojectid);

        },
        config_fn: function () {
            if (!this.isItemList) {
                this.isItemList = true;
                this.isItemList1 = false;
                this.isItemList2 = false
            } else {
                this.isItemList = false
            }
        },
        server_fn: function () {
            if (!this.isItemList1) {
                this.isItemList1 = true;
                this.isItemList = false;
                this.isItemList2 = false
            } else {
                this.isItemList1 = false
            }
        },
        group_fn: function () {
            if (!this.isItemList2) {
                this.isItemList2 = true;
                this.isItemList = false;
                this.isItemList1 = false
            } else {
                this.isItemList2 = false
            }

        },
        change: function (index,e) {
            var controller=e.target.attributes.controller.value;
            
            if(controller=="slc"){
                var projectId=e.target.attributes.projectid.value;
                
                var projectName=$("#pid_"+projectId).html();
                
                $("#iframe").attr("src","serverList.html?projectId="+projectId+"&project="+projectName+index);

                window.location.href=window.location.pathname+"#type="+escape('配置')+'&name='+escape(projectName)+'&id='+projectId+'&count='+index;
            }else if(controller=="glc"){
                $("#iframe").attr("src","group.html");
                window.location.href=window.location.pathname+"#type="+escape('分组'+'&count='+index);
            }else if(controller=="nlc"){
                $("#iframe").attr("src","namespace.html");
                window.location.href=window.location.pathname+"#type="+escape('命名空间'+'&count='+index);
            }else if(controller=="prlc"){
                $("#iframe").attr("src","project.html");
                window.location.href=window.location.pathname+"#type="+escape('项目管理'+'&count='+index);
            }else if(controller=="sflc"){
                var projectId=e.target.attributes.projectid.value;
                var projectName=$("#pid_"+projectId).html();
                //projectName=escape(projectName);

                $("#iframe").attr("src","serverFindList.html?projectId="+projectId+"&project="+projectName);
                window.location.href=window.location.pathname+"#type="+escape('服务')+'&name='+escape(projectName)+'&id='+projectId+'&count='+index;
            }else if(controller=="ulc"){
                $("#iframe").attr("src","user-admin.html");
                window.location.href=window.location.pathname+"#type="+escape('用户管理'+'&count='+index);

            }else if(controller=="plc"){
                $("#iframe").attr("src","role-admin.html");
                window.location.href=window.location.pathname+"#type="+escape('角色管理'+'&count='+index);
            }
            this.shows=index;
        },
        change1: function () {
            this.reversal1 = true
        },
        triangle: function () {
            this.heo = '';
            this.sty = true

        },
        back: function () {
            this.pro = true;
            let oldProcedure = this.$refs['procedureEdit'].getVal();
            oldProcedure='';
            // alert()
        },
        //退出登陆
        // logout:function(){
        //     sessionStorage.setItem('user',null);
        //     window.location.href="./login.html";
        //     return false;

        // },

        /**
         * 
         * 获取表权限
         */
        getAuth:function(){
            axios
            .post(serverUrl+'/nacos/getUserAuth',
            {
                TBName:"tbl_project",
                userInfo:this.userInfo
            })
            .then(response => {
                // console.log("response.data.rule",response.data.rule); 
                if(response.data.rule.View==true){
                    this.show_tips=true;
                }else{
                    this.show_tips_box=true;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },3000)
                }  
            })
        }
    },
})