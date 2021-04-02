<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意: 只能更改第三级分类相关参数"
        type="warning" :closable='false' show-icon>
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类: </span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable>
          </el-cascader>
        </el-col>
      </el-row>

      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTapClick">
        <!-- 添加动态参数模板 -->
        <el-tab-pane label="动态属性" name="many">
          <el-button type='primary' size='mini' :disabled='isBtnDisabled'>添加参数</el-button>
          <!-- 动态分类参数表格 -->
          <el-table :data="manyTableData" stripe border style="width: 100%">
            <el-table-column type='expand'></el-table-column>
            <!-- 索引列 -->
            <el-table-column type='index' label="#" ></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" ></el-table-column>
            <el-table-column label="操作" >
              <template>
                <el-button type="primary" icon="el-icon-edit" size='mini'></el-button>
                <el-button type="danger" icon="el-icon-delete" size='mini'></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态参数模板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type='primary' size='mini' :disabled='isBtnDisabled'>添加属性</el-button>
          <!-- 静态分类参数表格 -->
          <el-table :data="onlyTableData" stripe border style="width: 100%">
            <el-table-column type='expand'></el-table-column>
            <!-- 索引列 -->
            <el-table-column type='index' label="#" ></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" ></el-table-column>
            <el-table-column label="操作" >
              <template>
                <el-button type="primary" icon="el-icon-edit" size='mini'></el-button>
                <el-button type="danger" icon="el-icon-delete" size='mini'></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name:'Params',
  components:{},
  data(){
    return {
      // 父级分类数据
      parentCateList:[],
       //指定级联选择器的配置对象
      cascaderProps:{
        expandTrigger : 'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children',
        // checkStrictly : 'true'//可选择任意一级分类
      },
      // 选中的父级分类的id数组
      selectedKeys:[],
      //激活标签页默认第一个name为many
      activeName:'many',
      //存储动态参数数据
      manyTableData:[],
      //存储静态参数数据
      manyTableData:[]
    }
  },
  created(){
    // 获取商品分类列表
    this.getCateList()
  },
  computed:{
    isBtnDisabled(){//控制添加按钮选中,true为选中
      if(this.selectedKeys.length !== 3){
        return true
      }
      return false
    },
    cateId(){
      if(this.selectedKeys.length === 3){//如果长度为3，返回三级分类id
        return this.selectedKeys[2]
      }
      return
    }
  },
  methods:{
    async getCateList(){//页面刷新时获取数据
      const {data:res} = await this.$axios.get('categories',{params:{type:3}})
      if(res.meta.status !== 200)return this.$message.error('获取商品列表失败')
      this.parentCateList = res.data
      console.log(res)
    },
    parentCateChanged(){//级联选择框内容变化时触发
      console.log(this.selectedKeys.length)
      if(this.selectedKeys.length !== 3){
        this.selectedKeys = []
        return
      }
      this.getParamsData()
    },
    handleTapClick(){//激活标签页时触发
      console.log(this.activeName)
      this.getParamsData()
    },
    async getParamsData(){//获取分类参数数据

      // 根据所选参数id，以及标签状态获取商品分类参数
      const {data:res} = await this.$axios.get(`categories/${this.cateId}/attributes`,{
        params:{sel:this.activeName}
        })
      if(res.meta.status !== 200)return this.$message.error('获取商品分类参数失败')
      console.log(res)
      if(this.activeName === 'many'){//获取动态参数数据
        this.manyTableData = res.data
      }else{//获取静态参数数据
        this.onlyTableData = res.data
      }
    }
  }
}
</script>
<style scoped>
.el-row{
  margin: 15px 0;
}
.el-cascader{
  padding: 0 10px;
}
</style>