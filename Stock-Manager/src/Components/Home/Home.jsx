import React, { useContext, useEffect } from "react";
import { AppContext } from "../../App";
import { motion } from "framer-motion";
import MyLink from "../Global/MyLink";

function Home() {
  const { reqFinished, setActiveTab, setLoaded } = useContext(AppContext);
  
  useEffect(() => {
    setLoaded(true);
    setActiveTab('Home');
  }, [reqFinished]);
  
  // well lookin modern design for a dashboard home page with a nice animation on the cards and a nice background color
  return (
    <motion.div
      initial={{ opacity: 0.4, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0.4, y: -50 }}
      key={'home'} 
      className="flex flex-col w-full h-full"
    >
    </motion.div>
  );
}

export default Home;
