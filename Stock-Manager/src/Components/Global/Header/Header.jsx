import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../../App";
import Sidebar from "./Sidebar";
import useMeasure from "react-use-measure";
import "./header.css";
import { AnimatePresence, motion } from "framer-motion";
import Fetch from "../../utils";
import { toast } from "react-toastify";
import Notifcations from "./Notifcations/Notifcations";

function Header() {
  const { currentUser, loaded, theme, setTheme } = useContext(AppContext);
  const [openedSidebar, setOpenedSidebar] = useState(false);
  const [ref, bounds] = useMeasure();

  const toggleTheme = ()=>{
    let new_theme = theme == 'dark' ? 'light' : 'dark';
    setTheme(new_theme)
    Fetch(
      import.meta.env.VITE_API+'/users/'+ currentUser._id +'/update-theme',
      'PUT',
      JSON.stringify({theme: new_theme}),
      {'Content-Type':'application/json'}
    ).then(res => {
      if(res.type == 'success')
        setTheme(res.data)
      else
        toast.error(res.message, {theme: theme})
    })
  }

  useEffect(() => {
    setOpenedSidebar(false);
  }, [loaded]);
  return (
    <>
      <div
        ref={ref}
        className={`
          flex justify-between items-center 
          fixed z-[51] top-0 left-0 w-full 
          before:content-[''] before:absolute 
          before:top-[64px] ${
            bounds.width < 767
            ? openedSidebar ? "before:left-[270px] " : "before:-left-full"
            : "before:left-[270px]"
          }
          before:w-[50px] before:h-[50px] before:z-[1000] 
          before:bg-transparent before:rounded-xl 
          before:shadow-runded-corner-light before:dark:shadow-runded-corner-dark
          before:transition-all before:duration-300
          py-3 px-4 md:px-5 
          transition-all duration-300 reveal
          ${
            bounds.width < 767
            ? openedSidebar ? "shadow-scaled" : "shadow"
            : "shadow-scaled"

          }
        `}
      >
        <div className="flex items-center gap-4 pl-2">
          <div
            onClick={() => {
              setOpenedSidebar((prv) => !prv);
            }}
            className={`flex md:hidden nav-btn ${
              openedSidebar ? "active" : ""
            }`}
          >
            <span></span>
          </div>
          <h1 
            className="
              ml-2 text-xl font-semibold
              md:text-2xl
              text-light-quarternary-500 dark:text-dark-quarternary-500
            "
          >
            {
              bounds.width<450
              ? 'SM'
              : 'Stock Manager'
            }
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Notifcations />
          <div
            onClick={toggleTheme}
            className={`
              flex items-center justify-center gap-1 transition-all duration-300 cursor-pointer
              hover:bg-light-secondary-400 dark:bg-dark-primary-500
              text-light-quarternary-500 dark:text-dark-quarternary-500
              max-w-[40px] w-[40px] h-[40px]
              rounded-full shadow-light dark:shadow-dark
              overflow-hidden
            `}
          >
            <AnimatePresence mode="wait">
              {
                theme == 'dark'
                ? <motion.i
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                    exit={{ y: -20 }}
                    key={'dark-mode'}
                    className="fas fa-sun"
                  ></motion.i>
                : <motion.i
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                    exit={{ y: -20 }}
                    key={'light-mode'}
                    className="fas fa-moon"
                  ></motion.i>
              }
            </AnimatePresence>
          </div>
          <div
            className={`flex items-center justify-center w-fit h-fit pr-1 gap-1 transition-all duration-300 cursor-pointer`}>
            <img
              src={`${import.meta.env.VITE_ASSETS}/Users-images/${
                currentUser.image
              }`}
              className="max-w-[40px] w-[40px] h-[40px] object-cover object-center rounded-full shadow-lg"
            />
          </div>
        </div>
      </div>
      <Sidebar
        openedSidebar={openedSidebar}
        setOpenedSidebar={setOpenedSidebar}
        width={bounds.width}
      />
    </>
  );
}

export default Header;
