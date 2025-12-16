import airplane from './images/airplane.png';
import earth from './images/earth.png';
import museum from './images/museum.png';

export default function TravlyInfoComp() {
  return (
    <section className="py-[80px] max-w-[1080px] h-[540px] mx-auto text-center flex flex-col justify-center">
      <div className="mb-[50px]">
        <h3 className="text-blue-500 h3 mb-[30px]">STEP UP YOUR TRAVEL GAME</h3>
        <div className="flex flex-col gap-3 ">
          <p className="p">
            최고의 여행 팁과 현지 정보, 그리고 여행자가 직접 기록한 실시간
            루트를 탐색해보세요.
          </p>
          <p className="p">
            숨겨진 명소부터 필수 코스까지 한 번에 확인할 수 있습니다.{' '}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="flex flex-col gap-[5px]">
          <div className="w-20 h-20 rounded-[40px] bg-sky-400 flex justify-center items-center mx-auto mb-10">
            <img src={airplane} className="w-[30px]" />
          </div>
          <p className="p">Travly는 여행자들이 직접 기록하고</p>
          <p className="p">공유하는 새로운 여행 기준을 제시합니다.</p>
          <p className="font-bold text-sky-400">
            여행 경험의 진짜 가치를 발견하세요
          </p>
        </div>
        <div className="flex flex-col gap-[5px]">
          <div className="w-20 h-20 rounded-[40px] bg-neutral-400 flex justify-center items-center mx-auto mb-10">
            <img src={museum} className="w-[30px]" />
          </div>
          <p className="p">Travly의 모든 여행 기록은 실제 사용자가</p>
          <p className="p">방문한 루트 기반으로 검증됩니다.</p>
          <p className="font-bold text-sky-400">
            더 진실되고 생생한 여행 정보를 제공합니다.
          </p>
        </div>
        <div className="flex flex-col gap-[5px]">
          <div className="w-20 h-20 rounded-[40px] bg-amber-400 flex justify-center items-center mx-auto mb-10">
            <img src={earth} className="w-[30px]" />
          </div>
          <p className="p">전국 여행자들과 연결되고,</p>
          <p className="p">목적지 정보를 한 곳에서 탐색하세요!</p>
          <p className="font-bold text-sky-400">여행 커뮤니티의 새로운 기준!</p>
        </div>
      </div>
    </section>
  );
}
