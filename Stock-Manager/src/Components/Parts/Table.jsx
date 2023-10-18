import React, { useContext } from "react";
import { AppContext } from "../../App";
import CheckBox from "../Global/CheckBox/CheckBox";
import { AnimatePresence, motion } from "framer-motion";
import { Toggle } from "../Global/ToggleBtn/Toggle";
import MyLink from "../Global/MyLink";
import Fetch from "../utils";
import { toast } from "react-toastify";

function Table(props) {
  const {
    data,
    setData,
    checkedItems,
    setCheckedItems,
    checkAll,
    setCheckAll,
    setOpenedId,
    setIsFormOpen,
  } = props;
  const { setReqFinished, theme, setConfirm } = useContext(AppContext);

  const changeState = (state, id) => {
    Fetch(
      import.meta.env.VITE_API + "/categories/change-state/" + id,
      "PUT",
      JSON.stringify({ state }),
      { "Content-Type": "application/json" }
    ).then((res) => {
      // toast
      if(res.type === 'success'){
        toast.success(res.message, {
          theme: theme,
        });
      }else{
        toast.error(res.message, {
          theme: theme,
        });
        return;
      }
      setData((prv) => {
        return prv.map((carPart) => {
          if (carPart._id === id) {
            return {
              ...carPart,
              enabled: res.data.enabled,
            };
          }
          return carPart;
        });
      });
    });
  };

  const editItem = (id) => {
    setOpenedId(id);
    setIsFormOpen(true);

  };

  const deleteItem = async (id) => {
    setConfirm({
      title: "Are you sure you want to delete these items?",
      message: "This action is irreversible",
      confirmText: "Yes, delete it",
      cancelText: "No, keep it",
      confirm: (close) => {
        Fetch(import.meta.env.VITE_API + "/car-parts/" + id, "DELETE").then(
          (res) => {
            if (res.type === "success") {
              setData((prv) => {
                return prv.filter((carPart) => carPart._id !== id);
              });
              setReqFinished(false);
              toast.success(res.message, {
                theme: theme,
              });
            } else {
              toast.error(res.message, {
                theme: theme,
              });
            }
            close();
          }
        );
      }
    });

  };
  return (
    <div className="w-full overflow-y-visible overflow-x-auto gap-3">
      <table className="w-full">
        <thead>
          <tr
            className="
              text-sm font-semibold text-light-quarternary-500 dark:text-dark-quarternary-500
              bg-light-secondary-500 dark:bg-dark-primary-700 rounded-lg overflow-hidden
              shadow 
            "
          >
            <th className="px-4 py-5 text-left flex gap-3">
              <CheckBox
                {...{
                  id: "checkAll",
                  setCheckAll,
                }}
              />
              Image
            </th>
            <th className="px-4 py-5 text-left">Name</th>
            <th className="px-4 py-5 text-left">Description</th>
            <th className="px-4 py-5 text-left">Manufacturer</th>
            <th className="px-4 py-5 text-left">Price</th>
            <th className="px-4 py-5 text-left whitespace-nowrap">Stock Quantity</th>
            <th className="px-4 py-5 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm font-medium text-gray-700">
          <AnimatePresence>
            { data.length > 0
              ? data.map((carPart, index) => {
                  return (
                    <motion.tr
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      exit={{ opacity: 0, y: -20 }}
                      key={index}
                      className="
                              border-b border-light-secondary-300 dark:border-light-secondary-800 
                              bg-light-secondary-100 dark:bg-dark-primary-600
                              transition-all duration-300
                              hover:bg-light-secondary-200 dark:hover:bg-dark-primary-500
                              text-light-quarternary-500 dark:text-dark-quarternary-600
                            "
                    >
                      <td className="px-4 py-3">
                        <div className="flex gap-4 justify-start items-center">
                          <CheckBox
                            {...{
                              id: carPart._id,
                              checkAll,
                              checkedItems,
                              setCheckedItems,
                            }}
                          />
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-light-primary-500 dark:bg-dark-primary-500">
                            {
                              carPart.gallery.length > 0
                              ? <img
                                  className="w-full h-full object-cover rounded-full"
                                  src={`${import.meta.env.VITE_ASSETS}/Images/${carPart.gallery[0].name}`} 
                                  alt=""
                                />
                              : "-"
                            }
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="line-clamp-1">{carPart.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="line-clamp-1">{carPart.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="line-clamp-1">{carPart.manufacturer}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="line-clamp-1">{carPart.price}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="line-clamp-1">{carPart.stock_quantity}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-fit h-auto flex gap-4 items-center px-4 py-2  rounded-lg">
                          <Toggle
                            toggled={carPart.enabled}
                            onClick={(state) => changeState(state, carPart._id)}
                          />
                          <button
                            onClick={() => { editItem(carPart._id) }}
                            className="
                              shadow w-8 h-8 
                              flex justify-center items-center rounded-full 
                              bg-light-primary-500 dark:bg-dark-secondary-700 
                              text-light-quarternary-500 dark:text-light-secondary-600
                              transition-all duration-300
                              hover:bg-info hover:text-light-secondary-200
                              dark:hover:bg-info dark:hover:text-light-secondary-200"
                          >
                            <i className="fas fa-pen"></i>
                          </button>
                          <button
                            onClick={() => {
                              deleteItem(carPart._id);
                            }}
                            className="
                              shadow w-8 h-8 
                              flex justify-center items-center rounded-full 
                              bg-light-primary-500 dark:bg-dark-secondary-700 
                              text-light-quarternary-500 dark:text-light-secondary-600
                              transition-all duration-300
                              hover:bg-error hover:text-light-secondary-200
                              dark:hover:bg-error dark:hover:text-light-secondary-200"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              : <tr 
                  className="
                     bg-light-secondary-100 dark:bg-dark-primary-600
                      text-light-quarternary-500 dark:text-dark-quarternary-600
                  ">
                  <td colSpan={7}>
                    <div className="w-full px-3 py-4 text-center text-lg text-light-quarternary-500 dark:text-dark-quarternary-500">
                      No car parts found
                    </div>
                  </td>
                </tr>
            }
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

export default Table;
