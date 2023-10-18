import React from 'react'

function Option({ value, onClick, className, children }) {
  return (
    <div 
        onClick={() => onClick(value)}
        className={className}>
        {children}
    </div>
  )
}

export default Option