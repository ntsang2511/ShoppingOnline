import AdminPage from '../pages/AdminPage/AdminPage'
import CreateProductPage from '../pages/AdminPage/CreateProductPage/CreateProductPage'
import EditProductPage from '../pages/AdminPage/EditProductPage/EditProductPage'
import EditUserPage from '../pages/AdminPage/EditUserPage/EditUserPage'
import AllProductPage from '../pages/AllProductPage/AllProductPage'
import CallbackPage from '../pages/CallbackPage/CallbackPage'
import DetailsOrderPage from '../pages/DetailsOrderPage/DetailsOrderPage'
import HomePage from '../pages/HomePage/HomePage'
import MyOrderPage from '../pages/MyOrderPage/MyOrderPage'
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'
import OrderPage from '../pages/OrderPage/OrderPage'
import OrderSuccess from '../pages/OrderSuccess/OrderSuccess'
import PaymentPage from '../pages/PaymentPage/PaymentPage'
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
    path: '/my-order',
    page: MyOrderPage,
    isShowHeader: true
  },
  {
    path: '/details-order/:id',
    page: DetailsOrderPage,
    isShowHeader: true
  },
  {
    path: '/payment',
    page: PaymentPage,
    isShowHeader: true
  },
  {
    path: '/callback',
    page: CallbackPage,
    isShowHeader: true
  },
  {
    path: '/orderSuccess',
    page: OrderSuccess,
    isShowHeader: true
  },
  {
    path: '/products',
    page: ProductPage,
    isShowHeader: true
  },
  { path: '/products/get-all', page: AllProductPage, isShowHeader: true },
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
