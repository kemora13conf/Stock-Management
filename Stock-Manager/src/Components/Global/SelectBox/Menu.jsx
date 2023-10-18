import React from "react";
import { motion } from "framer-motion";

function Menu(props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={
        props.className 
        ? props.className
        : ` flex flex-col gap-2 py-2 px-2 
            absolute top-[calc(100%+10px)] right-0 z-index-[2000]
            bg-light-primary-500 dark:bg-dark-primary-500 rounded-xl shadow-lg dark:shadow-dark
            w-full min-w-[170px] h-auto`
      }
    >
        {props.children}
    </motion.div>
  );
}

export default Menu;
