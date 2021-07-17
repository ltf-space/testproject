<template>
  <div class="login_container">
    <div class="login_box">

      <!-- 登录头像 -->
      <div class="avatar_box">
        <img src="../assets/image/image1.jpg" alt="">
      </div>

      <!-- 表单 -->
      <el-form  ref="LoginformRef" :model="Loginform" :rules='LoginformRules' label-width="0" class="login_form">
        <!-- 用户名 -->
        <el-form-item label="" prop='username'>
          <el-input v-model="Loginform.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="" prop='password'>
          <el-input type='password' v-model="Loginform.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>

        <!-- 登录 重置按钮-->
        <el-form-item label="" class="btns">
          <el-button type="primary" @click="login" :plain="true">登录</el-button>
          <el-button type="info" plain @click='resetLoginForm'>重置</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
export default {
  name:'login',
  components:{},
  data(){
    return {
      Loginform:{
        username:'',
        password:''
      },
      // 验证输入规则
      LoginformRules:{
        username:[//验证用户名
          { required: true, message: '请输入登陆账户', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8字符', trigger: 'blur' }
        ],
        password:[//验证密码
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    resetLoginForm(){//重置点击事件
      this.$refs.LoginformRef.resetFields()//重置账户及登陆密码
    },
    login(){//登录点击事件
      this.$refs.LoginformRef.validate(valid => {
        // console.log(valid);//如果校验正确返回true
        if(!valid){
          return;
        }else{
          this.$axios.post('login',this.Loginform).then(res => {
            const data = res.data.meta;
            if(data.status !== 200) {
              return this.$message.error('登录失败');
            }else{
              this.$message.success('登录成功');
              // 将token保存到window下的sessionStorage中
              window.sessionStorage.setItem('token',res.data.data.token);
              this.$router.push('/home');
            }
            
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.login_container{
  width              : 100%;
  height             : 100%;
  min-height         : 100vh;
  background-repeat  : no-repeat;
  background-position: center;
  background-size    :cover;
  overflow           : hidden;
  animation: getColor 4s ease 0s infinite alternate;
}
@keyframes getColor{
  0%{
    background-color:purple;
  }
  40%{
    background-color: #ffee99;
  }
  70%{
    background-color: #ccbbff;
  }
  100%{
    background-color: #f39c12;
  }
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: rgba(0, 0, 0, .4);
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.avatar_box{
  width: 130px;
  height: 130px;
  background-color: #fff;
  border-radius: 50%;
  padding: 10px;
  border: 1px solid #eee;
  box-shadow: 0 0 6px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
}
.avatar_box img{
  width: 100%;
  height: 100%;
  background-color: #eee;
  border-radius: 50%;
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.btns{
  width: 410px;
  display: flex;
  justify-content:center;
}
</style>
<style>
.login_form input.el-input__inner{
  background-color: transparent;
  display: block;
  outline: none;
  border: none;
  border-bottom: 2px solid #fff;
  color: #fff;
}
</style>