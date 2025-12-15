import { Link, useNavigate } from 'react-router-dom';
import qnalogo from './images/qnalogo.png';

// src/components/QnaVisual.jsx
export default function QnaVisual() {
  const navigate = useNavigate();

  return (
    <section
      className="w-full bg-purple-200 h-[600px] bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${qnalogo})` }}
    >
      <div className="max-w-[1080px] mx-auto px-4 text-white text-center">
        <div className="py-10">
          <h3 className="h2 mb-3">
            궁금한 점이 있으신가요? 언제든지{' '}
            <span className="text-sky-400">Travly</span>에 물어보세요!
          </h3>
          <p className="text-sm mb-6 h2">
            당신의 <span className="text-sky-400">소중한 의견</span>을
            기다립니다.
          </p>
        </div>

        <div className="h5 flex flex-col gap-2 mb-20">
          <p>
            남겨두신 <span className="text-sky-400">모든 문의</span>는 소중하게
            검토됩니다.
          </p>
          <p>
            <span className="text-sky-400">업무시간 (평일 9:00 ~ 18:00) </span>
            외 문의는 순차적으로 답변드립니다.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center ms-auto gap-2 px-8 py-3 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold hover:cursor-pointer]"
          onClick={() => {
            navigate('/qna');
          }}
        >
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            ?
          </span>
          <span>문의하기</span>
        </button>
      </div>
    </section>
  );
}
