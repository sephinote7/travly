// src/pages/board/view/viewMappers.js

export const MARKER_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f97316',
  '#ec4899',
  '#6366f1',
];

const API_BASE = 'http://localhost:8080/api/travly';

// 외부 placeholder DNS 이슈 방지용
const FALLBACK_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <rect width="100%" height="100%" rx="20" ry="20" fill="#eef2f7"/>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
            font-family="Arial" font-size="14" fill="#64748b">U</text>
    </svg>
  `);

export function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yy}.${mm}.${dd} ${hh}:${mi}`;
}

function normalizeFilename(name) {
  if (!name) return name;
  return name.replace(/(\.(jpg|jpeg|png|webp))\.\2$/i, '.$2');
}

function buildFileUrl(filename) {
  if (!filename) return '';
  return `${API_BASE}/file/${normalizeFilename(filename)}`;
}

// ✅ 네가 준 board 상세 JSON 구조에 맞춘 매핑
export function mapBoardApiToViewModel(apiBoard) {
  const createdAtStr = formatDateTime(apiBoard.createdAt);
  const updatedAtStr = formatDateTime(apiBoard.updatedAt);

  const writer = {
    id: apiBoard.member?.id,
    nickname: apiBoard.member?.nickname || '익명',
    badgeName: apiBoard.member?.badge?.name || '',
    profileImageUrl: apiBoard.member?.profileImage
      ? buildFileUrl(apiBoard.member.profileImage)
      : FALLBACK_AVATAR,
  };

  const places =
    (apiBoard.places || [])
      .slice()
      .sort((a, b) => (a.orderNum ?? 0) - (b.orderNum ?? 0))
      .map((p) => {
        const files = (p.files || [])
          .slice()
          .sort((a, b) => (a.orderNum ?? 0) - (b.orderNum ?? 0))
          .map((f) => f?.file?.filename)
          .filter(Boolean);

        // 썸네일: t_ 있으면 우선, 없으면 첫 파일
        const thumb = files.find((fn) => fn.startsWith('t_')) || files[0] || '';

        return {
          id: p.id,
          name: p.title,
          content: p.content || '',
          orderNum: p.orderNum ?? 0,
          x: p.x,
          y: p.y,
          thumbnailUrl: thumb ? buildFileUrl(thumb) : '',
          photos: files.map((fn) => ({ url: buildFileUrl(fn) })),
        };
      }) || [];

  return {
    id: apiBoard.id,
    title: apiBoard.title || '',
    viewCount: apiBoard.viewCount ?? 0,
    likeCount: apiBoard.likeCount ?? 0,
    createdAtStr,
    updatedAtStr,
    writer,
    places,
  };
}
