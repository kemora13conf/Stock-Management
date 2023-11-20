import { AnimatePresence } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import Fetch from "../../../utils";
import Menu from "./Menu";
import { AppContext } from "../../../../App";

function Notifcations() {
    const { socket } = useContext(AppContext);
  const [opened, setOpened] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    socket.on("notification", (data) => {
        setUnread((prv) => prv + 1);
    });
    Fetch(import.meta.env.VITE_API + "/notifications/unread", "GET").then(
      (res) => {
        if (res.type == "success") setUnread(res.data.length);
      }
    );
  }, []);
  return (
    <div className="relative">
      <div
        onClick={() => setOpened(!opened)}
        className={`
                flex items-center justify-center gap-1 transition-all duration-300 cursor-pointer
                hover:bg-light-secondary-300 dark:bg-dark-primary-500
                text-light-quarternary-500 dark:text-dark-quarternary-500
                max-w-[40px] w-[40px] h-[40px]
                rounded-full shadow-light dark:shadow-dark
                relative
                hover:dark:bg-dark-primary-700
            `}
      >
        <AnimatePresence>
          {unread > 0 && (
            <div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3 }}
              exit={{ y: -20 }}
              key={"notifcations"}
              className={`
                    absolute -top-[7px] -left-[7px]
                    w-[18px] h-[18px] flex justify-center items-center 
                    text-light-primary-500
                    bg-red-500 rounded-full text-xs font-semibold
                    box-content border-[4px] border-light-primary-500 dark:border-dark-primary-800
                    transition-all duration-300
                `}
            >
              {unread}
            </div>
          )}
        </AnimatePresence>
        <i className="fas fa-bell"></i>
      </div>
      <AnimatePresence>
        {opened && <Menu opened={opened} setOpened={setOpened} unread={unread} setUnread={setUnread} />}
      </AnimatePresence>
    </div>
  );
}

export default Notifcations;
