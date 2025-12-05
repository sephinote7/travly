import React, { useState } from 'react';
import travlylogo02 from '../../common/images/travlylogo02.png';
import kakaotalk from '../../common/images/kakaotalk.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../common/AuthStateContext';

function SignupComp() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordCheck: '',
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (form.password !== form.passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const result = await signup({
      email: form.email.trim(),
      password: form.password.trim(),
      nickname: form.nickname.trim(),
    });

    if (!result.success) {
      alert('회원가입 실패: ' + result.error.message);
      return;
    }

    alert('회원가입 성공! 이메일 인증을 완료해주세요.');
    navigate('/login');
  };

  console.log('eamil : ' + form.email + ' pw :' + form.password);

  return (
    <div className="flex mx-auto w-[1080px] h-[100vh] items-center">
      <div className="flex border rounded-[10px]">
        {/* 왼쪽 */}
        <div className="flex flex-col w-[480px] h-[700px] justify-center items-center bg-sky-500 gap-20">
          <p className="h3 text-center text-white">
            TRAVLY에 오신 것을 <br /> 환영합니다!
          </p>
          <img
            className="w-[300px] h-[300px] rounded-[10px]"
            src={travlylogo02}
          />
        </div>

        {/* 오른쪽 */}
        <form
          onSubmit={submitHandler}
          className="w-[600px] h-[700px] flex flex-col gap-5 items-center justify-center p-4"
        >
          <p className="h5 text-amber-400">회원 가입</p>

          <div className="flex flex-col gap-4 w-full max-w-[350px]">
            {/* 이메일 */}
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="email">이메일</label>
              <div className="flex gap-2">
                <input
                  id="email"
                  type="email"
                  onChange={onChange}
                  value={form.email}
                  placeholder="이메일 입력"
                  className="border border-neutral-500 rounded-[5px] px-2.5 w-[300px] h-[40px]"
                />
                <button className="text-white bg-sky-500 w-[100px] px-2.5 py-2 rounded-[5px]">
                  중복확인
                </button>
              </div>
            </div>

            {/* 닉네임 */}
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="nickname">닉네임</label>
              <div className="flex gap-2">
                <input
                  id="nickname"
                  type="text"
                  onChange={onChange}
                  value={form.nickname}
                  placeholder="닉네임 입력"
                  className="border border-neutral-500 rounded-[5px] px-2.5 w-[300px] h-[40px]"
                />
                <button className="text-white bg-sky-500 w-[100px] px-2.5 py-2 rounded-[5px]">
                  중복확인
                </button>
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="password">비밀번호</label>
              <input
                id="password"
                type="password"
                onChange={onChange}
                value={form.password}
                placeholder="비밀번호 입력"
                className="border border-neutral-500 rounded-[5px] px-2.5 w-[300px] h-[40px]"
              />
            </div>

            {/* 비밀번호 확인 */}
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="passwordCheck">비밀번호 확인</label>
              <input
                id="passwordCheck"
                type="password"
                onChange={onChange}
                value={form.passwordCheck}
                placeholder="비밀번호 재확인"
                className="border border-neutral-500 rounded-[5px] px-2.5 w-[300px] h-[40px]"
              />
            </div>
          </div>

          <button className="text-white bg-sky-500 w-[400px] px-2.5 py-2 rounded-[5px]">
            회원 가입
          </button>

          <p className="p">-OR-</p>

          <div className="flex border border-neutral-500 rounded-[5px] w-[240px] p-2 px-4 justify-between items-center">
            <img src={kakaotalk} className="block rounded-[5px]" />
            <p className="p">카카오톡으로 회원가입</p>
          </div>

          <p>
            이미 회원이신가요?{' '}
            <Link to="/login">
              <span className="text-amber-400 font-bold">로그인하기</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupComp;
