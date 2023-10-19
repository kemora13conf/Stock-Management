import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AppContext } from "../../App";
import Loading from "./Loading";
import Header from "./Header/Header";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
const Base = () => {
  const { loaded } = useContext(AppContext);
  return (
    <>
      <Loading loading={loaded} />
      <motion.div
        initial={{ opacity: 0.4, x: 100}}
        animate={{ opacity: 1, x: 0 }}
        transition={{duration: .5}}
        exit={{ opacity: 0.4, x: 100 }}
        key={"base"} 
        className="flex w-full md:w-[calc(100%-270px)] md:ml-[270px] justify-center mt-[64px] min-h-[calc(100vh-64px)] p-2 overflow-hidden">
        <Header />
        <div className="w-full max-w-[1640px] p-2">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default Base;
