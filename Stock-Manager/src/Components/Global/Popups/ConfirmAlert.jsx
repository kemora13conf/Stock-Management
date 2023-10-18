import React, { useContext } from 'react'
import { motion } from 'framer-motion';
import { AppContext } from '../../../App';

function ConfirmAlert(props) {
  const { setConfirm } = useContext(AppContext)
  const { title, message, cancelText, confirmText, confirm } = props.confirm
  const onCancel = () => {
    setConfirm(undefined)
  }
  const close = (e) => {
    if(e.target === e.currentTarget){
      onCancel()
    }
  }
  return (
    <motion.div 
      initial={{opacity: 0, y: -100}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: .3}}
      exit={{opacity: 0, y: -100}}
      key={title}
      onClick={close}
      className="
        fixed inset-0 flex items-center justify-center z-50 
      ">
      <div className="
            bg-light-primary-500 dark:bg-dark-primary-700 
            rounded-xl shadow-light dark:shadow-dark 
            flex flex-col py-2 max-w-[320px]
        ">
        <div className="w-full px-5 py-3 gap-2 flex flex-col">
          <h2 className="
                text-xl font-bold text-light-tertiary-800
                dark:text-dark-tertiary-200
              ">{title}</h2>
          <p className="
                text-light-secondary-700 text-sm px-2
              ">{message}</p>
        </div>
        <div className="w-full flex gap-3 py-2 px-4 justify-end transition-all duration-300">
          <motion.button 
            onClick={onCancel}
            className="
              px-4 py-2 rounded-md text-sm text-light-quarternary-300 dark:text-dark-secondary-500
              transition-all duration-300
              hover:bg-light-secondary-500 dark:hover:bg-dark-primary-600
              hover:text-light-quarternary-500 dark:hover:text-dark-secondary-500
              focus:scale-90
            ">{cancelText}</motion.button>
          <button 
            onClick={
                ()=>confirm(
                  () => setConfirm(undefined)
                )
            }
            className="
              px-4 py-2 rounded-md 
              bg-light-secondary-500 dark:bg-dark-primary-600
              text-sm text-light-quarternary-500 dark:text-dark-quarternary-500
              transition-all duration-300
              hover:bg-light-quarternary-600 dark:hover:bg-dark-primary-800
              hover:text-light-primary-500
              dark:shadow-light
            ">{confirmText}</button>
        </div>
      </div>
    </motion.div>
  )
}

export default ConfirmAlert