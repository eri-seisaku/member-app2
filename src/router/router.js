// router
import {
  createRouter,
  createWebHistory,
  START_LOCATION // 遷移を判定するため
} from 'vue-router'

// firebase
import { getCurrentUser } from '@/firebase/v1/auth';
import { getOneLevelSingleData } from '@/firebase/v1/firestore';

// utils
import { role } from '@/utils/category'; // 権限

// 会員サイトルート
const siteRoutes = [
  {
    path: '/',
    component: () => import('@/layouts/site/Layout.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/site/Home.vue'),
        meta: { title: 'HOME'}
      },
      {
        path: '/info',
        name: 'Info',
        component: () => import('@/views/site/Info.vue'),
        meta: { title: 'INFO'}
      },
      {
        path: '/check',
        name: 'Check',
        component: () => import('@/views/site/Check.vue'),
        meta: { title: 'CHECK'},
        beforeEnter: (to, from) => {
          if (from === START_LOCATION) {
            return '/info'
          }
        },
      },
      {
        path: '/signup',
        name: 'SignUp',
        component: () => import('@/views/site/SignUp.vue'),
        meta: { title: 'SIGNUP'},
        beforeEnter: (to, from) => {
          if (from === START_LOCATION) {
            return '/info'
          }
        },
      },
      {
        path: '/list',
        name: 'List',
        component: () => import('@/views/site/List.vue'),
        meta: { title: 'LIST'}
      },
      {
        path: '/members/:userID',
        name: 'Detail',
        component: () => import('@/views/site/Detail.vue'),
        meta: { title: 'DETAIL'}
      },
    ],
  },
];

// 管理画面ルート
const adminRoutes = [
  {
    path: '/admin',
    component: () => import('@/layouts/admin/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '/admin', // 管理者,正会員,会員
        name: 'Admin',
        component: () => import('@/views/admin/Admin.vue'),
        meta: { title: 'DASHBOARD', index: 1 }
      },
      {
        path: '/admin/profile/:userID', // 管理者,正会員,会員
        component: () => import('@/views/admin/Profile.vue'),
        meta: { title: 'PROFILE', index: 2 }
      },
      {
        path: '/admin/portfolio-list/:userID', // 管理者,正会員  // 変更
        // path: '/admin/portfolio-list', // 管理者,正会員
        component: () => import('@/views/admin/PortfolioList.vue'),
        meta: { title: 'PORTFOLIO LIST', index: 3 }
      },
      {
        path: '/admin/portfolio/:userID/:portfolioID', // 管理者,正会員
        // path: '/admin/portfolio/:portfolioID', // 管理者,正会員
        component: () => import('@/views/admin/Edit.vue'),
        meta: { title: 'EDIT', index: 3 }
      },
      {
        path: '/admin/post', // 管理者,正会員
        component: () => import('@/views/admin/Post.vue'),
        meta: { title: 'POST', index: 3 },
        beforeEnter: (to, from, next) => {
          if (
            from.meta.title !== 'PORTFOLIO LIST'
          ) {
            next('/admin');
          } else {
            next();
          }
        },
      },
      // {
      //   path: '/admin/post', // 管理者,正会員
      //   component: () => import('@/views/admin/Post.vue'),
      //   meta: { title: 'POST', index: 3 }
      // },
      {
        path: '/admin/administrator/export-import', // 管理者
        component: () => import('@/views/admin/administrator/ExportImport.vue'),
        meta: { title: 'EXPORT IMPORT', index: 3 }
      },
      {
        path: '/admin/administrator/member-list', // 管理者
        component: () => import('@/views/admin/administrator/MemberList.vue'),
        meta: { title: 'MEMBER LIST', index: 2 }
      },
      {
        path: '/admin/administrator/approval', // 管理者
        component: () => import('@/views/admin/administrator/Approval.vue'),
        meta: { title: 'APPROVAL', index: 4 }
      },
      {
        path: '/admin/post-v2',
        name: 'PostV2',
        component: () => import('@/views/admin/sample/PostV2.vue'),
        meta: { title: 'POST2'}
      },
      {
        path: '/admin/test',
        name: 'Test',
        component: () => import('@/views/admin/Test.vue'),
        meta: { title: 'TEST'}
      },
    ],
  },
];

// シンプルレイアウトルート
const loginRoutes = [
  {
    path: '/login',
    component: () => import('@/layouts/LoginLayout.vue'),
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/Login.vue'),
        meta: { title: 'LOGIN'}
      },
      {
        path: '/password-request',
        name: 'Reissue',
        component: () => import('@/views/login/Reissue.vue'),
        meta: { title: 'Reissue'}
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [...siteRoutes, ...adminRoutes, ...loginRoutes],
});


// beforeEach ガードで認証状態を確認し、アクセス権を制御する
router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser(); // ログイン中のユーザーを取得
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth); // メタ情報から認証が必要かを取得

  if (requiresAuth && !user) {
    // 認証が必要なページに未ログインの場合、ログインページにリダイレクト
    next('/login');
  } else if (requiresAuth) {
    try {
      // ログイン済みのユーザーのFirestoreから権限情報を取得
      const userData = await getOneLevelSingleData(user.uid, 'members');
      const userRole = userData.role;

      if (to.path.startsWith('/admin/administrator/') && userRole !== role.administrator) {
        // 管理者向けのページにアクセス権がない場合、リダイレクトまたはエラーメッセージを表示
        next('/admin');
      } else if (userRole === role.member) {
        // 会員向けのページ制御
        const restrictedPages = ['/admin/portfolio-list', '/admin/portfolio', '/admin/post'];
        if (restrictedPages.includes(to.path)) {
          // 会員に制限されたページにアクセス権がない場合、リダイレクトまたはエラーメッセージを表示
          next('/admin');
        } else {
          // ページへのアクセスを許可
          next();
        }
      } else {
        // ページへのアクセスを許可
        next();
      }
    } catch (error) {
      console.error('ユーザー情報の取得エラー', error);
      // エラーが発生した場合、リダイレクトまたはエラーメッセージを表示
      next('/error');
    }
  } else {
    // ページへのアクセスを許可
    next();
  }
});



// afterEach フックでタイトルを設定
router.afterEach((to) => {
  const title = to.meta.title || 'Default Title'; // デフォルトのタイトルを指定
  document.title = title;
});

export default router;



