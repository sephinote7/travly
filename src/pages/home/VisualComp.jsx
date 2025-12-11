// src/components/VisualComp.jsx
import heroImage from '../../common/images/Vector.png';

export default function VisualComp() {
  return (
    <section 
      className="w-full h-[100vh] bg-cover bg-center flex items-center justify-center text-white relative"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* 오버레이를 제거하거나 매우 밝게 조정 (필요시 주석 해제) */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-10"></div> */}
      
      <div className="text-center px-4 relative z-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 leading-relaxed drop-shadow-2xl">
          당신의 이야기가 시작되는 곳, Travly
          <br />
          가장 새로운 여행 이야기가 당신을 기다려요!
        </h2>
        <p className="text-lg md:text-xl drop-shadow-2xl">매일매일 새로운 세상을 발견하세요</p>
      </div>
    </section>
  );
}
