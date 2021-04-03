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
          <el-button type='primary' size='mini' :disabled='isBtnDisabled'
          @click="addDialogVisble = true">添加参数</el-button>
          <!-- 动态分类参数表格 -->
          <el-table :data="manyTableData" stripe border style="width: 100%">
            <el-table-column type='expand'></el-table-column>
            <!-- 索引列 -->
            <el-table-column type='index' label="#" ></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" ></el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size='mini'
                @click="showEditDialog(scope.row.attr_id)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size='mini'
                @click="removeDialog(scope.row.attr_id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态参数模板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type='primary' size='mini' :disabled='isBtnDisabled'
          @click="addDialogVisble = true">添加属性</el-button>
          <!-- 静态分类参数表格 -->
          <el-table :data="onlyTableData" stripe border style="width: 100%">
            <el-table-column type='expand'></el-table-column>
            <!-- 索引列 -->
            <el-table-column type='index' label="#" ></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" ></el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size='mini'
                @click="showEditDialog(scope.row.attr_id)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size='mini'
                @click="removeDialog(scope.row.attr_id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态/静态属性对话框 -->
    <el-dialog
      :title=" '添加' + titleText"
      :visible.sync="addDialogVisble"
      width="50%"
      @close='addDialogClosed'>
      <el-form :model="addParamsForm" :rules="addParamsFormRules" ref="addParamsFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加编辑对话框 -->
     <el-dialog
      :title=" '修改'+titleText"
      :visible.sync="editDialogVisble"
      width="50%"
      @close='editDialogClosed'>
      <el-form :model="editParamsForm" :rules="addParamsFormRules" ref="editParamsFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
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
      onlyTableData:[],
      // 控制添加属性对话框隐藏
      addDialogVisble:false,
      // 存储动态/静态数据
      addParamsForm:{},
      // 验证规则
      addParamsFormRules:{
        attr_name:[
          { required:true,message:'请输入参数名称',trigger:'blur'}
        ]
      },
      // 控制编辑对话框隐藏
      editDialogVisble:false,
      // 存储编辑后的数据
      editParamsForm:{}
       
      
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
    },
    titleText(){//动态或静态属性文本
      if(this.activeName === 'many'){
        return '动态参数'
      }else{
        return '静态属性'
      }
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
    },
    addDialogClosed(){//监听对话框关闭
      this.$refs.addParamsFormRef.resetFields()
    },
    addParams(){//点击添加属性确定按钮
      this.$refs.addParamsFormRef.validate(async valid => {
        if(!valid)return
        const {data:res} = await this.$axios.post(`categories/${this.cateId}/attributes`,
        { attr_name:this.addParamsForm.attr_name,attr_sel:this.activeName })
        if(res.meta.status !== 201)return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.getParamsData()
        this.addDialogVisble = false
        // console.log(res)
      })
    },
    async showEditDialog(id){//点击编辑按钮触发
      const {data:res} = await this.$axios.get(`categories/${this.cateId}/attributes/${id}`,{params:{attr_sel:this.activeName}})
      if(res.meta.status !== 200)return this.$message.error('获取信息失败')
      this.editParamsForm = res.data
      // console.log(res)
      this.editDialogVisble = true
    },
    editParams(){//点击编辑对话框确定按钮
      this.$refs.editParamsFormRef.validate(async valid => {
        if(!valid)return
        const {data:res} = await this.$axios.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,
        {attr_name:this.editParamsForm.attr_name,attr_sel:this.activeName})
        console.log(res)
        this.getParamsData()
        this.editDialogVisble = false
      })
    },
    editDialogClosed(){//监听对话框关闭
      this.$refs.editParamsFormRef.resetFields()
    },
    async removeDialog(id){//点击删除按钮，删除参数
      const resultConfirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if(resultConfirm !== 'confirm')return this.$message.info('已取消删除')
      const {data:res} = await this.$axios.delete(`categories/${this.cateId}/attributes/${id}`)
      console.log(res)
      if(res.meta.status !== 200)return this.$message.error('删除数据失败')
      this.$message.success('删除参数成功')
      this.getParamsData()
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