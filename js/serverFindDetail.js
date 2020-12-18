let vm=new Vue({
    el: '#app',
    components: {
        
    },
    data: {
            bg3:'',
            off:'',
            offOne:'',
            edit:'',
            //edit1:'',

            colony:'',
            server:'',
            detail_clo:true,
            fld_project_id:"",
            fld_namespace_id:"",
            fld_group_id:"",
            fld_id:"",
            serverInfo:"",
            codeMirror1:"",
            exampleList:"",
            exampleInfo:"",
            codeMirror3:"",
            groupList:"",
            shows:false,  /*弹框显示隐藏*/
            verification:'',/*弹框内容*/
            fld_des:'',
            fld_ishealthy:'',
            fld_is_tem:'',
            fls_isonline:'',
            userInfo:"",
            //服务名
            server_name:'',
            //分组名
            group_name:'',
            //描述
            describe:'',
            //是否能点击
            edit_confirm:false,
            //透明度
            edit_role:1,
            show_tips_box:false,
        current_state:'没有添加权限',
    },
    mounted() {
        //获取参数值
        // if(sessionStorage.getItem('user')==null){
        //     this.userInfo=sessionStorage.getItem('user_copy');
        // }else{
            this.userInfo=sessionStorage.getItem('user');
        // }
        this.fld_id=getUrlParam("fld_id");
        this.fld_project_id=getUrlParam("fld_project_id");
        this.getGroup();
        this.getFindInfo();
        // var that=this;
        // ~function(){
        //     that.codeMirror=CodeMirror.fromTextArea(document.getElementById("code_t2"),{
        //         lineNumbers: true,
        //         matchBrackets: true,
        //         theme:'blackboard',
        //         mode: "text/x-csrc"
        //     });
        //     that.codeMirror3=CodeMirror.fromTextArea(document.getElementById("code_t3"),{
        //        /* lineNumbers: true,
        //         matchBrackets: true,
        //         mode: "text/x-csrc"*/
        //         gutters: ['CodeMirror-lint-markers'],
        //         //autoRefresh: true, // 自动触发刷新
        //         theme:'blackboard',
        //         identUnit:4,
        //         styleActiveLine:true,
        //         matchBrackets: true,
        //        // mode: "text/javascript"
        //         mode: {name: 'javascript', json: true},
        //     });
        // }()

        //判断服务管理有没有增删改查权限
        var serverfindconf=this.getAuth("tbl_serverfindconf");


        
    },
    methods:{
        //获取详情数据
        getFindInfo:function(){
            axios
                .post(serverUrl+'/nacos/serverFindInfo',{
                    fld_id:this.fld_id,
                    userInfo:this.userInfo

                })
                .then(response => {
                    if(response.data.error==-1){
                        this.show_tips_box=true;
                        this.current_state=response.data.message;
                         window.setTimeout(()=>{
                                this.show_tips_box=false;
                        },1000)
                        return false;
                    }else{
                        this.serverInfo=response.data.serverFindInfo;
                        // console.log(this.serverInfo)
                        // this.$refs.datakey.value=response.data.serverFindInfo.fld_name;
                        // this.$refs.datades.value=response.data.serverFindInfo.fld_des;
                        // $("#selected1-"+this.serverInfo.fld_group_id).attr("selected","selected");
                        // $("#selected2-"+this.serverInfo.fld_group_id).attr("selected","selected");
                        this.server_name=this.serverInfo.fld_name;
                        this.group_name=this.serverInfo.fld_group;
                        this.describe=this.serverInfo.fld_des;
                        this.getExample();
                    }
                    
                    
                })
        },
        //服务发现更新
        serverFindAdd:function(){
            
            var fld_name = $("#sfn").html();
            var fld_project_id = this.serverInfo.fld_project_id;
            var fld_namespace_id = this.serverInfo.fld_namespace_id;
            var fld_group_id = $("#selectValue2").val();
            // var fld_istpt = $("#sfyz").val();
            var fld_des = $('#code_t1').val();
            var fld_id = this.serverInfo.fld_id;
            // fld_istpt=fld_istpt.trim();
            // if(!/^[0-9]*[0-9][0-9]*$/.test(fld_istpt)){
            //     this.shows=true;
            //     this.verification='请输入正确格式的保护阈值正整数';
            //     setTimeout( ()=> {
            //         this.shows=false;
            //     },2000)
            //     return false;
            // }
            axios
                .post(serverUrl+'/nacos/sFAddOrUpdate',{
                    fld_id:fld_id,
                    fld_name:fld_name,
                    fld_project_id:fld_project_id,
                    fld_namespace_id:fld_namespace_id,
                    fld_group_id:fld_group_id,
                    // fld_istpt:fld_istpt,
                    fld_des:fld_des,
                    userInfo:this.userInfo
                })
                .then(response => {
                    this.shows=true;
                    this.verification=response.data.message;
                    if(response.data.error==-1){
                        setTimeout( ()=> {
                            //alert(1)
                            this.shows=false;
                        },2000)
                    }else{
                        setTimeout( ()=> {
                            //alert(1)
                            this.shows=false;
                            this.getFindInfo();
                            this.updateClose();
                        },2000)
                    }


                    
                })

        },
        //获取服务下的实例
        getExample:function(){
            axios
                .post(serverUrl+'/nacos/exampleList',{fld_serverfind_id:this.serverInfo.fld_id,userInfo:this.userInfo})
                .then(response => {
                    if(response.data.error==-1){
                    this.show_tips_box=true;
                    this.current_state=response.data.message;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },1000)
                        return false;
                    }else{
                        this.exampleList=response.data.exampleList;
                    }
                    
                })
        },
        //弹窗滑动判断效果
        offTwo:function(){
            if(this.off!=='0'){
                this.off='0';
                this.offOne='translateX(0)';
                this.bg3='#e9ecef'
            }else{
                this.off='100%';
                this.offOne='translateX(-100%)';
                this.bg3='#5584ff'
            }
        } ,
        //编辑服务弹窗
        serverEdit:function (fld_id) {
            axios
                .post(serverUrl+'/exampleInfoPage',{fld_id:fld_id,userInfo:this.userInfo})
                .then(response => {

                    if(response.data.error==-1){
                    this.show_tips_box=true;
                    this.current_state=response.data.message;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },1000)
                        return false;
                    }else{
                        this.exampleInfo=response.data.instance;
                        //console.log(response.data)
                        $("#exampleName").html(this.exampleInfo.fld_ip);
                        $("#examplePort").html(this.exampleInfo.fld_port);
                        this.codeMirror3.setValue(this.exampleInfo.fld_metadata);
                        this.fld_des=this.exampleInfo.fld_des;
                        this.fld_ishealthy=this.exampleInfo.fld_ishealthy;
                        this.fld_is_tem=this.exampleInfo.fld_is_tem;
                        this.fld_isonline=this.exampleInfo.fld_isonline;
                    }


                    
                })

            if(this.edit==''){
                this.edit=true;
                this.colony='';
                this.server='';
            }
        },
        //实例更新
        exampleEdit:function () {
            var fld_weight=$("#weight").val();
            var fld_metadata=this.codeMirror3.getValue();
            var fld_id=this.exampleInfo.fld_id;
            var fld_name=$('#exampleName').text();
            var fld_port=$('#examplePort').text();

            axios
                .post(serverUrl+'/exampleUpdate',{
                    fld_id:fld_id,
                    fld_weight:fld_weight,
                    fld_metadata:fld_metadata,
                    fld_name:fld_name,
                    fld_port:fld_port,
                    fld_isonline:this.fld_isonline,
                    fld_is_tem:this.fld_is_tem,
                    fld_ishealthy:this.fld_ishealthy,
                    fld_des:this.fld_des,
                    userInfo:this.userInfo
                })
                .then(response => {
                    this.shows=true;
                    this.verification=response.data.message;
                    if(response.data.error==-1){
                        setTimeout( ()=> {
                            //alert(1)
                            this.shows=false;
                        },2000)
                    }else{
                        setTimeout( ()=> {
                            //alert(1)
                            this.shows=false;
                            this.getExample();
                            this.popupClose();
                        },2000)
                    }
                   


                })

            
        },
        //编辑服务弹窗关
        popupClose:function () {
            this.edit=''
        },
        //集群配置弹窗
        serverColony:function () {
            if(this.colony===''){
                this.colony=true;
                this.edit='';
                this.server='';
            }
        },
        //集群配置弹窗关
        colonyClose:function () {
            this.colony=''
        },
        //编辑弹窗
        serverFindEditShow:function () {
            $("#sfn").html(this.serverInfo.fld_name);
            $("#sfyz").val(this.serverInfo.fld_istpt);
            if(this.server===''){
                this.server=true;
                this.edit='';
                this.colony='';
            }
        },
        //编辑弹窗关
        updateClose:function () {
            this.server='';
        },
        //返回按钮
        detailReturn:function () {
           window.location.href='serverFindList.html';
        },
        getGroup:function(){
            axios
                .post(serverUrl+'/nacos/groupList?fld_project_id='+this.fld_project_id,{userInfo:this.userInfo})
                .then(response => {
                    if(response.data.error==-1){
                    this.show_tips_box=true;
                    this.current_state=response.data.message;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },1000)
                        return false;
                    }else{
                        this.groupList = response.data.groupList;
                    }
                    
                    
                })
        },
        /**
         * 
         * 获取表权限
         */
        getAuth:function(table){
            axios
            .post(serverUrl+'/nacos/getUserAuth',
            {
                TBName:table,
                userInfo:this.userInfo
                
            })
            .then(response => {
                // console.log("response.data.rule",response.data.rule);   
                if(response.data.rule.Update==true){
                    this.edit_confirm=true;
                    this.edit_role=1;
                }else{
                    this.edit_confirm=false;
                    this.edit_role=0.5;
                }
            })
        }

    }
})
