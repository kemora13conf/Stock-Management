// LinkWithGlobalState.js
import React, { useContext, useRef } from 'react';
import { AppContext } from '../../App';
import { Link } from 'react-router-dom';

function MyLink(props) {
  const { setLoaded, setOpen } = useContext(AppContext);
  const ref = useRef(null);

  const handleClick = () => {
    setLoaded(false);
    const url = new URL(ref.current.href);
    localStorage.setItem('lastUrl', url.pathname);
  };

  return <Link ref={ref} {...props} onClick={handleClick} />;
}

export default MyLink;
