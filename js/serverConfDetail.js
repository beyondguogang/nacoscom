let vm=new Vue({
    el: '#app',
    components: {
        
    },
    data:{
        // b:null
      codeMirror:"",
      fld_project_id:"",
      fld_namespace_id:"",
      fld_group_id:"",
      fld_id:"",
      serverInfo:"",
      groupList:"",
      shows:false,  /*弹框显示隐藏*/
      verification:'',/*弹框内容*/
      urlreturn:'',
      userInfo:"",
      //是否点击发布
      release:false,
      //透明度
      release_role:1,
      show_tips_box:false,
      current_state:'没有添加权限',
},
mounted() {
    // if(sessionStorage.getItem('user')==null){
    //     this.userInfo=sessionStorage.getItem('user_copy');
    // }else{
        this.userInfo=sessionStorage.getItem('user');
    // }
    this.fld_project_id=getUrlParam("fld_project_id");
    this.getGroup();
    if(getUrlParam("fld_id")==false){
        this.fld_namespace_id=getUrlParam("fld_namespace_id");
    }else{
        this.fld_id=getUrlParam("fld_id");
        this.getServerInfo();
        

    }
   this.urlreturn= 'serverList.html?projectId='+this.fld_project_id;

    this.codeMirror=CodeMirror.fromTextArea(document.getElementById("code_textarea"),{
        lineNumbers: true,
        identUnit:4,
        styleActiveLine:true,
        theme:'blackboard',
        matchBrackets: true,
        mode: "javascript"

    });
    //控制输入框的宽高
    this.codeMirror.setSize('','550px')
    //判断配置管理有没有增删改查权限
    var serverconf=this.getAuth("tbl_serverconf");

},
methods:{
    serverAdd:function(){
        var key=this.$refs.datakey.value;
        var value=this.codeMirror.getValue();
        var des=this.$refs.datades.value;
        key=key.trim();
        if(key===''){
            this.shows=true;
            this.verification='ID不能为空';
            setTimeout( ()=> {
                this.shows=false;
            },1000)
            return false;
        }else if(value==''){
            this.shows=true;
            this.verification='配置内容不能为空';
            setTimeout( ()=> {
                this.shows=false;
            },1000)
            return false;
        }
        else if(this.fld_id!==""){
            var data={
                fld_id:this.fld_id,
                fld_project_id:this.fld_project_id,
                fld_namespace_id:this.fld_namespace_id,
                fld_group_id:$("#in-seven3").val(),
                fld_key:key,
                fld_value:value,
                fld_des:des,
                userInfo:this.userInfo
            }
            

        }else{

            var data={
                fld_project_id:this.fld_project_id,
                fld_group_id:$("#in-seven3").val(),
                fld_key:key,
                fld_value:value,
                fld_des:des,
                userInfo:this.userInfo
            };
           
        }
        axios
        .post(serverUrl+'/nacos/sAddOrUpdate',
            data)
        .then(response => {
            if(response.data.error==0){
                this.shows=true;
                this.verification=response.data.message;
                setTimeout( ()=> {
                    this.shows=false;
                    window.location.href = '/serverList.html?projectId='+this.fld_project_id;
                },2000)
            }else{
                this.shows=true;
                this.verification=response.data.message;
                setTimeout( ()=> {
                    this.shows=false;
                },2000)
                return false
            }



        })
        

        
        

    },

     //获取服务详情
     getServerInfo:function(){
        axios
            .post(serverUrl+'/nacos/serverconfInfo',
            {
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
                    this.serverInfo=response.data.serverInfo;
                    this.fld_project_id=this.serverInfo.fld_project_id;
                    this.fld_namespace_id=this.serverInfo.fld_namespace_id;
                    this.$refs.datakey.value=this.serverInfo.fld_key;
                    this.$refs.datades.value=this.serverInfo.fld_des;
                    this.fld_group_id=this.serverInfo.fld_group_id;
                    $("#selected-"+this.fld_group_id).attr("selected","selected");
                    this.codeMirror.setValue(this.serverInfo.fld_value);
                }
                
                
            })

    },
    getGroup:function(){
        axios
            .post(serverUrl+'/nacos/groupList',{fld_project_id:this.fld_project_id,userInfo:this.userInfo})
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
                this.release=true;
                this.release_role=1;
            }else{
                this.release=false;
                this.release_role=0.5;
            }
        })
    }

}
})