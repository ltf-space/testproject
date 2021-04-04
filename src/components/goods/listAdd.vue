<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb> 
    <!-- 卡片 -->
    <el-card>
       <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" :closable='false' 
      show-icon center></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="500" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <!-- tab栏区域 -->
        <el-tabs v-model="activeIndex" :tab-position="tabPosition" style="height: 200px;">
          <el-tab-pane label="基本信息" name='0'>基本信息</el-tab-pane>
          <el-tab-pane label="商品参数" name='1'>商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name='2'>商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name='3'>商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name='4'>商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name:'listAdd',
  components:{},
  data(){
    return {
      //默认激活的index
      activeIndex:0,
      // 默认tab栏在左侧
      tabPosition:'left',
      // 添加表单的数据对象
      addForm:{},
      // 表单验证规则
      addFormRules:{}
    }
  },
}
</script>
<style scoped>
.el-steps{
  margin-top: 8px;
}
.el-step__title{
  font-size: 13px !important;
}
.el-tabs{
  margin-top: 20px;
}
</style>