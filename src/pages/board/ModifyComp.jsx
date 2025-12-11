// src/pages/ModifyComp.jsx
import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import apiClient from '../../services/apiClient';
// import Timeline from '../board/components/Timeline';
import PlannerMap from '../board/components/PlannerMap';

function ModifyComp() {
  const dummyInitialData = {
    tripTitle: '가라 제주도 2박 3일 여행',
    tripMeta: {
      withWho: '친구',
      duration: '2박 3일',
      styles: ['맛집', '바다 뷰'],
    },
    center: {
      lat: 33.4996213,
      lng: 126.5311884, // 제주 시내 대충 좌표
    },
    items: [
      {
        placeId: 101,
        order: 1,
        name: '제주 국제공항',
        addr: '제주특별자치도 제주시 공항로 2',
        lat: 33.510414,
        lng: 126.491353,
        photos: [],
        title: '제주 도착!',
        text: '도착해서 렌트카 픽업하기',
      },
      {
        placeId: 102,
        order: 2,
        name: '용두암',
        addr: '제주특별자치도 제주시 용두암길 15',
        lat: 33.515,
        lng: 126.511,
        photos: [],
        title: '용두암 구경',
        text: '사진 찍고 잠깐 산책',
      },
      {
        placeId: 103,
        order: 3,
        name: '흑돼지 맛집',
        addr: '제주특별자치도 제주시 어디구 고기거리 123',
        lat: 33.505,
        lng: 126.525,
        photos: [],
        title: '저녁 흑돼지',
        text: '첫날 저녁은 흑돼지 폭식 타임',
      },
    ],
  };

  return (
    <div className="board-modify-page">
      <h2>여행 기록 수정 (가라 데이터)</h2>
      {/* mode="edit" + initialData 넘겨주기 */}
      <PlannerMap mode="edit" initialData={dummyInitialData} />
    </div>
  );

  // const { boardId } = useParams();
  // const [loading, setLoading] = useState(true);
  // const [board, setBoard] = useState(null);
  // const [selectedPlaces, setSelectedPlaces] = useState([]);
  // const [initialDrafts, setInitialDrafts] = useState({});
  // const [initialTripTitle, setInitialTripTitle] = useState('');
  // useEffect(() => {
  //   async function loadData() {
  //     try {
  //       const res = await apiClient.get(`/board/${boardId}`);
  //       const data = res.data;
  //       setBoard(data);
  //       // 전체 제목
  //       setInitialTripTitle(data.title);
  //       // Timeline에 필요한 구조로 변환
  //       const drafts = {};
  //       const places = [];
  //       data.places.forEach((p, idx) => {
  //         const routeId = p.id; // ⭐ 수정 시 routeId = placeId 사용
  //         // selectedPlaces: 지도 & 타임라인에서 사용하는 기본 정보
  //         places.push({
  //           id: p.id,
  //           routeId,
  //           order: p.orderNum,
  //           name: p.title,
  //           addr: '', // 필요 시 적용
  //           lat: p.y,
  //           lng: p.x,
  //         });
  //         // draft 초기값 구성
  //         drafts[routeId] = {
  //           title: p.title,
  //           text: p.content,
  //           photos: p.files.map((f) => {
  //             // 서버 이미지 URL로 변환 필요
  //             return `/api/travly/file/${f.file.id}`;
  //           }),
  //           fileIds: p.files.map((f) => f.file.id),
  //         };
  //       });
  //       setSelectedPlaces(places);
  //       setInitialDrafts(drafts);
  //       setLoading(false);
  //     } catch (err) {
  //       console.error('수정 데이터 불러오기 실패:', err);
  //       setLoading(false);
  //     }
  //   }
  //   loadData();
  // }, [boardId]);
  // if (loading) return <div>불러오는 중...</div>;
  // if (!board) return <div>존재하지 않는 게시글입니다.</div>;
  // return (
  //   <div style={{ display: 'flex' }}>
  //     {/* 왼쪽 검색 패널 생략 가능 */}
  //     {/* 가운데 지도 생략 가능 */}
  //     <Timeline
  //       mode="edit"
  //       boardId={boardId}
  //       selectedPlaces={selectedPlaces}
  //       initialDrafts={initialDrafts}
  //       initialTripTitle={initialTripTitle}
  //     />
  //   </div>
  // );
  return <PlannerMap mode="edit" initialData={initialData} />;
}

export default MemberInfoComp;
