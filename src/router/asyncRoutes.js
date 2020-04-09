import Layout from '@/layout/index'

const asyncRoutes = [
  {
    path: '/table',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/table'),
        name: 'Table',
        meta: { title: 'Table' }
      }
    ]
  }
]

export default asyncRoutes
