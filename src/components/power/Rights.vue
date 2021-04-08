<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 数据表格 -->
    <el-table :data="rightsList" style="width: 100%" 
    :stripe = 'true' :border = 'true'>
      <el-table-column type='index' label="#"></el-table-column>
      <el-table-column prop="authName" label="权限名称" ></el-table-column>
      <el-table-column prop="path" label="路径"  > </el-table-column>
      <el-table-column prop="level" label="权限等级"  >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === '0' ">标签一</el-tag>
          <el-tag type="success" v-else-if="scope.row.level === '1'">标签二</el-tag>
          <el-tag type="danger" v-else>标签三</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name:'Rights',
  components:{},
  data(){
    return {
      // 权限列表数据
      rightsList:[]
    }
  },
  created(){
    this.getRightsList()
  },
  methods:{
    async getRightsList(){
      const {data:res} = await this.$axios.get('rights/list')
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.rightsList = res.data
    }
  }
}
</script>
<style scoped>

</style>