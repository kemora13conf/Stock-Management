import React, { useContext } from 'react'
import { AppContext } from '../../App';
import SelectBox from '../Global/SelectBox/SelectBox';
import Menu from '../Global/SelectBox/Menu';

function SearchForm(props) {
    const { search, setSearch, searchBy, setSearchBy,  } = props;
    const handleSubmit = (e) => {
        e.preventDefault();
    }
    return (
        <form 
            onSubmit={handleSubmit}
            className='
                flex items-center @[400px]/tableFilters:ml-auto rounded-md
                max-w-[300px]
                border border-light-secondary-500 dark:border-dark-secondary-600
            '
        >
            <SelectBox
                {...{
                    selected: searchBy,
                    setSelected: setSearchBy,
                    className: "max-w-fit !rounded-md text-sm",
                }}
            >
                <Menu 
                    className={
                        ` flex flex-col gap-2 py-2 px-2 
                        absolute top-[calc(100%+10px)] left-0 md:right-0 z-index-[2000]
                        bg-light-primary-500 dark:bg-dark-primary-500 rounded-md shadow-lg dark:shadow-dark
                        w-full min-w-fit h-auto 
                        border border-light-secondary-500 dark:border-dark-secondary-600`
                    }
                >
                    
                    <Option value={ 'All' }>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-md">
                            <h1 className="text-light-quarternary-500 dark:text-dark-quarternary-500 text-sm">
                            All
                            </h1>
                        </div>
                    </Option> 
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
                </Menu>
            </SelectBox>
            <div className="flex">
                <input 
                    type="text" 
                    placeholder='Search...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="
                        w-full h-[40px] px-4 py-2 pr-[40px] outline-none bg-transparent
                        border-l border-light-secondary-500 dark:border-dark-secondary-600
                        text-sm text-light-quarternary-500 
                        dark:text-dark-quarternary-500
                        transition-all duration-300
                        hover:bg-light-secondary-500 dark:hover:bg-dark-secondary-600 
                        focus:bg-light-secondary-500 dark:focus:bg-dark-secondary-600
                    " 
                />
                <button 
                    type="submit" 
                    className="
                        w-[40px] h-[40px] -ml-[40px]
                        flex items-center justify-center rounded-full
                        bg-transparent
                        text-light-quarternary-500 dark:text-dark-quarternary-500
                        group
                    "
                >
                    <i className="fas fa-search transition-all duration-300 group-hover:scale-110"></i>
                </button>
            </div>
        </form>
    )
}

export default SearchForm