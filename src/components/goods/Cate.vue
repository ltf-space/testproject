<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片-->
    <el-card>
      <!-- 添加商品分类 -->
      <el-row>
        <el-col>
          <el-button type='primary' @click="AddRoleDialogVisible=true">添加商品</el-button>
        </el-col>
      </el-row>

      <tree-table :data='cateList' :columns='columns'
       :selection-type='false' :expand-type='false'
       :show-index='true' index-text='#' border>
       <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false"
          style="color:green;"></i> 
          <i class="el-icon-error" style="color:orange;" v-else></i> 
        </template> 
      <!-- 排序 -->
        <template slot="order" slot-scope="scope">
         <el-tag v-if="scope.row.cat_level === 0">一级</el-tag> 
         <el-tag type='success' v-else-if="scope.row.cat_level === 1">二级</el-tag> 
         <el-tag type='warning' v-else>三级</el-tag> 
        </template> 
      <!-- 操作 -->
        <template slot="operate" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size='mini'>编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size='mini'>删除</el-button>
        </template> 
      </tree-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name:'Cate',
  components:{},
  data(){
    return {
      // 商品分类的数据列表
      cateList:[],
      // 查询条件
      querInfo:{
        type:3,//获取一二三级商品信息
        pagenum:1,//当前页码
        pagesize:5//一页五条数据
      },
      // 总共30条，默认0
      total:0,
      // 指定table列的定义
      columns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },
        {
          label:'是否有效',
          type: 'template',//将当前列定义为模板列
          template: 'isOk'//模板列名称
        },
        {
          label:'排序',
          type: 'template',//将当前列定义为模板列
          template: 'order'//模板列名称
        },
        {
          label:'操作',
          type: 'template',//将当前列定义为模板列
          template: 'operate'//模板列名称
        }
      ]
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    async getCateList(){//当页面加载出来时获取商品分类数据
      const {data:res} = await this.$axios.get('categories',{ params : this.querInfo })
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取商品信息失败')
      this.cateList = res.data.result
      this.total = res.data.total
    }
  }
}
</script>
<style scoped>

</style>