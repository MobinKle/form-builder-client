import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/auth/Login';
import AuthLayout from './layouts/AuthLayout';
import Signup from './pages/auth/Signup';
import RecoverPassword from './pages/auth/RecoverPassword';
// import SSOLogin from './pages/auth/SSOLogin';
import ResetPassword from './pages/auth/ResetPassword';
import RequireAuth from './components/auth/RequireAuth';
import CreateForm from './pages/CreateForm';
import BaseLayout from './layouts/BaseLayout';
import PersistLogin from './components/auth/PersistLogin';
import Error from './pages/Error';
import Settings from './pages/Settings';
import MyForms from './pages/MyForms';
import UpdateForm from './pages/UpdateForm';
import GeneratedForm from './pages/GeneratedForm';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      /* {
        path: '/sso/login',
        element: <SSOLogin />,
      }, */
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/recover-password',
        element: <RecoverPassword />,
      },
      {
        path: '/reset-password/:token',
        element: <ResetPassword />,
      },
      {
        path: '/demo',
        element: <CreateForm />,
      },
    ],
  },
  {
    element: <PersistLogin />,
    errorElement: <Error />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          {
            element: <BaseLayout />,
            children: [
              {
                path: '/',
                element: <CreateForm />,
              },
              {
                path: '/my-forms',
                element: <MyForms />,
              },
              {
                path: '/my-forms/:id/edit',
                element: <UpdateForm />,
              },
              {
                path: '/settings',
                element: <Settings />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'forms/:id',
    element: <GeneratedForm />,
    errorElement: <Error />,
  },
]);

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const currentDir = i18n.dir(); 
    document.documentElement.dir = currentDir;
    document.documentElement.lang = i18n.language;
    document.body.className = currentDir;
  }, [i18n.language, i18n]);

  return <RouterProvider router={router} />;
}
