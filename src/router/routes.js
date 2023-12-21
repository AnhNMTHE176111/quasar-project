
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/products', component: () => import('pages/product/ProductsPage.vue') },
      { path: '/users', component: () => import('pages/user/UsersPage.vue') },
      { path: '/carts', component: () => import('pages/cart/CartsPage.vue') },
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
