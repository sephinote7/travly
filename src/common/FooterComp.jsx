import React from 'react';
import TravlyFooterLogo from './images/TravlyFooterLogo.png';
import { Link } from 'react-router-dom';
import instagram from './images/instagram.png';
import facebook from './images/facebook.png';
import youtube from './images/youtube.png';

function FooterComp() {
  return (
    <div className=" bg-neutral-600 h-[410px] text-white py-15">
      <div className="contianer w-[1080px] h-full mx-auto flex flex-col justify-between">
        <div className="flex justify-between">
          <div className="flex flex-col gap-10 w-[268px] h-[140px]">
            <img className="block" src={TravlyFooterLogo} />
            <div className="flex flex-col gap-[5px]">
              <p className="text-sm">주소 : 서울시 구로구 트래블리로 884 </p>
              <p className="text-sm">고객센터 : help@travly.co.kr </p>
            </div>
          </div>

          <div className="w-[398px] h-[186px] flex justify-between">
            <div className="flex flex-col gap-[30px]">
              <p className="text-xl text-amber-400 ">Support</p>
              <ul className="flex flex-col gap-[15px]">
                <li>
                  <Link to="#">이용약관</Link>
                </li>
                <li>
                  <Link to="#">개인정보처리방침</Link>
                </li>
                <li>
                  <Link to="#">공지사항</Link>
                </li>
                <li>
                  <Link to="/qna">FAQ</Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col w-[140px] h-[118px] justify-between">
              <p className="text-xl text-amber-400 ">Follow us</p>
              <ul className="flex justify-between">
                <li>
                  <Link to="#">
                    <img src={instagram} />
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <img src={facebook} />
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <img src={youtube} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="text-sm text-center">© 2025. Travly All Rights Reserved.</p>
      </div>
    </div>
  );
}

export default FooterComp;
