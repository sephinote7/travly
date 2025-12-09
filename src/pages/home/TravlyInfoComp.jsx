// src/components/TravlyInfoComp.jsx
export default function TravlyInfoComp() {
  return (
    <section className="py-16 max-w-[1080px] h-[540px] mx-auto text-center flex flex-col justify-between">
      <h3 className="text-blue-500 font-semibold text-sm tracking-wide mb-3">STEP UP YOUR TRAVEL GAME</h3>
      <p className="text-gray-600 mb-12">
        최고의 여행 경험을 찾고 있다면, Travly와 여행자들이 직접 선택한 최고의 스토리로 떠나보세요.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <img src="/images/icon1.png" className="w-14 mx-auto mb-3" />
          <p className="text-sm text-gray-500">여행자들이 직접 선택한 진짜 여행 정보</p>
        </div>
        <div>
          <img src="/images/icon2.png" className="w-14 mx-auto mb-3" />
          <p className="text-sm text-gray-500">여러분의 이야기를 등록하고 공유해보세요</p>
        </div>
        <div>
          <img src="/images/icon3.png" className="w-14 mx-auto mb-3" />
          <p className="text-sm text-gray-500">다양한 여행자들과 소통하며 정보 교류 가능</p>
        </div>
      </div>
    </section>
  );
}
