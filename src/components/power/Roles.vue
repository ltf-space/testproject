<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加用户区域 -->
      <el-row>
        <el-col>
          <el-button type='primary'>添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格数据展示 -->
      <el-table :data="rolesList" style="width: 100%" 
        :stripe = 'true' :border = 'true'>
        <el-table-column type='expand'>
          <template slot-scope="scope">
            <el-row :class="['dbButtom',index === 0 ? 'dbTop':'','center']" 
            v-for="(item,index) in scope.row.children" :key='index'>
              <!-- 渲染第一级权限 -->
              <el-col :span='5'>
                <el-tag closable @close='removeRightById(scope.row,item.id)'>
                  {{item.authName}}
                </el-tag>
                <!-- 右箭头 -->
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染第二级，第三级 -->
              <el-col :span='19'>
                <!-- 渲染第二级权限 -->
                <el-row :class="[index === 0 ? '':'dbTop','center']" v-for="(item1,index) in item.children" :key="index">
                  <el-col :span='6'>
                    <el-tag type='success' closable @close='removeRightById(scope.row,item1.id)'>
                      {{item1.authName}}
                    </el-tag>
                    <!-- 右箭头 -->
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span='18'>
                    <!-- 渲染第三级权限 -->
                    <el-tag type='warning' v-for="(item2,index) in item1.children" 
                    :key="index" closable @close='removeRightById(scope.row,item2.id)'>
                      {{item2.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type='index' label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="350"></el-table-column>
        <el-table-column prop="roleDesc" label="角色职位"  width="350"></el-table-column>
        <el-table-column label="操作"  width="">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size='mini'>编辑</el-button>
            <el-button type="warning" icon="el-icon-delete" size='mini'>删除</el-button>
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable='false'>
              <el-button type="success" icon="el-icon-share" 
              size='mini' @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setRightDialogVisable"
      width="30%"
      @close='setRightDialogClosed'>
      <el-tree :data="rightsList" :props="treeProps" 
      show-checkbox node-key='id' default-expand-all
      :default-checked-keys='defKeys' ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'Roles',
  components:{},
  data(){
    return {
      // 角色列表数据
      rolesList:[],
      // 控制分配权限对话框显示与隐藏
      setRightDialogVisable:false,
      // 全部权限数据信息
      rightsList:[],
      //树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        //展示的全部权限管理中看到的每一标题题目
        label: 'authName'
      },
      // 存放默认勾选的三级权限的id数组
      defKeys:[],
      // 当前即将分配权限的角色id
      roleId:''
    }
  },
  created(){
    this.getRolesList()
  },
  methods:{
    async getRolesList(){//获取角色列表
      const { data:res } = await this.$axios.get('roles')
      if(res.meta.status !== 200) return this.$message.error('请求失败')
      this.rolesList = res.data
      // console.log(this.rolesList )
    },
    async removeRightById(rolesId,rightsId){//点击删除按钮，删除三级权限
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err => err)
      if(confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const {data:res} = await this.$axios.delete(`roles/${rolesId.id}/rights/${rightsId}`)
      if(res.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success('删除用户成功')
      rolesId.children = res.data
    },
    async showSetRightDialog(roles){//点击分配权限按钮，展示每一级权限
    // 保存角色id，在allotRights函数中作为请求参数使用
      this.roleId = roles.id
      const {data:res} = await this.$axios.get('rights/tree')
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取全部权限数据失败')
      this.rightsList = res.data
      // 点击分配权限后，调用函数获取三级权限id
      this.getLeafKey(roles,this.defKeys)
      this.setRightDialogVisable = true
    },
    // 通过递归的形式，获取角色下三级权限的id，并保存到defKeys数组中
    getLeafKey(node,arr){
      // 如果node没有孩子节点，说明是三级权限
      if(!node.children) return arr.push(node.id)
      node.children.forEach(item => {
        this.getLeafKey(item,arr)
      });
    },
    setRightDialogClosed(){//监听分配权限对话框的关闭，关闭前清空id
      this.defKeys = []
    },
    async allotRights(){//监听确定按钮，获取已选中的节点id
      const keys = [
        //获取全选节点
        ...this.$refs.treeRef.getCheckedKeys(),
        //获取半选节点
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const {data:res} = await this.$axios.post(`roles/${this.roleId}/rights`,{rids:idStr})
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('分配角色权限失败')
      this.$message.success('添加权限成功')
      this.getRolesList()
      this.setRightDialogVisable = false
    }
  }
}
</script>
<style scoped>
.el-tag{
  margin: 10px;
}
.dbTop{
  border-top: 1px solid #eee;
}
.dbButtom{
  border-bottom: 1px solid #eee;
}
.center{
  display: flex;
  align-items: center;
}
</style>