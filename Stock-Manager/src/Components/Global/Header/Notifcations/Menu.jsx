import React, { useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Fetch from "../../../utils";
import { AppContext } from "../../../../App";

function Menu({ opened, setOpened, unread, setUnread }) {
  const { socket } = useContext(AppContext);
  const menuRef = useRef(null);
  const [notificaions, setNotificaions] = useState([]);

  const readNotification = () => {
    if (notificaions.length > 0) {
      const ids = notificaions
        .filter((notification) => notification.isRead != true)
        .map((notification) => notification._id);
      Fetch(
        import.meta.env.VITE_API + "/notifications/read",
        "PUT",
        JSON.stringify({ ids: ids }),
        { "Content-Type": "application/json" }
      ).then((res) => {
        if (res.type == "success") {
          setUnread((prv) => prv - ids.length);
          setNotificaions((prev) =>
            prev.map((notification) => {
              if (ids.includes(notification._id)) notification.isRead = true;
              return notification;
            })
          );
        }
      });
    }
  };
  const deleteAll = () => {
    Fetch(import.meta.env.VITE_API + "/notifications/all", "DELETE").then(
      (res) => {
        if (res.type == "success") {
          setNotificaions([]);
          setUnread(0);
        }
      }
    );
  };
  useEffect(() => {
    socket.on("notification", (notification) => {
        Fetch(import.meta.env.VITE_API + "/notifications", "GET").then((res) => {
            if (res.type == "success") setNotificaions(res.data.notifications);
          });
    });

    Fetch(import.meta.env.VITE_API + "/notifications", "GET").then((res) => {
      if (res.type == "success") setNotificaions(res.data.notifications);
    });

    menuRef.current.addEventListener("click", (e) => {
      if (e.target == menuRef.current) setOpened(false);
    });
  }, []);
  return (
    <div ref={menuRef} className="w-full min-h-screen fixed left-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        key={"notifcations-menu"}
        className="
                min-w-[250px] w-[300px] max-w-[300px] fixed top-[70px] right-[120px]
                bg-light-primary-500 dark:bg-dark-primary-800 
                rounded-xl shadow-light dark:shadow-dark overflow-hidden overflow-y-auto
            "
      >
        <div className="flex justify-between items-center mb-1 p-4">
          <h1 className="text-xl font-semibold text-light-quarternary-500 dark:text-dark-quarternary-500">
            Notifcations
          </h1>
          {/* read all button */}
          <button
            onClick={readNotification}
            className="
                        flex items-center justify-center gap-1 text-sm
                        text-light-quarternary-500 dark:text-dark-quarternary-700
                        hover:text-light-quarternary-400 dark:hover:text-dark-quarternary-400
                        transition-all duration-300
                    "
          >
            <i className="fas fa-check text-xs"></i>
            <span>Read all</span>
          </button>
        </div>
        {notificaions.length > 0 ? (
          <>
            <div className="flex items-center justify-end px-4 pb-4 -mt-4">
              {/* delete all button */}
              <button
                onClick={deleteAll}
                className="
                    flex items-center justify-center gap-1 text-sm
                    text-light-quarternary-500 dark:text-dark-quarternary-700
                    hover:text-light-quarternary-400 dark:hover:text-dark-quarternary-400
                    transition-all duration-300
                "
              >
                <i className="fas fa-trash text-xs"></i>
                <span>Delete all</span>
              </button>
            </div>
            <div
              className="flex flex-col gap-0 overflow-hidden overflow-y-auto
                max-h-[250px]"
            >
              <AnimatePresence>
                {notificaions?.map((notification) => (
                  <motion.div
                    key={notification._id}
                    className={`
                                ${
                                  !notification.isRead
                                    ? "bg-light-secondary-200 dark:bg-dark-primary-700"
                                    : ""
                                }
                            `}
                  >
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ ease: "linear", duration: 0.2 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="oveflow-hidden flex items-start gap-2 p-3"
                    >
                      <div className="flex justify-center items-center min-w-[40px] min-h-[40px] max-h-[40px] rounded-full bg-light-secondary-500 dark:bg-dark-primary-500">
                        <i
                          className={`
                                            ${
                                              notification.title == "Warning"
                                                ? "fas fa-triangle-exclamation"
                                                : "fas fa-bell"
                                            } 
                                            text-light-quarternary-500 dark:text-dark-quarternary-500
                                        `}
                        ></i>
                      </div>
                      <div className="flex flex-col">
                        <h1 className="text font-semibold text-light-quarternary-500 dark:text-dark-quarternary-500">
                          {notification.title}
                        </h1>
                        <p className="text-sm text-light-quarternary-500 dark:text-dark-quarternary-600">
                          {notification.message}.
                        </p>
                        <span className="text-xs text-light-quarternary-300 dark:text-dark-quarternary-800">
                          {new Date(notification.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-4">
            <h1 className="text-lg font-semibold text-light-quarternary-500 dark:text-dark-quarternary-500">
              No notifcations
            </h1>
            <p className="text-sm text-light-quarternary-300 dark:text-dark-quarternary-600">
              You have no notifcations
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Menu;
