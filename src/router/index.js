import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('../components/login.vue')
const Home = () => import('../components/Home.vue')
const Welcome = () => import('../components/Welcome.vue')
const Users = () => import('../components/user/Users.vue')
const Rights = () => import('../components/power/Rights.vue')
const Roles = () => import('../components/power/Roles.vue')
const Cate = () => import('../components/goods/Cate.vue')
const Params = () => import('../components/goods/Params.vue')
const List = () => import('../components/goods/List.vue')
const listAdd = () => import('../components/goods/listAdd.vue')
const Order = () => import('../components/order/Order.vue')

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component: Login
  },
  {
    path:'/home',
    component: Home,
    // 重定向到welcome路由下
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome
      },
      {
        path:'/users',
        component:Users
      },
      {
        path:'/rights',
        component:Rights
      },
      {
        path:'/roles',
        component:Roles
      },
      {
        path:'/categories',
        component:Cate
      },
      {
        path:'/params',
        component:Params
      },
      {
        path:'/goods',
        component:List
      },
      {
        path:'/goods/add',
        component:listAdd
      },
      {
        path:'/orders',
        component:Order
      }
    ]
  }
]


const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to,from,next) => {
  // to代表将要访问的路径
  // from代表从哪个路径跳转过来
  // next是函数，表示放行
  if(to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
  next()
})
export default router
