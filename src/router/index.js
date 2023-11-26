/**
 * @author https://vue-admin-beautiful.com （不想保留author可删除）
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layouts'
import EmptyLayout from '@/layouts/EmptyLayout'
import { publicPath, routerMode } from '@/config'

Vue.use(VueRouter)
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true,
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/401'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true,
  },
]

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index/index'),
        meta: {
          title: '首页',
          icon: 'home',
        },
      },
    ],
  },
  /* {
    path: "/test",
    component: Layout,
    redirect: "noRedirect",
    children: [
      {
        path: "test",
        name: "Test",
        component: () => import("@/views/test/index"),
        meta: {
          title: "test",
          icon: "marker",
          permissions: ["admin"],
        },
      },
    ],
  }, */

  {
    path: '/vab',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Vab',
    alwaysShow: true,
    meta: { title: '组件', remixIcon: 'approval' },
    children: [
      {
        meta: {
          title: '角色权限',
          permissions: ['admin', 'editor', 'operator'],
          remixIcon: 'approval',
        },
        path: 'permissions',
        name: 'Permission',
        component: () => import('@/views/vab/permissions/index'),
      },
      {
        path: 'icon',
        component: EmptyLayout,
        redirect: 'noRedirect',
        name: 'Icon',
        meta: {
          title: '图标',
          permissions: ['admin'],
        },
        children: [
          {
            path: 'awesomeIcon',
            name: 'AwesomeIcon',
            component: () => import('@/views/vab/icon/index'),
            meta: { title: '常规图标' },
          },
          {
            path: 'colorfulIcon',
            name: 'ColorfulIcon',
            component: () => import('@/views/vab/icon/colorfulIcon'),
            meta: { title: '多彩图标' },
          },
        ],
      },
      {
        path: 'table',
        component: () => import('@/views/vab/table/index'),
        name: 'Table',
        meta: {
          title: '表格',
          permissions: ['admin'],
        },
      },
      {
        path: 'map',
        component: () => import('@/views/vab/map/index'),
        name: 'Map',
        meta: {
          title: '地图',
          permissions: ['admin'],
        },
      },

      {
        path: 'webSocket',
        name: 'WebSocket',
        component: () => import('@/views/vab/webSocket/index'),
        meta: { title: 'webSocket', permissions: ['admin'] },
      },
      {
        path: 'form',
        name: 'Form',
        component: () => import('@/views/vab/form/index'),
        meta: { title: '表单', permissions: ['admin'] },
      },
      {
        path: 'element',
        name: 'Element',
        component: () => import('@/views/vab/element/index'),
        meta: { title: '常用组件', permissions: ['admin'] },
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/vab/tree/index'),
        meta: { title: '树', permissions: ['admin'] },
      },
      {
        path: 'menu1',
        component: () => import('@/views/vab/nested/menu1/index'),
        name: 'Menu1',
        alwaysShow: true,
        meta: {
          title: '嵌套路由 1',
          permissions: ['admin'],
        },
        children: [
          {
            path: 'menu1-1',
            name: 'Menu1-1',
            alwaysShow: true,
            meta: { title: '嵌套路由 1-1' },
            component: () => import('@/views/vab/nested/menu1/menu1-1/index'),

            children: [
              {
                path: 'menu1-1-1',
                name: 'Menu1-1-1',
                meta: { title: '嵌套路由 1-1-1' },
                component: () =>
                  import('@/views/vab/nested/menu1/menu1-1/menu1-1-1/index'),
              },
            ],
          },
        ],
      },
      {
        path: 'loading',
        name: 'Loading',
        component: () => import('@/views/vab/loading/index'),
        meta: { title: 'loading', permissions: ['admin'] },
      },
      {
        path: 'backToTop',
        name: 'BackToTop',
        component: () => import('@/views/vab/backToTop/index'),
        meta: { title: '返回顶部', permissions: ['admin'] },
      },
      {
        path: 'lodash',
        name: 'Lodash',
        component: () => import('@/views/vab/lodash/index'),
        meta: { title: 'lodash', permissions: ['admin'] },
      },
      {
        path: 'smallComponents',
        name: 'SmallComponents',
        component: () => import('@/views/vab/smallComponents/index'),
        meta: { title: '小组件', permissions: ['admin'] },
      },

      {
        path: 'upload',
        name: 'Upload',
        component: () => import('@/views/vab/upload/index'),
        meta: { title: '上传', permissions: ['admin'] },
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/vab/errorLog/index'),
        meta: { title: '错误日志模拟', permissions: ['admin'] },
      },
    ],
  },
  {
    path: '/acc_mangement',
    component: Layout,
    redirect: 'noRedirect',
    name: 'acc_mangement',
    meta: {
      title: '账户管理',
      remixIcon: 'currencyexchange',
      permissions: ['admin'],
    },
    //meta: { title: '组件', remixIcon: 'approval' },
    children: [
      {
        path: 'acc_operation',
        name: 'acc_operation',
        component: () => import('@/views/acc_management/acc_operation/index'),
        meta: { title: '开户销户', remixIcon: 'approval' },
      },
      {
        path: 'acc_rate',
        name: 'acc_rate',
        component: () => import('@/views/acc_management/acc_rate/index'),
        meta: { title: '账户利率管理' },
      },
    ],
  },
  {
    path: '/acc_collection',
    component: Layout,
    redirect: 'noRedirect',
    name: 'acc_collection',
    meta: {
      title: '资金归集',
      remixIcon: 'multiple_inputs',
      permissions: ['admin', 'operator'],
    },
    //meta: { title: '组件', remixIcon: 'approval' },
    children: [
      {
        path: 'acc_collection_oper',
        name: 'acc_collection_oper',
        component: () =>
          import('@/views/acc_collection/acc_collection_oper/index'),
        meta: { title: '资金归集', remixIcon: 'approval' },
      },
      {
        path: 'acc_collection_valid',
        name: 'acc_collection_valid',
        component: () =>
          import('@/views/acc_collection/acc_collection_valid/index'),
        meta: { title: '资金归集核对' },
      },
    ],
  },
  {
    path: '/acc_debt',
    component: Layout,
    redirect: 'noRedirect',
    name: 'acc_debt',
    meta: {
      title: '资金记账',
      remixIcon: 'debt',
      permissions: ['admin'],
    },
    //meta: { title: '组件', remixIcon: 'approval' },
    children: [
      {
        path: 'acc_debt_oper',
        name: 'acc_debt_oper',
        component: () => import('@/views/acc_debt/acc_debt_oper/index'),
        meta: { title: '资金记账', remixIcon: 'approval' },
      },
      {
        path: 'acc_debt_oper_batch',
        name: 'acc_debt_oper_batch',
        component: () => import('@/views/acc_debt/acc_debt_oper_batch/index'),
        meta: { title: '资金记账(批量)' },
      },
    ],
  },
  {
    path: '/personnelManagement',
    component: Layout,
    redirect: 'noRedirect',
    name: 'PersonnelManagement',
    meta: { title: '配置', icon: 'users-cog', permissions: ['admin'] },
    children: [
      {
        path: 'userManagement',
        name: 'UserManagement',
        component: () =>
          import('@/views/personnelManagement/userManagement/index'),
        meta: { title: '用户管理' },
      },
      {
        path: 'roleManagement',
        name: 'RoleManagement',
        component: () =>
          import('@/views/personnelManagement/roleManagement/index'),
        meta: { title: '角色管理' },
      },
      {
        path: 'menuManagement',
        name: 'MenuManagement',
        component: () =>
          import('@/views/personnelManagement/menuManagement/index'),
        meta: { title: '菜单管理', badge: 'New' },
      },
    ],
  },
  {
    path: '/mall',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Mall',
    meta: {
      title: '商城',
      icon: 'shopping-cart',
      permissions: ['admin'],
    },

    children: [
      {
        path: 'pay',
        name: 'Pay',
        component: () => import('@/views/mall/pay/index'),
        meta: {
          title: '支付',
          noKeepAlive: true,
        },
        children: null,
      },
      {
        path: 'goodsList',
        name: 'GoodsList',
        component: () => import('@/views/mall/goodsList/index'),
        meta: {
          title: '商品列表',
        },
      },
    ],
  },
  {
    path: '/error',
    component: EmptyLayout,
    redirect: 'noRedirect',
    name: 'Error',
    meta: { title: '错误页', icon: 'bug' },
    children: [
      {
        path: '401',
        name: 'Error401',
        component: () => import('@/views/401'),
        meta: { title: '401' },
      },
      {
        path: '404',
        name: 'Error404',
        component: () => import('@/views/404'),
        meta: { title: '404' },
      },
    ],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

const router = new VueRouter({
  base: publicPath,
  mode: routerMode,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
})

export function resetRouter() {
  location.reload()
}

export default router
