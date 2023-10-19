import React, { useContext } from "react";
import { AppContext } from "../../App";

function AdminCard() {
  const { currentUser } = useContext(AppContext);
  return (
    <div
      className="
          w-full rounded-lg overflow-hidden
          shadow-light dark:shadow-dark
          bg-light-primary-500 dark:bg-dark-primary-800
          @container/userCard 
        "
    >
      <div
        className="
            w-full px-5 py-3
            flex flex-col-reverse gap-3 
            @[450px]/userCard:flex-row
          "
      >
        <div className="w-full flex flex-col gap-2">
          <h1
            className="
                  text-xl flex flex-col
                  text-light-quarternary-400 dark:text-dark-quarternary-500
                "
          >
            Welcome
            <span
              className="text-2xl font-semibold 
                  text-light-quarternary-500 dark:text-dark-quarternary-500"
            >
              {currentUser.fullname}
            </span>
            <span className="text-sm">{currentUser.email}</span>
          </h1>
          <span
            className="
                    w-fit px-4 py-2
                    bg-light-secondary-400 dark:bg-dark-secondary-600
                    text-light-quarternary-500 dark:text-dark-tertiary-400
                    rounded-md mt-auto
                "
          >
            You are The Manager
          </span>
        </div>
        <div className="w-fit">
          <img
            className="
                    min-w-[150px] w-[150px] aspect-square rounded-full
                "
            src={
              import.meta.env.VITE_ASSETS + "/Users-images/" + currentUser.image
            }
            alt={currentUser.fullname}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminCard;
