import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./Components/Global/Protected";
import Locked from "./Components/Global/LockedRoute";
import NavigationBar from "./Components/Global/Base";
import Login from "./Components/Auth/Login";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Components/Home/Home";
import Parts from "./Components/Parts/Parts";
import "./ScrollBarStyles/scrollbar.css";
import Fetch from "./Components/utils";
import ConfirmAlert from "./Components/Global/Popups/ConfirmAlert";
import { io } from "socket.io-client";

console.log(import.meta.env.VITE_SOCKET)
const AppContext = createContext();
const AppProvider = ({ currentUser, setCurrentUser, socket, children }) => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isAuth, setIsAuth] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [reqFinished, setReqFinished] = useState(false);
  const [theme, setTheme] = useState("light");

  

  // state for the confirm popup
  const [confirm, setConfirm] = useState(undefined);
  const ref = useRef();

  const stateStore = {
    activeTab,
    setActiveTab,
    isAuth,
    setIsAuth,
    currentUser,
    setCurrentUser,
    loaded,
    setLoaded,
    reqFinished,
    setReqFinished,
    theme,
    setTheme,
    confirm,
    setConfirm,
    socket: socket,
  };

  async function checkAuth() {
    setReqFinished((prv) => false);
    await fetch(`${import.meta.env.VITE_API}/auth/verify-token`, {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.type == "success") {
          setCurrentUser(res.data.current_user);
          setTheme(res.data.current_user.theme);
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setIsAuth(false);
      });
    setReqFinished((prv) => true);
  }

  useEffect(() => {
    checkAuth();
  }, [loaded]);

  useLayoutEffect(() => {
    if (theme == "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    ref.current.addEventListener("click", (e) => {
      if (e.target === ref.current) {
        setConfirm(undefined);
        console.log("click");
      }
    });
  }, []);
  return (
    <AppContext.Provider value={stateStore}>
      <div
        ref={ref}
        className={`
              flex justify-center items-center 
              ${
                confirm != undefined
                  ? "bg-light-primary-500 bg-opacity-20 backdrop-blur-md"
                  : "bg-transparent pointer-events-none"
              } 
              fixed z-[3000] w-full min-h-screen top-0 left-0
              transition-all duration-300
          `}
      >
        <AnimatePresence mode="wait">
          {confirm != undefined && <ConfirmAlert confirm={confirm} />}
        </AnimatePresence>
      </div>
      {children}
    </AppContext.Provider>
  );
};

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const socket = io(import.meta.env.VITE_SOCKET);
    
  socket.on("connect", () => {
    console.log("connected");
  });

  return (
    <AppProvider {...{ currentUser, setCurrentUser, socket }}>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <ToastContainer />
          <Routes>
            <Route path="/*">
              <Route element={<ProtectedRoute />}>
                <Route element={<NavigationBar />}>
                  <Route index element={<Home />} />
                  <Route path="parts/*">
                    <Route index element={<Parts />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/" />} />
                </Route>
              </Route>
              <Route element={<Locked />}>
                <Route path="login" element={<Login />} />
              </Route>
            </Route>
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
export { AppContext };
