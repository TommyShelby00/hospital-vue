import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'


Vue.use(VueRouter)

const routes = [

  //用户路由
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '../views/user/LoginView.vue')
  },
  // {
  //   path: '/',
  // },
  {
    path: '/',
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
    },
    redirect: '/home',
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
    },
    component: () => import('../views/user/RegisterView.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/TestView.vue')
  }, 
  {
    path: '/home',
    name: 'home',
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
    },
    redirect: '/home/organization',
    component: () => import('../views/user/HomeView.vue'),
    children: [{
        path: 'searchOrg',
        name: 'searchOrg',
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () => import('../views/user/SearchOrgView.vue')
      },
      {
        path: 'searchDoc',
        name: 'searchDoc',
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () => import('../views/user/SearchDocView.vue')
      },
      {
        path: 'doctor',
        name: 'doctor',
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () => import('../views/user/DoctorView.vue')
      },
      {
        path: 'organization',
        name: 'organization',
        meta: {
          requireAuth: true,
        },
        component: () => import('../views/user/OrganizationView.vue')
      },
      {
        path: 'doctorDetail',
        name: 'doctorDetail',
        meta: {
          requireAuth: true,
        },
        component: () => import('../views/user/DoctorDetailView.vue')
      },
      {
        path: 'personalEdit',
        name: 'personalEdit',
        meta: {
          requireAuth: true,
        },
        component: () => import('../views/user/PersonalEditView.vue')
      }, {
        path: 'personalPatient',
        name: 'personalPatient',
        meta: {
          requireAuth: true,
        },
        component: () => import('../views/user/PersonalPatientView.vue')
      }, {
        path: 'personalOrder',
        name: 'personalOrder',
        meta: {
          requireAuth: true,
        },
        component: () => import('../views/user/PersonalOrderView.vue')
      },
      {
        path: 'personalAppoint',
        name: 'personalAppoint',
        meta: {
          requireAuth: true
        },
        component: () => import('../views/user/PersonalAppointView.vue')
      },
      {
        path: 'userMessage',
        name: 'userMessage',
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () => import('../views/user/UserMessageView.vue')
      },
    ]
  },
  
  
  //管理员登录
  {
    path: '/admin',
    name: 'admin',
    meta: {
      requireAuth: true
    },
    component: () => import('../views/admin/AdminView.vue'),
    children: [{
        path: 'userManage',
        name: 'userManage',
        meta: {
          requireAuth: true
        },
        component: () => import('../views/admin/UserManageView.vue')
      },
      {
        path: '',
        redirect: '/admin/userManage'
      },
      {
        path: 'cardManage',
        name: 'cardManage',
        meta: {
          requireAuth: true
        },
        component: () => import('../views/admin/CardManageView.vue')
      },
      {
        path: 'doctorManage',
        name: 'doctorManage',
        meta: {
          requireAuth: true
        },
        component: () => import('../views/admin/DoctorManageView.vue')
      },
      {
        path: 'orgManage',
        name: 'orgManage',
        meta: {
          requireAuth: true
        },
        component: () => import('../views/admin/OrgManageView.vue')
      },
      {
        path: 'schManage',
        name: 'schManage',
        meta: {
          requireAuth: true
        },
        component: () => import('../views/admin/SchManageView.vue')
      },
      {
        path: 'orderManage',
        name: 'orderManage',
        meta: {
          requireAuth: true
        },
        component: () => import('../views/admin/OrderManageView.vue')
      }
    ]
  },
  {
    path: '/adminLogin',
    name: 'adminLogin',
    component: () => import('../views/admin/AdminLoginView.vue')
  },
  
  
  //医生路由
  {
    path: '/doctorLogin',
    name: 'doctorLogin',
    component: () => import('../views/doctor/DoctorLoginView.vue')
  },
  {
    path: '/doctor',
    name: 'doctor',
    component: () => import('../views/doctor/DocHomeView.vue'),
    children: [{
        path: 'sch',
        name: 'sch',
        component: () => import('../views/doctor/DocSchView.vue')
      },
      {
        path: 'message',
        name: 'message',
        component: () => import('../views/doctor/DocMessageView.vue')
      },
      {
        path: 'order',
        name: 'order',
        component: () => import('../views/doctor/DocOrderView.vue')
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

// // 设置路由守卫，在进页面之前，判断有token，才进入页面，否则返回登录页面
router.beforeEach((to, from, next) => {
  // 判断要去的路由有没有requiresAuth
  // to.matched.some(r => r.meta.requireAuth) or to.meta.requiresAuth
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (store.state.token != null || store.state.token != '' || store.state.token != undefined) {
      next(); //有token,进行request请求，后台还会验证token
    } else {
      next({
        path: "/login",
        // 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由，这要进一步在登陆页面判断
        query: {
          redirect: to.fullPath
        }
      });
    }
  } else {
    next(); //无需token
  }
});

export default router