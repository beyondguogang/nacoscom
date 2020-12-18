let vm=new Vue({
    el: '#app',
    data: {
            // a:'',
            spring:'none',
            isItemList:false,
            isItemList1:false,
            isItemList2:false,
            msg1:'',
            msg:'',
            bor:'1px solid #5a6268',
            bor1:'1px solid #5a6268',
            hide:'none',
            hide1:'none',
            groupList:"",
            a:"",
            projectList:"",
            nameList:"",
            groupInfo:"",
            isEdit:"0",
            shows:false,  /*弹框显示隐藏*/
            verification:'',/*弹框内容*/
            /*删除权限*/
            pointer_del:false,
            opacity_del:1,
            /*修改权限*/
            pointer_edit:false,
            opacity_edit:1,
            /*添加权限*/
            serverNewFlag:false,
            new_role:1,
            userInfo:"",
            show_tips_box:false,
            current_state:'没有添加权限',
            //是否显示数据
            t_body:true
    },

    mounted() {
        //监听页面的加载事件
        // if(sessionStorage.getItem('user')==null){
        //     this.userInfo=sessionStorage.getItem('user_copy');
        // }else{
            this.userInfo=sessionStorage.getItem('user');
        // }
        this.getGroup();
        this.getProject();
        //判断分组管理有没有增删改查权限
        var group=this.getAuth("tbl_group");

    },
    methods:{
        //获取分组列表
        getGroup:function(){
            axios
                .post(serverUrl+'/nacos/groupList',{userInfo:this.userInfo})
                .then(response => (this.groupList = response.data.groupList))
        },
        add:function(){
            var name=this.$refs.groupname.value;
            var des=this.$refs.groupdes.value;
            //var fld_namespace_id=this.$refs.namespacen.value;
            var fld_project_id=this.$refs.projectnamen.value;
            name=name.trim();
            des=des.trim();
            if(!fld_project_id){
                this.shows=true;
                this.verification='请选择项目';
                setTimeout( ()=> {
                    this.shows=false;
                },1000)
                return false;
            } else if(name===''){
                this.shows=true;
                this.verification='分组名称不能为空';
                setTimeout( ()=> {
                    this.shows=false;
                },1000)
                return false;
            }else if(des===''){
                this.shows=true;
                this.verification='描述不能为空';
                setTimeout( ()=> {
                    this.shows=false;
                },1000)
                return false;
            } else if(this.isEdit==="0"){

                axios
                    .post(serverUrl+'/nacos/groupAddOrUpdate',
                        {
                            //fld_namespace_id:fld_namespace_id,
                            fld_project_id:fld_project_id,
                            fld_name:name,
                            fld_des:des,
                            userInfo:this.userInfo
                        })
                    .then(response => {

                        this.shows=true;
                        this.verification=response.data.message;
                        if(response.data.error==-1){
                            
                            setTimeout( ()=> {
                                this.shows=false;
    
                            },1000)
                        
                            this.spring='none'
                        }else{
                            setTimeout( ()=> {
                                this.shows=false;
                            },1000)
                            this.getGroup();
                            this.spring='none'
                        }

                    })
            }else{

                axios
                    .post(serverUrl+'/nacos/groupAddOrUpdate',
                        {
                            fld_id:this.groupInfo.fld_id,
                            fld_project_id:fld_project_id,
                            fld_name:name,
                            fld_des:des,
                            userInfo:this.userInfo
                        })
                    .then(response => {
                        
                        this.shows=true;
                        this.verification=response.data.message;
                        if(response.data.error==-1){
                            
                            setTimeout( ()=> {
                                this.shows=false;
    
                            },1000)
                        
                            this.spring='none'
                        }else{
                            setTimeout( ()=> {
                                this.shows=false;
                            },1000)
                            this.getGroup();
                            this.spring='none'
                        }

                    })

            }
        },

        //获取项目列表
        getProject:function(){
            axios
            .post(serverUrl+'/nacos/projectList',{userInfo:this.userInfo})
            .then(response => {
                if(response.data.error==-1){
                    this.show_tips_box=true;
                    this.current_state=response.data.message;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },1000)
                    return false;
                }else{
                    this.projectList = response.data.projectList
                }
            })

        },
        fn5:function(){
            if (!this.isItemList2) {
                this.isItemList2=true
            }else{
                this.isItemList2=false
            }

        },
        inp:function(){
            this.hide='none';
            this.bor='1px solid #5a6268';
            if(this.msg===''){
                this.hide='inline-block';
                this.bor='1px solid red';
            }
        },
        inp2:function(){
            this.hide1='none';
            this.bor1='1px solid #5a6268';
            if(this.msg1===''){
                this.hide1='inline-block';
                this.bor1='1px solid red';
            }
        },
        Empty:function(){
            if(this.msg===''&& this.msg1===''){
                this.hide='inline-block';
                this.bor='1px solid red';
                this.hide1='inline-block';
                this.bor1='1px solid red';
            }else if(this.msg===''&& this.msg1!==''){
                this.hide='inline-block';
                this.bor='1px solid red';
            }else if(this.msg!==''&&this.msg1===''){
                this.hide1='inline-block';
                this.bor1='1px solid red';
            }
        },
        addGroupShow:function(){
            if(this.serverNewFlag==true){
                this.$refs.groupname.value='';
                this.$refs.groupdes.value='';
                this.isEdit="0";
                this.spring='block';
            }else{
                this.show_tips_box=true;
                window.setTimeout(()=>{
                    this.show_tips_box=false;
                },1000)
            }
        },
        cross:function(){
            // this.shows=true;
            // this.verification='删除成功';
            // setTimeout( ()=> {
            //     this.shows=false;
            // },1000)
            this.spring='none'
        },
        groupDel:function(e){
            var fld_id=e.target.getAttribute('fld_id');
            axios
                .post(serverUrl+'/nacos/groupDel',
                {
                    fld_id:fld_id,
                    userInfo:this.userInfo
                    
                })
                .then(response => {
                    
                    this.shows=true;
                    this.verification=response.data.message;
                    if(response.data.error==-1){
                        
                        setTimeout( ()=> {
                            this.shows=false;

                        },1000)
                    
                        this.spring='none'
                    }else{
                        setTimeout( ()=> {
                            this.shows=false;
                        },1000)
                        this.getGroup();
                        this.spring='none'
                    }

                })
        },
        groupEdit:function(e){
            this.isEdit="1";
            var fld_id=e.target.getAttribute('fld_id')
            axios
            .post(serverUrl+'/nacos/groupInfo',
            {
                fld_id:fld_id,
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
                    this.groupInfo=response.data.groupInfo;
                    this.$refs.groupname.value=this.groupInfo.fld_name;
                    this.$refs.groupdes.value=this.groupInfo.fld_des;
                    //console.log(this.groupInfo);
                    $("#select-"+this.groupInfo.fld_project_id).attr("selected","selected");
                    //this.$refs.projectnamen.value=;
                    this.spring='block'
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
                console.log("response.data.rule",response.data.rule);   
                if(response.data.rule.Add==true){
                    this.serverNewFlag=true
                };
                if(response.data.rule.View==false){
                    this.t_body=false
                };
                if(response.data.rule.Update==false){
                    this.opacity_edit=0.5
                }else{
                     this.pointer_edit=true;
                     this.opacity_edit=1;
                };
                if(response.data.rule.Del==false){
                    this.opacity_del=0.5;
                }else{
                    this.pointer_del=true;
                    this.opacity_del=1;
                }
            })
        }
    }
})