import React from 'react';
import { Link } from 'react-router-dom';
import badge04 from './images/badge04.png';
import testprofile from './images/testprofile.gif';
import { useAuth } from './AuthStateContext';

function SideProfileComp() {
  const { userData, mockLogout } = useAuth();
  const { name = 'Irem', email = 'test@test.com' } = userData;

  return (
    <div className="w-[300px] h-[360px] p-8 absolute right-0 bg-white flex flex-col justify-center items-center">
      <div className="flex flex-col gap-7.5">
        <div className="flex border-b py-[10px]">
          <img
            src={testprofile}
            className="w-[80px] h-[80px] border rounded-[40px]"
            alt=""
          />

          <div className="flex flex-col gap-2.5 w-[130px] ms-auto text-right">
            <div className="flex flex-col gap-[5px]">
              <p className="p font-bold">{name}</p>
              <p className="ctext">{email}</p>
            </div>

            <img src={badge04} className="block w-[120px] flex ms-auto" />
          </div>
        </div>

        <ul className="flex flex-col gap-5">
          <Link>
            <li className="p">나의 여행 공간</li>
          </Link>

          <Link>
            <li className="p">내가 남긴 여행 기록</li>
          </Link>

          <Link>
            <li className="p">내가 저장한 여행</li>
          </Link>
          <li className=" text-red-600 cursor-pointer" onClick={{ mockLogout }}>
            로그아웃
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideProfileComp;
