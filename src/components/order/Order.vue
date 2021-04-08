<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter='20'>
        <el-col :span='8'>
          <el-input placeholder="请输入内容" v-model="queryInfo.query" 
          clearable @clear='getOrderList'>
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
       <!-- 表格数据信息 -->
      <el-table :data="orderList" style="width: 100%" :stripe = 'true' :border = 'true'>
        <el-table-column type='index' label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width='400'></el-table-column>
        <el-table-column prop="order_price" label="订单价格(元)" > </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" >
          <template slot-scope="scope">
            <el-tag type='success' v-if="(scope.row.pay_status === '1')">已付款</el-tag>
            <el-tag type='danger' v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" ></el-table-column>
        <el-table-column prop="create_time" label="下单时间" >
          <template slot-scope="scope">
            {{moment(scope.row.create_time).format('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size='mini'
            @click="showAddress"></el-button>
            <el-button type="danger" icon="el-icon-location"
            size='mini' @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 底部分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 12, 18, 27]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加编辑对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%" @close='closeAddress'>
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader  v-model="addressForm.address1"
            :options="citydata" :props="{ expandTrigger: 'hover' }">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
     
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加物流进度对话框（静态） -->
    <el-dialog
      title="物流信息"
      :visible.sync="progressVisable"
      width="50%">
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp">
          {{activity.content}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citydata from './citydata.js'
export default {
  name:'Order',
  components:{},
  data(){
    return {
      queryInfo:{
        query:'',//查询关键字
        pagenum:1,//当前页码
        pagesize:5//每页显示条数
      },
      // 订单数据
      orderList:[],
      // 列表总条数
      total:0,
      // 控制编辑对话框隐藏
      addressVisible:false,
      // 全国城市级联选择器
      citydata:citydata,
      // 存储级联选择框选中的内容
      addressForm:{
        address1:[],
        address2:''
      },
      // 验证规则
      addressFormRules:{
        address1:[
          { required :true ,message :'请选择地区',trigger:'blur'}
        ],
        address2:[
          { required :true ,message :'请填写详细地址',trigger:'blur'}
        ]
      },
      // 控制物流信息对话框隐藏
      progressVisable:false,
      // 物流跟踪存储数据
      activities: [{
        content: '运输中',
        timestamp: '2018-04-15'
      }, {
        content: '已发货',
        timestamp: '2018-04-13'
      }, {
        content: '已揽收',
        timestamp: '2018-04-11'
      }]
    }
  },
  created(){
    this.getOrderList()
  },
  methods:{
    async getOrderList(){//页面加载时获取订单列表
      const {data:res} = await this.$axios.get('orders',{ params:this.queryInfo })
      console.log(res)
      if(res.meta.status !== 200)return this.$message.error('获取订单数据失败')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newPageSize){//监听每页条数的变化
      this.queryInfo.pagesize = newPageSize
      this.getOrderList()
    },
    handleCurrentChange(newPageNum){//监听页码的变化
      this.queryInfo.pagenum = newPageNum
      this.getOrderList()
    },
    showAddress(){//点击编辑弹出对话框
      this.addressVisible = true
    },
    closeAddress(){//重置输入框内容
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox(){//点击物流按钮
      this.progressVisable = true
      // const {data:res} = await this.$axios.get('/kuaidi/804909574412544580')
      // const {data:res} = await this.$axios.get('/kuaidi/110697572662')
      // if(res.meta.status !== 200)return this.$message.error('获取物流信息失败')
      // console.log(res)
    }
  }
}
</script>
<style scoped>
.el-cascader{
  width: 100%;
}
</style>