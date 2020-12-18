
let vm=new Vue({
    el: '#app',
    components: {
        
    },
    data:{

        rea:'a',
        isItemList:false,
        isItemList1:false,
        isItemList2:false,
        msg1:'',
        msg:'',
        bor:'1px solid #5a6268',
        bor1:'1px solid #5a6268',
        hide:'none',
        hide1:'none',
        disappear:'',
        back:true,
        serverFindList:"",
        project_id:"",
        nameList:"",
        namespace_id:"",
        groupList:"",
        group_id:"",
        serverAddUrl:"",
        find_add:'',
        codeMirror:"",
        shows:false,  /*弹框显示隐藏*/
        verification:'',/*弹框内容*/
        // mask:'',/*遮罩*/
        /*添加权限*/
        server_add:false,
        opacity:1,
        /*修改权限*/
        serverFlag:false,
        edit_role:1,
        /*删除权限*/
        serverDelFlag:false,
        del_role:1,
        projectName:'',
        userInfo:"",
        //提示框的显示隐藏
        show_tips_box:false,
        current_state:'没有添加权限',
         //是否显示数据
         t_body:true
},

mounted(){
    // if(sessionStorage.getItem('user')==null){
    //     this.userInfo=sessionStorage.getItem('user_copy');
    // }else{
        this.userInfo=sessionStorage.getItem('user');
    // }
    var projectId=getUrlParam("projectId");
    this.project_id=projectId?projectId:1;
    var projectName=unescape(getUrlParam("project"));
    this.projectName=projectName;
    this.getServerFindList();
    this.getGroup();
    //判断服务管理有没有增删改查权限
    var serverfindconf=this.getAuth("tbl_serverfindconf");
   
},

methods:{

    change: function (e) {
        var controller=e.toElement.attributes.controller.value;
        if(controller=="sclc"){
                $(".subunit").css("display","none");
                $("#sclc").css("display","block"); 

        }
    },
    getServerFindList: function () {

        axios
            .post(serverUrl+'/nacos/serverFindList',{fld_project_id:this.project_id,userInfo:this.userInfo})
            .then(response => {
                if(response.data.error==-1){
                    this.show_tips_box=true;
                    this.current_state=response.data.message;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },1000)
                    return false;
                }else{
                    this.serverFindList = response.data.serverFindList;
                }
                
                
            })

    },
    

    //服务发现添加
    serverFindAdd:function(){
        var fld_name = this.$refs.serverFindName.value;
        var fld_project_id = this.project_id;
        var fld_namespace_id = this.namespace_id;
        var fld_group_id = $("#groupValue").val();
        // var fld_istpt = this.$refs.serverFindYz.value;
        var fld_des = this.$refs.datavalue.value;
        fld_name=fld_name.trim();
        // fld_istpt=fld_istpt.trim();
        if(fld_name===''){
            this.shows=true;
            this.verification='服务名称不能为空';
            setTimeout( ()=> {
                this.shows=false;
            },1000)
            return false;
        }
        // else if(!/^[0-9]*[0-9][0-9]*$/.test(fld_istpt)){
        //     this.shows=true;
        //     this.verification='请输入正确格式的保护阈值正整数';
        //     setTimeout( ()=> {
        //         this.shows=false;
        //     },2000)
        //     return false;
        // }
        axios
            .post(serverUrl+'/nacos/sFAddOrUpdate',{
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
                        this.shows=false;
                    },2000)
                }else{
                    setTimeout( ()=> {
                        this.shows=false;
                    },2000)
                    this.findClose();
                    this.getServerFindList();
                }


               
            })

    },
    //服务发现删除
    serverFindDel:function(fld_id){
        axios
            .post(serverUrl+'/nacos/serverFindDel',{
                fld_id:fld_id,
                userInfo:this.userInfo

            })
            .then(response => {
                this.shows=true;
                this.verification=response.data.message;
                
                setTimeout( ()=> {
                    this.shows=false;
                },2000)
                this.getServerFindList();
            })

    },
    //展示详情数据
    serverFindInfoShow:function(fld_id){
        window.location.href="serverFindDetail.html?fld_id="+fld_id+"&&fld_project_id="+this.project_id;
    },
    getGroup:function(){
        axios
            .post(serverUrl+'/nacos/groupList',{fld_project_id:this.project_id,userInfo:this.userInfo})
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
    
    //改变分组
    groupChange:function(e){
        var groupid=e.target.attributes.groupid.value;
        this.group_id=groupid;
        this.getServerFindList();
        $(".server-list-group1").attr("class","server-list-group2");
        e.target.attributes.class.value="server-list-group1";


    },
    //搜索
    search: function () {
        var fld_name=this.$refs.namevalue.value;
        var fld_group=this.$refs.groupvalue.value;
            fld_name=fld_name.trim();
            fld_group=fld_group.trim();
            axios
                .post(serverUrl+'/nacos/serverFindSearch',{fld_project_id:this.project_id,fld_name:fld_name,fld_group:fld_group,userInfo:this.userInfo})
                .then(response => {
                    if(response.data.error==-1){
                    this.show_tips_box=true;
                    this.current_state=response.data.message;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },1000)
                        return false;
                    }else{
                        this.serverFindList = response.data.serverFindList;
                    }
                    
                })
    },
    fn:function(){
       this.a1=this.a;
    },
    fn3:function(){
        if (!this.isItemList) {
            this.isItemList=true
        }else{
            this.isItemList=false
        }
    },
    fn4:function(){
        if (!this.isItemList1) {
            this.isItemList1=true
        }else{
            this.isItemList1=false
        }
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
    group1:function(){
        this.disappear=true;
        this.back=''

    },
    getVal:function(){
        return this.disappear
},
//    添加服务
    findAdd:function (e) {
        e.preventDefault();
        if(this.server_add==false){
            this.show_tips_box=true;
            window.setTimeout(()=>{
                this.show_tips_box=false
            },1000)
        }else{
            this.$refs.serverFindName.value='';
            // this.$refs.serverFindYz.value='';
            this.find_add='block';
        }
        
    },
    findClose:function () {
        this.find_add='';
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
                this.server_add=true;
            };
            if(response.data.rule.View==false){
                this.t_body=false
            };
            // if(response.data.rule.Update==false){
            //     this.edit_role=0.5;
            // }else{
            //     this.serverFlag=true;
            //     this.edit_role=1;
            // };
            if(response.data.rule.Del==false){
                this.del_role=0.5;
            }else{
                this.serverDelFlag=true;
                this.del_role=1;
            }
        })
    }
}
})
