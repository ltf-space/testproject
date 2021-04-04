<template>
<!-- 内容区域 -->
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/image/logo.png" alt="">
        <span>后台管理</span>
      </div>
      <el-button type='info' @click="LoginOut">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px' ">
        <!-- 展开 收缩 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened = 'true'
          :collapse-transition = 'false'
          :collapse = 'isCollapse'
          :router = 'true'
          :default-active = 'activePath'>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id +'' " v-for="item in menusList" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 一级图标 -->
              <i :class="iconList[item.id]"></i>
              <!-- 一级文本 -->
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item :index=" '/'+menusItem.path"
             v-for="menusItem in item.children" 
             :key="menusItem.id" 
             @click="saveNavState('/'+menusItem.path)">
               <template slot="title">
                <!-- 二级图标 -->
                <i class="el-icon-menu"></i>
                <!-- 二级文本 -->
                <span>{{menusItem.authName}}</span>
              </template>
            </el-menu-item>
              
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name:'Home',
  components:{},
  data(){
    return {
      menusList:[],//侧边菜单数据
      iconList:{//一级菜单图标
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      isCollapse:false,
      activePath:''
    }
  },
  created(){
    this.getMenuList()
    // 取出activePath值
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods:{
    LoginOut(){//退出按钮事件
      // 清除token值
      window.sessionStorage.clear();
      // 回到登录页
      this.$router.push('/login');
    },
    // 获取主页侧边栏数据
    getMenuList(){
      this.$axios.get('menus').then(res => {
        // console.log(res)
        this.menusList = res.data.data
      })
    },
    toggleCollapse(){//点击按钮，进行展开与收缩
      this.isCollapse = ! this.isCollapse
    },
    saveNavState(activePath){//点击二级菜单，保存路由状态
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style scoped>
.home-container{
  height: 100%;
}
.el-header {
    background-color: #373d41;
    color: #000;
    display: flex;
    justify-content:space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
}
.el-header div{
  display: flex;
  align-items: center;
}
.el-header div span{
  margin-left: 15px;
}
.el-header div img{
  width: 40px;
  height: 40px;
}
/* 菜单栏收缩与展开 */
.toggle-button{
  background-color: #4A5064;
  text-align: center;
  color: #fff;
  height: 24px;
  /* 设置间距 */
  letter-spacing: .2em;
  /* 鼠标移上去变为小手形态 */
  cursor: pointer;
}
.el-aside {
  background-color: #333744;
  color: #000;
  transition: .5s;
}
.el-aside .el-menu{
  border-right: none;
}

.el-main {
  background-color: #EAEDF1;
  color: #000;
}
/* 给一级菜单图标设置右边距 */
.iconfont{
  margin-right: 10px;
}
</style>