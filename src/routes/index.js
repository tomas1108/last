import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

// layouts
import DashboardLayout from "../layouts/dashboard";
import MainLayout from "../layouts/main";
// config
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";
import Verify from "../pages/auth/Verify";


const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
  {
    path:"/auth",
    element:<MainLayout />,
    children: [
      {element: <LoginPage />, path:"login"},
      {element: <RegisterPage />, path:"register"},
      {element: <ResetPasswordPage />, path:"reset-password"},
      {element: <NewPasswordPage />, path:"new-password"},
      {element: <OTPPage />, path:"otp"},
      {element: <VerifyPage />, path:"verify"},
    ]
  },
 
    {
      path: "/",
      element: <DashboardLayout layout=""/>,
      children: [
        { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
        { path: "app", element: <GeneralApp /> },
        { path: "settings", element: <SettingPage /> },
        { path: "group", element: <GroupPage /> },
        { path: "call", element: <CallPage /> },
        { path: "profile", element: <ProfilePage /> },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

const GeneralApp = Loadable(
  lazy(() => import("../pages/dashboard/GeneralApp")),
);

const GroupPage  = Loadable (
  lazy (() => import("../pages/dashboard/GeneralGroup"))
);

const CallPage  = Loadable (
  lazy (() => import("../pages/dashboard/Call"))
);

const ProfilePage  = Loadable (
  lazy (() => import("../pages/dashboard/Settings/Profile"))
);


const SettingPage = Loadable(
  lazy(() => import("../pages/dashboard/Settings")),
);

const LoginPage  = Loadable (
  lazy (() => import("../pages/auth/Login"))
);

const ResetPasswordPage  = Loadable (
  lazy (() => import("../pages/auth/ResetPassword"))
);

const NewPasswordPage  = Loadable (
  lazy (() => import("../pages/auth/NewPassword"))
);


const RegisterPage  = Loadable (
  lazy (() => import("../pages/auth/Register"))
);


const OTPPage  = Loadable (
  lazy (() => import("../pages/auth/OTP"))
);

const VerifyPage  = Loadable (
  lazy (() => import("../pages/auth/Verify"))
);



const Page404 = Loadable(
  lazy(() => import("../pages/Page404"))
);
