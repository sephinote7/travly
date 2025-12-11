import { Link } from 'react-router-dom';
import qnaImage from '../../common/images/QnA.png';

// src/components/QnaVisual.jsx
export default function QnaVisual() {
  return (
    <section
      className="w-full h-[400px] md:h-[500px] bg-cover bg-center flex items-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${qnaImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-[1080px] mx-auto px-4 text-white relative z-10">
        <h3 className="text-xl mb-3">
          궁금한 점이 있으신가요? 언제든지 <span className="text-blue-400">Travly</span>에 물어보세요!
        </h3>
        <p className="text-sm mb-6">당신의 소중한 의견을 기다립니다.</p>

        <button className="bg-blue-500 px-5 py-2 rounded-lg text-sm ms-auto block hover:bg-blue-600">
          <Link to="/qna">문의하기</Link>
        </button>
      </div>
    </section>
  );
}
