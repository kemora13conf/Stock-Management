import React from "react";
import { motion } from "framer-motion";

function OutOfStockAlert(props) {
  const handleRemove = () => {
    props.setOutOfStock((prev) => {
      return prev.filter((item) => item._id != props.item._id);
    });
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      key={props.item._id}
      exit={{ opacity: 0, y: 20 }}
      className="
            w-full px-3 py-2 rounded-md
            flex justify-between gap-3 items-center
            bg-warning bg-opacity-60
            text-light-quarternary-500 dark:text-dark-quarternary-500
            shadow-light dark:shadow-dark
        "
    >
      <img
        className="w-[40px] h-[40px] rounded-full object-cover object-center"
        src={
          import.meta.env.VITE_ASSETS + "/Images/" + props.item.gallery[0].name
        }
        alt=""
      />
      {props.item.name} is out of stock!
      <span
        onClick={handleRemove}
        className="
                cursor-pointer ml-auto
            "
      >
        <i className="fas fa-close"></i>
      </span>
    </motion.div>
  );
}

export default OutOfStockAlert;
