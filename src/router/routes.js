
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/products', component: () => import('pages/ProductsPage.vue') },
      { path: '/users', component: () => import('pages/UsersPage.vue') },
      { path: '/carts', component: () => import('pages/CartsPage.vue') },
      { path: '/products/:id', component: () => import('pages/ProductDetailPage.vue') },
      { path: '/', component: () => import('pages/IndexPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
