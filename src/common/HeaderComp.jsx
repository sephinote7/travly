import React from 'react';
import TravLyLogo01 from './images/TravLyLogo01.png';
import TravlyLogo02 from './images/TravlyLogo02.png';
import utilBell from './images/utilBell.png';
import utilPen from './images/utilPen.png';
import utilSearch from './images/utilSearch.png';
import utilUser from './images/utilUser.png';
import { Link } from 'react-router-dom';

function HeaderComp({ onLoginClick }) {
  return (
    <div className="container-fluid flex justify-between items-center px-[40px] h-[80px] ">
      <Link to="/">
        <div className="flex h-[60px] ">
          <img src={TravlyLogo02} />
          <img src={TravLyLogo01} />
        </div>
      </Link>

      <ul className="flex w-[258px] h-[48px] justify-between">
        <li>
          <Link to="/board">
            <img src={utilSearch} />
          </Link>
        </li>
        <li>
          <Link to="/board/write">
            <img src={utilPen} />
          </Link>
        </li>
        <li className="cursor-pointer" onClick={onLoginClick}>
          <img src={utilUser} />
        </li>
        <li className="cursor-pointer">
          <img src={utilBell} />
        </li>
      </ul>
    </div>
  );
}

export default HeaderComp;
