import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import LoginSignUp from './pages/LoginSignUp.jsx'
import Home from './pages/Home.jsx'
import { GlobalProvider } from './context/GlobalContext.jsx'
import Profile from './pages/Profile.jsx'
import MyAccount from './pages/MyAccount.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.jsx'

// ✅ Correct Toastify import
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ProtectedRoute } from './components/protectedRoute/ProtectedRoute.jsx'
import { ValidateUser } from './components/protectedRoute/ValidateUser.jsx'
import AuthLoader from './components/protectedRoute/AuthLoader.jsx'
import { SocketProvider } from './context/SocketProvider.jsx'

const route = createBrowserRouter([
  { path: "/", element: <ValidateUser><LoginSignUp /> </ValidateUser>},
  { 
    path: "/home", 
    element: <AuthLoader><Home /></AuthLoader> 
  },
  { 
    path: "/profile", 
    element: <AuthLoader><Profile /></AuthLoader> 
  },
  { 
    path: "/myaccount", 
    element: <AuthLoader><MyAccount /></AuthLoader> 
  },
  {
    path:"*",
    element:<h1>Invalid Page</h1>
  }
])

createRoot(document.getElementById('root')).render(
 
    <Provider store={store}>
       
    <GlobalProvider>
         <SocketProvider>
         <RouterProvider router={route} />
        </SocketProvider>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </GlobalProvider>
  </Provider>
)


