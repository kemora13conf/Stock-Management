import React, { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppContext } from '../../App';
import Loading from './Loading';
import Header from './Header/Header';
import { AnimatePresence } from 'framer-motion';
const Base = () => {
  const { loaded } = useContext (AppContext);
  return (
    <>
      <Loading loading={loaded} />
      <div className="flex w-full md:w-[calc(100%-270px)] md:ml-[270px] justify-center mt-[64px] min-h-screen p-2 overflow-hidden">
        <Header />
        <div className="w-full max-w-[1640px] p-2">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default Base