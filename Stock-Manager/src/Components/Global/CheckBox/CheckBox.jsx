import React, { useEffect, useState } from 'react'
import './checkBox.css'
import { motion } from 'framer-motion'

function CheckBox(props) {
    const [ checked, setChecked ] = useState(false);
    const [ loaded, setLoaded ] = useState(false);
    useEffect(() => {
        setLoaded(true);
    }, [])
    useEffect(() => {
        if(loaded){
            if(props.id == 'checkAll'){
                props.setCheckAll(checked);
            }
            else{
                if(checked){
                    if(!props.checkedItems.includes(props.id)){
                        props.setCheckedItems(prv => [...prv, props.id])
                    }
                } else {
                    props.setCheckedItems(prv => prv.filter(item => item != props.id))
                }
            }
        }
    }, [checked])
    useEffect(() => {
        if(props.id != "checkAll"){
            if(props.checkedItems.includes(props.id)){
                setChecked(true);
            } else {
                setChecked(false);
            }
        }
    },[props.checkedItems])
    useEffect(() => {
        if(props.checkAll !== undefined){
            if(props.checkAll){
                setChecked(true);
            } else {
                setChecked(false);
            }
        }
    }, [props.checkAll])
  return (
    <label 
        htmlFor={props.id}
        className='cursor-pointer'
        >
        <input 
            className='hidden'
            type="checkbox"
            id={props.id}
            checked={checked}
            onChange={() => setChecked(prv => !prv)} 
        />
        <div className={`
                w-[20px] h-[20px] border border-light-quarternary-500 dark:border-dark-quarternary-500 
                rounded-md flex justify-center items-center transition-all duration-300 
                ${checked ? 'bg-dark-primary-500 dark:bg-light-primary-500' : ''}

                `}>
            {checked && 
                <motion.i
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    key={props.id} 
                    className="fas fa-check text-light-primary-500 dark:text-dark-primary-500"></motion.i>}
        </div>
    </label>
  )
}

export default CheckBox