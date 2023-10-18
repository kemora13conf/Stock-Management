import React, { useEffect, useRef } from 'react'

function Loading({ loading }) {
  return (
    // square loading animation
    <div className={`
            pointer-events-none fixed z-[100] left-0 w-screen h-screen flex items-center justify-center 
            bg-light-secondary-500 dark:bg-dark-primary-500 transition-all duration-500 
            ${loading ? 'opacity-0 ' : 'flex top-0'}
          `}>
        <div className="
              relative w-[60px] h-[60px] border-4 border-rose-600 
              rounded-full animate flex justify-center items-center animate-spin
            ">
            <div className="
                    absolute w-[65px] h-[65px] border-8 border-transparent rounded-full
                    border-t-dark-primary-500  border-b-dark-primary-500 
                    dark:border-t-light-primary-500 dark:border-b-light-primary-500
                  "></div>
        </div>
    </div>
  )
}

export default Loading