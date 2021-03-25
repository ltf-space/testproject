<template>
  <div>
    <el-button type='info' @click="LoginOut">退出</el-button>
  </div>
</template>

<script>
export default {
  name:'Home',
  components:{},
  data(){
    return {
    }
  },
  methods:{
    LoginOut(){
      // 清除token值
      window.sessionStorage.clear();
      // 回到登录页
      this.$router.push('/login');
    }
  }
}
</script>
<style scoped>

</style>