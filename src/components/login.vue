<template>
  <div class="login_container">
    <div class="login_box">

    </div>
  </div>
</template>

<script>
export default {
  name:'login',
  components:{},
  data(){
    return {
    }
  },
}
</script>
<style scoped>
.login_container{
  height: 100%;
  background-color: #2b4b6b;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
</style>