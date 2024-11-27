import AdminPage from '../pages/AdminPage/AdminPage'
import CreateProductPage from '../pages/AdminPage/CreateProductPage/CreateProductPage'
import EditProductPage from '../pages/AdminPage/EditProductPage/EditProductPage'
import EditUserPage from '../pages/AdminPage/EditUserPage/EditUserPage'
import HomePage from '../pages/HomePage/HomePage'
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'
import OrderPage from '../pages/OrderPage/OrderPage'
import ProductDetailsPage from '../pages/ProductDetailsPage/ProductDetailsPage'
import ProductPage from '../pages/ProductPage/ProductPage'
import ProfilePage from '../pages/ProfilePage/ProfilePage'
import SignInPage from '../pages/SignInPage/SignInPage'
import SignUpPage from '../pages/SignUpPage/SignUpPage'
import TypeProductPage from '../pages/TypeProductPage/TypeProductPage'

export const routes = [
  {
    path: '/',
    page: HomePage,
    isShowHeader: true
  },
  {
    path: '/order',
    page: OrderPage,
    isShowHeader: true
  },
  {
    path: '/products',
    page: ProductPage,
    isShowHeader: true
  },
  {
    path: '/products/create-product',
    page: CreateProductPage,
    isShowHeader: true
  },

  {
    path: 'products/edit/:id',
    page: EditProductPage,
    isShowHeader: true
  },
  {
    path: '/product/:type',
    page: TypeProductPage,
    isShowHeader: true
  },
  {
    path: '/sign-in',
    page: SignInPage,
    isShowHeader: false
  },
  {
    path: '/sign-up',
    page: SignUpPage,
    isShowHeader: false
  },
  {
    path: '/product-details/:id',
    page: ProductDetailsPage,
    isShowHeader: true
  },

  {
    path: '/users/edit/:id',
    page: EditUserPage,
    isShowHeader: true
  },
  {
    path: '/profile-user',
    page: ProfilePage,
    isShowHeader: true
  },
  {
    path: '/system/admin',
    page: AdminPage,
    isShowHeader: false,
    isPrivate: true
  },
  {
    path: '/*',
    page: NotFoundPage
  }
]
