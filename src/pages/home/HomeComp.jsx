import QnaVisual from './QnaVisual';
import RecentBoardList from './RecentBoardList';
import TravlyInfoComp from './TravlyInfoComp';
import VisualComp from './VisualComp';
import WeeklyBoardTopList from './WeeklyBoardTopList';

function HomeComp() {
  return (
    <div className="home-page">
      <VisualComp /> {/* 일반 컴포넌트 호출 */}
      <TravlyInfoComp /> {/* 일반 컴포넌트 호출 */}
      <WeeklyBoardTopList /> {/* 일반 컴포넌트 호출 (내부에 <Link> 있음) */}
      <RecentBoardList /> {/* 일반 컴포넌트 호출 (내부에 <Link> 있음) */}
      <QnaVisual /> {/* 일반 컴포넌트 호출 (내부에 <Link> 있음) */}
    </div>
  );
}

export default HomeComp;
