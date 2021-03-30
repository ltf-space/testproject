<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" 
          clearable @clear='getUsersList'>
            <el-button slot="append" icon="el-icon-search" 
            @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户 -->
        <el-col :span="6">
          <el-button type='primary' @click="addDialogVisable = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据信息 -->
      <el-table :data="usersList" style="width: 100%" :stripe = 'true' :border = 'true'>
        <el-table-column type='index' label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱"  width="180"> </el-table-column>
        <el-table-column prop="mobile" label="电话"  width="180"> </el-table-column>
        <el-table-column prop="role_name" label="角色"  width="180"></el-table-column>
        <el-table-column prop="mg_state"  label="状态" width="180">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" @change='userStateChange(scope.row)'>
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
          <template width='180' slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="warning" icon="el-icon-delete" size='mini' @click="removeUserById(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable='false'>
              <el-button type="info" icon="el-icon-share" 
              size='mini' @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页展示 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 5, 8]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

<!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisable"
      width="50%" @close='addDialogClosed'>

      <!-- 添加用户输入框 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

<!-- 修改用户信息对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisable"
      width="50%"
      @close='editDialogClosed'>
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 分配权限对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setRoleDialogVisable"
      width="30%" @close='setRoleDialogClosed'>
      <div>
        <p>当前用户:{{userRightInfo.username}}</p>
        <p>当前角色:{{userRightInfo.role_name}}</p>
        <p>分配新角色:
           <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.id"
              :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'Users',
  components:{},
  data(){

    // 验证邮箱命名规则
    var checkEmail = (rules,value,callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      // 邮箱验证通过
      if(regEmail.test(value)) return callback()
      // 邮箱验证失败
      callback(new Error('请输入有效邮箱'))
    }
    // 验证手机命名规则
    var checkMobile = (rules,value,callback) => {
      const regMobile = /^1[3-9][0-9]{9}$/;
      // 手机验证通过
      if(regMobile.test(value)) return callback()
      // 手机验证失败
      callback(new Error('请输入有效手机号'))
    }

    return {
      queryInfo:{
        // 查询关键字
        query:'',
        //当前页数
        pagenum:1,
        // 每页显示多少条数据
        pagesize:2
      },
      usersList:[],
      total:0,
      //默认为false，隐藏添加用户对话框
      addDialogVisable:false,
      // 添加用户的表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      // 添加表单验证规则
      addFormRules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 3 到 8字符', trigger: 'blur' }
        ],
        password:[
          { required:true,message:'请输入密码',trigger:'blur'},
          { min:6,max:16,message:'长度在6-16字符',trigger:'blur'}
        ],
        email:[
          { required:true,message:'请输入邮箱',trigger:'blur' },
          // 自定义邮箱书写规则
          { validator:checkEmail,trigger:'blur'}
        ],
        mobile:[
          { required:true,message:'请输入手机号',trigger:'blur' },
          { validator:checkMobile,trigger:'blur'}
        ]
      },
      // 修改用户信息对话框，默认隐藏
      editDialogVisable:false,
      // 查询并保存用户旧信息
      editForm:{},
      // 控制分配角色对话框显示与隐藏
      setRoleDialogVisable:false,
      // 当前需要被分配的用户信息
      userRightInfo:{},
      // 所有角色的数据列表
      roleList:[],
      // 已选中的角色
      selectRoleId:''
    }
  },
  created(){
    this.getUsersList()
  },
  methods:{
    async getUsersList(){//获取用户列表
      const { data:res } = await this.$axios.get('/users',{ params : this.queryInfo })
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.usersList = res.data.users//存储用户列表
      this.total = res.data.total//存储total
    },
    handleSizeChange(newSize){//pageSize 改变时会触发,每页显示多少条
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    handleCurrentChange(newPage){//currentPage 改变时会触发，当前页数
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },
    async userStateChange(userInfo){//状态发生改变时触发
      // console.log(userInfo)
      const {data:res} = await this.$axios.put(`/users/${userInfo.id}/state/${userInfo.mg_state}`)
      console.log(res)
      if(res.meta.status !== 200) {
        this.userInfo.mg_state = ! this.userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
      
    },
    // 监听添加用户对话框关闭事件
    addDialogClosed(){
      //重置对话框
      this.$refs.addFormRef.resetFields()
    },
    addUser(){//点击确定按钮添加新用户
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return
        //发送添加用户请求
        const {data:res} = await this.$axios.post('users',this.addForm)
        console.log(res)
        if(res.meta.status !== 201) return this.$message.error('添加新用户失败')
        this.$message.success('添加新用户成功')
        // 重新刷新列表
        this.getUsersList()
        // 隐藏对话框
        this.addDialogVisable = false
      })
    },
    async showEditDialog(id){//点击修改按钮发送请求
      const {data:res} = await this.$axios.get('users/' + id)
      if(res.meta.status !== 200) return this.$message.error('发送修改请求失败')
      this.editForm = res.data
      // console.log(res)
      this.editDialogVisable = true
    },
    editDialogClosed(){//监听修改用户对话框，重置用户信息
      this.$refs.editFormRef.resetFields()
    },
    editUser(){//点击确定按钮修改新用户
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return 
        const {data:res} = await this.$axios.put('users/'+ this.editForm.id,{
          email:this.editForm.email,
          mobile:this.editForm.mobile
        })
        console.log(res)
        if(res.meta.status !== 200) return this.$message.error('修改失败')
        //隐藏修改对话框
        this.editDialogVisable = false
        //重新发请求，获取修改后的新数据
        this.getUsersList()
        this.$message.success('修改成功')
      })
    },
    async removeUserById(id){//点击删除按钮触发
      // console.log(id)
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err => err)
      // console.log(confirmResult)
      // 当confirmResult为confirm时，说明用户点击了确定按钮，当为cancel时，点击了取消按钮
      if(confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const {data:res} = await this.$axios.delete('users/'+ id)
      if(res.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.error('删除用户成功')
      this.getUsersList()
      
    },
    async setRole(userInfo){//点击分配角色按钮
      this.userRightInfo = userInfo
      const {data:res} = await this.$axios.get('roles')
      // console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取角色信息失败')
      this.$message.success('获取角色信息成功')
      this.roleList = res.data
      this.setRoleDialogVisable = true
    },
    async saveRoleInfo(){//点击分配角色确定按钮，更新角色信息
      if(!this.selectRoleId) return this.$message.info('请选择角色')
      const {data:res} = await this.$axios.put(`users/${this.userRightInfo.id}/role`,{rid:this.selectRoleId})
      // console.log(res)
      if(res.meta.status !== 200) return this.$message.error('更新角色信息失败')
      this.$message.success('更新角色信息成功')
      this.getUsersList()
      this.setRoleDialogVisable = false
    },
    setRoleDialogClosed(){//监听分配权限对话框关闭
      this.selectRoleId = ''//重置已选中的角色
      this.userRightInfo = ''//重置当前需要被分配的用户信息
    }
  }
}
</script>
<style scoped>

</style>