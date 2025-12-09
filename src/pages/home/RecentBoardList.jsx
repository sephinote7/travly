import { Link } from 'react-router-dom';

// src/components/RecentBoardList.jsx
export default function RecentBoardList() {
  const items = Array(9).fill(0); // 더미 데이터

  return (
    <section className="py-16 max-w-[1080px] mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">새로 올라온 이야기</h2>
        <button className="text-sm text-gray-500 hover:text-black">
          <Link to="/board">+ 더 많은 글 보기</Link>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((_, i) => (
          <div key={i} className="bg-white shadow rounded-xl overflow-hidden">
            <img
              src={`/images/recent${(i % 6) + 1}.jpg`}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">
              <h4 className="font-semibold text-sm mb-1">
                모던 시티 바이크 투어
              </h4>
              <p className="text-xs text-gray-500 mb-2">
                도시 속 숨어 있는 자연과 거리의 매력을 발견하는 코스
              </p>
              <span className="text-red-500 text-xs">❤️ 12k</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
