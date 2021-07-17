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
          <el-button type='primary' @click="showCateDialogVisible">添加商品分类</el-button>
        </el-col>
      </el-row>

      <tree-table class="tree-table" :data='cateList' :columns='columns'
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
          <el-button type="primary" icon="el-icon-edit"
          size='mini' @click="editCateById(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" 
          size='mini' @click="removeCateById(scope.row.cat_id)">删除</el-button>
        </template> 
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[2, 5, 8, 12]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%" @close='addCateDialogClosed'>
       <!-- 添加用户输入框 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类">
          <!-- 级联选择器  :options绑定数据源-->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加编辑对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%">
      <el-form :model="editRoleForm" :rules="addCateFormRules" ref="editCateFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editRoleForm.cat_name"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
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
      ],
      // 控制添加分类对话框默认隐藏
      addCateDialogVisible:false,
      // 添加分类的数据对象
      addCateForm:{
        cat_name:'',//将要添加的分类名称
        cat_pid:0,//父级分类id
        cat_level:0//分类等级，默认添加一级分类
      },
      addCateFormRules:{
        cat_Name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类数据
      parentCateList:[],
      //指定级联选择器的配置对象
      cascaderProps:{
        expandTrigger : 'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children',
        checkStrictly : 'true'//可选择任意一级分类
      },
      // 选中的父级分类的id数组
      selectedKeys:[],
      // 控制编辑对话框隐藏
      editCateDialogVisible:false,
      // 点击编辑按钮，存储获取到的分类信息
      editRoleForm:{}
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
    },
    handleSizeChange(newPageSize){//监听pagesize变化
      this.querInfo.pagesize = newPageSize
      this.getCateList()
    },
    handleCurrentChange(newPageNum){//监听pagenum变化
      this.querInfo.pagenum = newPageNum
      this.getCateList()
    },
    showCateDialogVisible(){//点击添加商品分类按钮,显示对话框
      this.addCateDialogVisible = true
      this.getParentCateList()
    },
    async getParentCateList(){//获取父级分类数据的列表
      const {data:res} = await this.$axios.get('categories',{params:{type:2}})
      if(res.meta.status !== 200)return this.$message.error('获取分类数据失败')
      // console.log(res)
      this.parentCateList = res.data
    },
    parentCateChanged(){//选择项发生变化触发
      console.log(this.selectedKeys)
      // 如果selectedKeys数组长度 > 0，说明有选中父级分类，反之，没有
      if(this.selectedKeys.length > 0){
        // 获取父级分类id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 获取分类等级
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }else{//说明没有选择分类，默认为0
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
        return
      }
      
    },
    addCate(){//点击添加分类对话框确定按钮
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate( async valid => {
        if(!valid) return
        const {data:res} = await this.$axios.post('categories',this.addCateForm)
        if(res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        console.log(res)
        this.addCateDialogVisible = false
        this.getCateList()
      })
    },
    addCateDialogClosed(){//监听添加分类对话框关闭
    // 重置对话框内容
      this.$refs.addCateFormRef.resetFields()
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.selectedKeys  = []
    },
    async removeCateById(id){//点击删除按钮，删除所选分类
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err => err)
      if(confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const {data:res} = await this.$axios.delete('categories/'+id)
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.error('删除成功')
      this.getCateList()
    },
    async editCateById(id){//点击编辑按钮
      const {data:res} = await this.$axios.get('categories/'+id)
      // console.log(res)
      this.editRoleForm = res.data
      this.editCateDialogVisible = true
    },
    async editCate(){//点击编辑确定按钮，完成编辑
      this.$refs.editCateFormRef.validate(async valid => {
        if(!valid)return
        const {data:res} = await this.$axios.put('categories/'+this.editRoleForm.cat_id,
        { cat_name:this.editRoleForm.cat_name })
        console.log(res)
        this.editRoleForm = res.data
        this.getCateList()
        this.editCateDialogVisible =false
      })
    }
  }
}
</script>
<style scoped>
.tree-table{
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>