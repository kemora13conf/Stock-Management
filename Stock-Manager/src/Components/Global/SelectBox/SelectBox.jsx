import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

// highly customizable select box component
const SelectBox = (props) => {
    const child = props.children;
    const children = child.props.children;
    const selected = props.selected;
    const setSelected = props.setSelected;
    const className = props.className;
    const parentClassName = props.parentClassName;

    const [opened, setOpened] = useState(false);
    return (
        <div
            onClick={() => {
                setOpened(prv => !prv);
            }} 
            className={`
                w-fit relative max-h-fit ${parentClassName ? parentClassName : ''}
            `} >
            <div className={`
                    flex items-center gap-4 bg-light-primary-500 dark:bg-dark-primary-500 rounded-xl py-2 px-3 justify-between cursor-pointer 
                    ${className ? className : ''}
                `}
            >
                <div className="flex items-center justify-center w-fit rounded-md text-light-quarternary-500 dark:text-dark-quarternary-400 text ">
                    {selected}
                </div>
                <div className="flex items-center justify-center w-fit h-fit rounded-full">
                    <i 
                        className={`
                            fas fa-chevron-down 
                            text-sm text-light-quarternary-500 dark:text-dark-quarternary-500
                            transition-all duration-300
                            ${opened ? ' transform rotate-180' : ''}
                        `}
                    ></i>
                </div>
            </div>
            <AnimatePresence mode='wait'>
                {opened && (
                    <child.type {...child.props} >
                        {
                            children
                            ? Array.isArray(children)
                                ? children.map((childp, i) => {
                                    let child = childp.props.children
                                    return (
                                        <child.type 
                                            key={i}
                                            {...child.props}
                                            onClick={() => {
                                                setSelected(childp.props.value);
                                            }}
                                            className={"cursor-pointer " +  child.props.className + (selected == childp.props.value ? ' selected-option' : '') }  
                                        />
                                    )
                                })
                                :  (
                                    <children.type 
                                        {...children.props}
                                        onClick={() => {
                                            setSelected(childp.props.value);
                                        }}
                                        className={ children.props.className + (selected == children.props.value ? ' selected-option' : '') }  
                                    />
                                )
                            
                            : null
                        }
                    </child.type>
                )}
            </AnimatePresence>
        </div>
    )
}

export default SelectBox;