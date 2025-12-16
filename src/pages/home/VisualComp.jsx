import visualimage from './images/visualimage.png';

export default function VisualComp() {
  return (
    <section
      className="w-full h-[100vh] bg-cover bg-center flex items-center justify-center text-white "
      style={{ backgroundImage: `url(${visualimage})` }}
    >
      <div className="text-center px-4">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 leading-relaxed">
          당신의 이야기가 시작되는 곳, Travly
          <br />
          가장 새로운 여행 이야기가 당신을 기다려요!
        </h2>
        <p className="text-lg md:text-xl">매일매일 새로운 세상을 발견하세요</p>
      </div>
    </section>
  );
}
