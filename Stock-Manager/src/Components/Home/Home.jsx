import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { AnimatePresence, motion } from "framer-motion";
import MyLink from "../Global/MyLink";
import AdminCard from "./AdminCard";
import Fetch from "../utils";
import OutOfStockAlert from "./OutOfSStockAlert";

function Home() {
  const { reqFinished, setActiveTab, setLoaded } = useContext(AppContext);
  const [ outOfStock, setOutOfStock ] = useState([]);
  const today = new Date();
  let weekday = { weekday: 'long' };
  let month = { month: 'long' };
  let day = { day: 'numeric' };
  let year = { year: 'numeric' };
  weekday = today.toLocaleDateString(undefined, weekday);
  month = today.toLocaleDateString(undefined, month);
  day = today.toLocaleDateString(undefined, day);
  year = today.toLocaleDateString(undefined, year);
  const formattedDate = `${weekday}, ${month} ${day}, ${year}`;

  const fetchOutOfStock = () => {
    Fetch(
      `${import.meta.env.VITE_API}/car-parts/out-of-stock`,
      "GET"
    ).then((res) => {
      if(res.type === 'success'){
        setOutOfStock(res.data);
      }
    });
  }

  useEffect(() => {
    setLoaded(true);
    setActiveTab('Home');
    fetchOutOfStock();
  }, [reqFinished]);
  
  // well lookin modern design for a dashboard home page with a nice animation on the cards and a nice background color
  return (
    <motion.div
      initial={{ opacity: 0.4, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0.4, y: -50 }}
      key={'home'} 
      className="
        flex flex-col justify-center items-center gap-4
        w-full
      "
    >
      <div className="w-full flex flex-col justify-center items-center">
        <h1 className="text-3xl font-semibold text-light-quarternary-500 dark:text-dark-quarternary-500">
          Stock Management System
        </h1>
        <p className="text-light-quarternary-400 dark:text-dark-tertiary-500 text-center">
          {/* TODAY DATE */}
          We Are {formattedDate}
        </p>
      </div>
      <div className="w-full flex flex-col gap-3">
        <AnimatePresence>
        { 
          outOfStock && outOfStock.map((item, index)=> {
            return (
              <OutOfStockAlert 
                item={item}
                setOutOfStock={setOutOfStock}
                key={index}
              />
            )
          })
        }
        </AnimatePresence>
      </div>
      <AdminCard />
    </motion.div>
  );
}

export default Home;
