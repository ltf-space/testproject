<template>
  <div>
   <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb> 

  <!--卡片  -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" 
          clearable @clear='getGoodsList'>
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户 -->
        <el-col :span="6">
          <el-button type='primary' @click="goAddPage">添加用户</el-button>
        </el-col>
      </el-row>

       <!-- 表格数据信息 -->
      <el-table :data="goodsList" style="width: 100%" :stripe = 'true' :border = 'true'>
        <el-table-column type='index' label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width='110'> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width='80' > </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width='180'>
          <template slot-scope="scope">
            {{moment(scope.row.add_time).format('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width='130'>
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size='mini'></el-button>
            <el-button type="danger" icon="el-icon-delete" 
            size='mini' @click="removeList(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 200, 500, 926]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name:'List',
  components:{},
  data(){
    return {
      // 参数信息
      queryInfo:{
        query:'',//查询关键字
        pagenum:1,//当前页码
        pagesize:10//一页10条数据
      },
      // 商品列表数据
      goodsList:[],
      //总的条数
      total:0
    }
  },
  created(){
    this.getGoodsList()
  },
  methods:{
    async getGoodsList(){//页面加载时获取商品列表
      const {data:res} = await this.$axios.get('goods',{params:this.queryInfo})
      console.log(res)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newPageSize){//监听每页条数的变化
      this.queryInfo.pagesize = newPageSize
      this.getGoodsList()
    },
    handleCurrentChange(newPageNum){//监听页码的变化
      this.queryInfo.pagenum = newPageNum
      this.getGoodsList()
    },
    async removeList(id){//点击删除按钮，删除商品
      const resultConfirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(resultConfirm !== 'confirm') return
      const {data:res} = await this.$axios.delete('goods/'+id)
      if(res.meta.status !== 200)return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getGoodsList()
    },
    goAddPage(){//点击添加用户按钮跳转到指定路由
      this.$router.push('goods/add')
    }
  }
}
</script>
<style scoped>

</style>