import { adminStore } from '@/stores/admin'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        return { 
          path: '/login' 
        }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/layout',
      name: 'layout',
      component: () => import('@/views/LayoutView.vue'),
      redirect: () => {
        return {
          path: '/home'
        }
      },
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/home/HomeView.vue')
        },
        {
          path: '/userInfo',
          name: 'userInfo',
          component: () => import('@/views/person/UserInfoView.vue')
        },
        {
          path: '/person',
          name: 'person',
          redirect: () => {
            return {
              path: '/person/user'
            }
          },
          children: [
            {
              path: '/person/user',
              name: 'user',
              component: () => import('@/views/person/UserView.vue')
            },
            {
              path: '/person/teacher',
              name: 'teacher',
              component: () => import('@/views/person/TeacherView.vue')
            },
            {
              path: '/person/admin',
              name: 'admin',
              component: () => import('@/views/person/AdminView.vue')
            },
            {
              path: '/person/teacherApply',
              name: 'teacherApply',
              component: () => import('@/views/person/TeacherApplyView.vue')
            },
            {
              path: '/person/loginLog',
              name: 'loginLog',
              component: () => import('@/views/person/LoginLogView.vue')
            },
          ]
        },
        {
          path: '/article',
          name: 'article',
          redirect: () => {
            return {
              path: '/article/all'
            }
          },
          children: [
            {
              path: '/article/all',
              name: 'articleAll',
              component: () => import('@/views/article/ArticleView.vue')
            },
            {
              path: '/article/apply',
              name: 'articleApply',
              component: () => import('@/views/article/ArticleApplyView.vue')
            },
            {
              path: '/articleInfo/:articleInfo',
              name: 'articleInfo',
              component: () => import('@/views/article/ArticleInfoView.vue')
            }
          ]
        },
        {
          path: '/course',
          name: 'course',
          redirect: () => {
            return {
              path: '/course/all'
            }
          },
          children: [
            {
              path: '/course/all',
              name: 'courseAll',
              component: () => import('@/views/course/CourseView.vue')
            },
            {
              path: '/course/apply',
              name: 'courseApply',
              component: () => import('@/views/course/CourseApplyView.vue')
            }
          ]
        },
        {
          path: '/authority',
          name: 'authority',
          redirect: () => {
            return {
              path: '/authority/zone'
            }
          },
          children: [
            {
              path: '/authority/zone',
              name: 'authorityZone',
              component: () => import('@/views/authority/ZoneView.vue')
            },
            {
              path: '/authority/menu',
              name: 'authorityMenu',
              component: () => import('@/views/authority/MenuView.vue')
            },
            {
              path: '/authority/role',
              name: 'authorityRole',
              component: () => import('@/views/authority/RoleView.vue')
            },
            {
              path: '/authority/medal',
              name: 'authorityMedal',
              component: () => import('@/views/authority/MedalView.vue')
            },
          ]
        },
        {
          path: '/order',
          name: 'order',
          component: () => import('@/views/order/OrderView.vue')
        },
        {
          path: '/message',
          name: 'message',
          component: () => import('@/views/message/MessageView.vue')
        },
        {
          path: '/feedback',
          name: 'feedback',
          component: () => import('@/views/feedback/FeedbackView.vue')
        },
        {
          path: '/technical',
          name: 'technical',
          component: () => import('@/views/technical/TechnicalView.vue')
        },
        {
          path: '/onlineCustom',
          name: 'onlineCustom',
          component: () => import('@/views/custom/OnlineCustomView.vue')
        },
        {
          path: '/carousel',
          name: 'carousel',
          component: () => import('@/views/carousel/CarouselView.vue')
        },
        {
          path: '/exam',
          name: 'exam',
          component: () => import('@/views/exam/ExamView.vue')
        },
      ]
    }
  ]
})


// 全局路由守卫
router.beforeEach((to, from, next) => {
  const admin = adminStore()
  if (!admin.isLogin && to.path !== '/login') {
    ElMessage.info('请先登录')
    next({ path: '/login', replace: true, force: true})
  } else {
    next()
  }
})

export default router
