import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../App";
import Fetch from "../utils";
import Header from "./Header";
import Table from "./Table";
import SearchForm from "./SearchForm";
import Footer from "./Footer";
import { AnimatePresence, motion } from "framer-motion";
import Form from "./Form";
import SelectBox from "../Global/SelectBox/SelectBox";
import Menu from "../Global/SelectBox/Menu";
import Option from "../Global/SelectBox/Option";

function Parts() {
  const {
    setActiveTab,
    setLoaded,
    reqFinished,
    setReqFinished,
  } = useContext(AppContext); // global context api

  const [data, setData] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [reload, setReload] = useState(false);

  // edit and creation form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openedId, setOpenedId] = useState(null);

  // Search
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState('All');

  // Order
  const [orderBy, setOrderBy] = useState('Name');

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // form ref
  const formRef = useRef();

  useEffect(() => {
    setActiveTab('parts');
    setLoaded(true);
  }, [reqFinished]);

  useEffect(() => {
    setLoading(true);
    Fetch(
      `${
        import.meta.env.VITE_API
      }/car-parts?search=${search}&searchby=${searchBy}&orderby=${orderBy}&page=${currentPage}&limit=${itemsPerPage}`,
      "GET"
    ).then((res) => {
      setData(res.data.carParts);
      setTotalItems(res.data.total);
      setTotalPages(res.data.pages);
      setReqFinished(true);
      setLoading(false);
    });
  }, [currentPage, itemsPerPage, search, orderBy, reload]);

  useEffect(() => {
    if (formRef.current) {
      function formRefClickHandler(e) {
        if (e.target === formRef.current) {
          setIsFormOpen(false);
        }
      }
      formRef.current.addEventListener("click", formRefClickHandler);
      return () => {
        if (formRef.current) {
          formRef.current.removeEventListener("click", formRefClickHandler);
        }
      };
    }
  }, [openedId, isFormOpen]);
  return (
    <motion.div
      initial={{ opacity: 0.4, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0.4, y: -50 }}
      key={'parts'}
    >
      <div 
        className="
          bg-light-primary-500 dark:bg-dark-primary-500 
          rounded-md shadow 
          flex flex-col
        "
      >
        <Header
          {...{
            checkedItems,
            setCheckedItems,
            setIsFormOpen,
            setOpenedId,
            setReload,
          }}
        />
        <div className="w-full mx-auto">
          <div className="w-full @container/tableFilters">
            <div 
              className="
                flex p-3 gap-3 items-center justify-center flex-col 
                @[400px]/tableFilters:flex-row
              "
            >
              <div 
                className="
                  flex gap-2 justify-between items-center
                  max-w-fit w-full @[400px]/tableFilters:w-fit h-fit 
                  p-0 pl-2  
                  border border-light-secondary-500 dark:border-dark-secondary-600 rounded-md
                  text-light-quarternary-500 dark:text-dark-quarternary-500 text-sm
                  bg-light-secondary-500 dark:bg-dark-secondary-600
                "
              >
                <p className="whitespace-nowrap">
                  order by
                </p>

                <SelectBox
                    {...{
                        selected: orderBy,
                        setSelected: setOrderBy,
                        className: "max-w-fit !rounded-md text-sm",
                    }}
                >
                  <Menu
                      className={
                          ` flex flex-col gap-2 py-2 px-2 
                          absolute top-[calc(100%+10px)] right-0 md:left-0 z-index-[2000]
                          bg-light-primary-500 dark:bg-dark-primary-500 rounded-md shadow-lg dark:shadow-dark
                          w-full min-w-fit h-auto 
                          border border-light-secondary-500 dark:border-dark-secondary-600`
                      }
                  >
                    <Option value={ 'Name' }>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-md">
                            <h1 className="text-light-quarternary-500 dark:text-dark-quarternary-500 text-sm">
                            Name
                            </h1>
                        </div>
                    </Option>   
                    <Option value={ 'Description' }>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-md">
                            <h1 className="text-light-quarternary-500 dark:text-dark-quarternary-500 text-sm">
                            Description
                            </h1>
                        </div>
                    </Option>
                    <Option value={ 'Manufacturer' }>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-md">
                            <h1 className="text-light-quarternary-500 dark:text-dark-quarternary-500 text-sm">
                            Manufacturer
                            </h1>
                        </div>
                    </Option>
                    <Option value={ 'Price' }>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-md">
                            <h1 className="text-light-quarternary-500 dark:text-dark-quarternary-500 text-sm">
                            Price
                            </h1>
                        </div>
                    </Option>
                    <Option value={ 'Stock_Quantity' }>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-md">
                            <h1 className="text-light-quarternary-500 dark:text-dark-quarternary-500 text-sm">
                            Stock Quantity
                            </h1>
                        </div>
                    </Option>
                  </Menu>
                </SelectBox>
              </div>
              <SearchForm
                {...{
                  search,
                  setSearch,
                  searchBy,
                  setSearchBy,
                }}
              />
            </div>
          </div>
          <div className="w-full flex flex-col rounded-md dark:shadow-dark">
            <Table
              {...{
                data,
                setData,
                checkedItems,
                setCheckedItems,
                checkAll,
                setCheckAll,
                setOpenedId,
                setIsFormOpen,
              }}
            />
            <Footer
              {...{
                currentPage,
                setCurrentPage,
                itemsPerPage,
                setItemsPerPage,
                totalItems,
                setTotalItems,
                totalPages,
                setTotalPages,
                loading,
                setLoading,
              }}
            />
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {isFormOpen && (
          <div
            ref={formRef}
            className={`
                fixed top-0 left-0 z-[2000] w-full min-h-screen max-h-screen
                flex items-start justify-end overflow-hidden overflow-y-auto scroll-smooth
                ${
                  isFormOpen
                    ? "bg-light-quarternary-500 bg-opacity-20 backdrop-blur-[5px]"
                    : "bg-transparent"
                }
              `}
          >
            <Form
              id={openedId}
              setReload={setReload}
              setIsFormOpen={setIsFormOpen}
              setOpenedId={setOpenedId}
            />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Parts;
