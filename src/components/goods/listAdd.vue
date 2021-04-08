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
      <!-- form表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" 
      label-width="100px"  label-position='top'>
        <!-- tab栏区域 -->
        <el-tabs v-model="activeIndex" :tab-position="tabPosition"
        :before-leave='beforeTagLeave' @tab-click='tabClick'>
          <el-tab-pane label="基本信息" name='0'>
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price" label-position='top'>
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" label-position='top'>
              <el-input v-model="addForm.goods_weight" type='number'></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" label-position='top'>
              <el-input v-model="addForm.goods_number"  type='number'></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat" label-position='top'>
              <el-cascader v-model="addForm.goods_cat" :options="parentCateList"
                :props="cascaderProps" @change="parentCateChanged" clearable>
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name='1'>
            <el-form-item :label="item.attr_name" v-for="(item,index) in manyTableData"
            :key="index">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item1" border
                v-for="(item1,index) in item.attr_vals" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name='2'>
            <el-form-item :label="item.attr_name" label-position='top'
            v-for="(item,index) in onlyTableData" :key="index">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name='3'>
            <el-upload :action="upLoadURL" :on-preview="handlePreview"
              :on-remove="handleRemove" list-type="picture" 
              :headers='headerObj' :on-success='handleSuccess'>
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name='4'>
            <quill-editor v-model="addForm.goods_introduce">

            </quill-editor>
            <el-button type='primary' @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 添加图片预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <img :src="previewPath" alt="图片" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
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
      addForm:{
        goods_name:'',
        goods_price:'',
        goods_weight:'',
        goods_number:'',
        // 所选中的三级分类数组
        goods_cat:[],
        // 存储上传图片的临时路径
        pics:[],
        // 商品的详情描述
        goods_introduce:'',
        // 添加商品时保存的商品id和vals
        attrs:[]
      },
      // 表单验证规则
      addFormRules:{
        goods_name:[
          { required : true,message:'请输入商品名称',trigger:'blur' }
        ],
        goods_price:[
          { required : true,message:'请输入商品价格',trigger:'blur' }
        ],
        goods_weight:[
          { required : true,message:'请输入商品重量',trigger:'blur' }
        ],
        goods_number:[
          { required : true,message:'请输入商品数量',trigger:'blur' }
        ],
        goods_cat:[
          { required : true,message:'请输入商品分类',trigger:'blur' }
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
        // checkStrictly : 'true'//可选择任意一级分类
      },
      // 动态参数列表数据
      manyTableData:[],
      // 静态参数列表数据
      onlyTableData:[],
      // 图片上传的路径
      upLoadURL:'http://127.0.0.1:8888/api/private/v1/upload',
      // 给upload组件添加token
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      // 保存点击图片时获得的完整路径
      previewPath:'',
      // 控制图片预览对话框隐藏
      previewVisible:false
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    async getCateList(){//获得商品分类列表
      const {data:res} = await this.$axios.get('categories')
      console.log(res)
      if(res.meta.status !== 200)return this.$message.error('获取分类列表失败');
      this.parentCateList = res.data
    },
    parentCateChanged(){//级联选择框内容变化时触发
      // console.log(this.addForm.goods_cat.length)
      if(this.addForm.goods_cat.length !== 3){
        this.addForm.goods_cat = []
        return
      }
      this.getCateList()
    },
    beforeTagLeave(activeName,oldActiveName){//发生标签页之间跳转时触发
      // console.log(oldActiveName,activeName)
      // 如果没有选中三级分类且当前标签页为默认激活的index值
      if(this.addForm.goods_cat.length !== 3 && oldActiveName === '0'){
        this.$message.error('请选择商品分类')
        return false
      }
    },
    async tabClick(){//点击标签页时触发
      console.log(this.activeIndex)
      if(this.activeIndex === '1'){//说明点击了‘商品参数’标签
        const {data:res} = await this.$axios.get(`categories/${this.addForm.goods_cat[2]}/attributes`,{params:{sel:'many'}})
        // console.log(res)
        if(res.meta.status !== 200)return this.$message.error('获取信息失败')       
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        });
        this.manyTableData = res.data
        // console.log(this.manyTableData)
      }else if(this.activeIndex === '2'){
        const {data:res} = await this.$axios.get(`categories/${this.addForm.goods_cat[2]}/attributes`,{params:{sel:'only'}})
        console.log(res)
        // if(res.meta.status !== 200)return this.$message.error('获取信息失败')       
        // res.data.forEach(item => {
        //   item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // });
        this.onlyTableData = res.data
      }else if(this.activeIndex === '3'){

      }
    },
    handlePreview(file){//点击上传的图片名称触发
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove(file){//点击图片右上角触发，移除图片
      console.log(file)
      // 存储图片路径
      const filePath = file.response.data.tmp_path
      // 判断图片路径与图片上传时获得的路径是否相同，相同则返回对应的索引
      const index = this.addForm.pics.findIndex( item => item.pic === filePath)
      console.log(index)
      // 根据索引删除图片路径
      this.addForm.pics.splice(index,1)
      console.log(this.addForm)
    },
    handleSuccess(response){//图片上传成功后回调
      console.log(response)//返回图片的临时路径
      const picInfo = {
        pic:response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm.pics)
    },
    add(){//点击添加商品按钮
      this.$refs.addFormRef.validate(async valid => {
        if(!valid)return this.$message.error('请添加必要的表单项')
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')//转成数组
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id : item.attr_id,
            attr_value : item.attr_vals.join(' ')//转成字符串
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        const {data:res} = await this.$axios.post('goods',form)
        if(res.meta.status !== 201)return this.$message.error('添加失败')
        console.log(res)
        this.$message.success('添加成功')
        this.$router.push('/goods')
        // this.getCateList()
      })
    }
  }
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
.el-checkbox{
  margin: 0 10px 0 0 !important;
}
.previewImg{
  width: 100%;
  height: 100%;
}
.el-button{
  margin-top: 15px;
}
</style>