import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/views/layout/index.vue';
import Login from '@/views/Login';
import Admin from "@/views/admin/index.vue";
import Employee from "@/views/employee/index.vue";
import SuperAdmin from "@/views/superAdmin/index.vue";
import BillingIncome from '@/components/income/BillingIncome.vue';
import CardSales from "@/components/income/CardSales.vue";
import Notification from "@/components/income/Notification.vue";
import Intercompany from "@/components/income/Intercompany.vue";
import PrepaidConversion from "@/components/income/PrepaidConversion.vue";
import BillingType from "@/components/encode/BillingType.vue";
import CancellationType from "@/components/encode/CancellationType.vue";
import City from "@/components/encode/City.vue";
import notificationType from "@/components/encode/NotificationType.vue";
import Product from "@/components/encode/Product.vue";
import NotificationType from "@/components/encode/NotificationType.vue";
import receiptPurpose from "@/components/encode/ReceiptPurpose.vue";
import settlementType from "@/components/encode/SettlementType.vue";
import settlementOperator from "@/components/encode/SettlementOperator.vue";

const routes = [
  {
    path: '/login', // 将登录页面放在最前面
    name: 'login',
    component: Login
  },
  {
    path: '/employee',
    component: Layout,
    children: [
      {
        path: 'billing',
        name: 'billing',
        component: BillingIncome
      },
      {
        path: 'card_sales',
        name: 'card_sales',
        component: CardSales
      },
      {
        path: 'notification',
        name: 'notification',
        component: Notification
      },
      {
        path: 'intercompany',
        name: 'intercompany',
        component: Intercompany
      },
      {
        path: 'prepaid_conversion_income',
        name: 'prepaid_conversion_income',
        component: PrepaidConversion
      },
      {
        path: 'billing_type',
        name: 'billing_type',
        component: BillingType
      },
      {
        path: 'cancellation_type',
        name: 'cancellation_type',
        component: CancellationType
      },
      {
        path: 'city',
        name: 'city',
        component: City
      },
      {
        path: 'notification_type',
        name: 'notification_type',
        component: NotificationType
      },
      {
        path: 'product',
        name: 'product',
        component: Product
      },
      {
        path: 'receipt_purpose',
        name: 'receipt_purpose',
        component: receiptPurpose
      },
      {
        path: 'settlement_type',
        name: 'settlement_type',
        component: settlementType
      },
      {
        path: 'settlement_operator',
        name: 'settlement_operator',
        component: settlementOperator
      }
    ]
  },
  {
    path: '/admin',
    name: 'admin',
    // component: Admin
    redirect: '/employee'
  },
  {
    path: '/super_admin',
    name: 'super_admin',
    // component: SuperAdmin
    redirect: '/employee'
  },
  {
    path: '/',
    name: 'null',
    redirect: '/login'
  }

  // 其他路由配置
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  console.log(token);
  if (to.name !== 'login' && !token) {
    alert("您的身份信息已过期，请重新登录")
    next('/login');
  } else {
    next();
  }
});



export default router;
