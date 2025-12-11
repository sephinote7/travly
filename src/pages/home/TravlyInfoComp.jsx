// src/components/TravlyInfoComp.jsx
import airplaneImage from '../../common/images/airplane.png';
import museumImage from '../../common/images/museum.png';
import earthImage from '../../common/images/earth.png';

export default function TravlyInfoComp() {
  return (
    <section className="w-full py-16">
      <div className="max-w-[1080px] mx-auto px-4 text-center">
        {/* 상단 타이틀 및 설명 */}
        <div className="mb-16">
          <h3 className="text-blue-500 font-bold text-sm tracking-wide mb-6 uppercase">
            STEP UP YOUR TRAVEL GAME
          </h3>
          <div className="space-y-2 text-gray-700">
            <p className="text-base">
              최고의 여행 팁과 현지 정보, 그리고 여행자가 직접 기록한 실시간 루트를 탐색해보세요.
            </p>
            <p className="text-base">
              숨겨진 명소부터 필수 코스까지 한 번에 확인할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 하단 3개 아이콘 블록 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* 왼쪽 블록 - 비행기 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center mb-6">
              <img src={airplaneImage} alt="비행기 아이콘" className="w-10 h-10 object-contain" />
            </div>
            <div className="space-y-1 text-sm text-gray-700">
              <p>Travly는 여행자들이 직접 기록하고</p>
              <p>공유하는 새로운 여행 기준을 제시합니다.</p>
              <p className="text-blue-500 font-semibold mt-2">
                여행 경험의 진짜 가치를 발견하세요.
              </p>
            </div>
          </div>

          {/* 중앙 블록 - 박물관 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center mb-6">
              <img src={museumImage} alt="박물관 아이콘" className="w-10 h-10 object-contain" />
            </div>
            <div className="space-y-1 text-sm text-gray-700">
              <p>트래블리의 모든 여행 기록은 실제 사용자가</p>
              <p>방문한 루트 기반으로 검증됩니다.</p>
              <p className="text-blue-500 font-semibold mt-2">
                더 진실되고 생생한 여행 정보를 제공합니다.
              </p>
            </div>
          </div>

          {/* 오른쪽 블록 - 지구 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-yellow-300 flex items-center justify-center mb-6">
              <img src={earthImage} alt="지구 아이콘" className="w-10 h-10 object-contain" />
            </div>
            <div className="space-y-1 text-sm text-gray-700">
              <p>전 세계 여행자들과 연결되고,</p>
              <p>목적지 정보를 한곳에서 탐색하세요.</p>
              <p className="text-blue-500 font-semibold mt-2">
                여행 커뮤니티의 새로운 기준.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
