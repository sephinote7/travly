// src/pages/board/components/post/PostListItem.jsx
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:8080/api/travly';

function formatKoreanDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(
    2,
    '0'
  )}/${String(d.getDate()).padStart(2, '0')}`;
}

function getThumbUrl(post) {
  if (post?.thumbnailFilename) {
    return `${API_BASE}/file/${post.thumbnailFilename}`;
  }
  return 'https://via.placeholder.com/420x220?text=No+Image';
}

function getProfileUrl(post) {
  if (post?.memberThumbail) {
    return `${API_BASE}/file/${post.memberThumbail}`;
  }
  return 'https://via.placeholder.com/36?text=U';
}

export default function PostListItem({ post }) {
  return (
    <li className="boardCard">
      <div className="boardCard__thumb">
        <img src={getThumbUrl(post)} alt="썸네일" />
      </div>

      <div className="boardCard__content">
        <div className="boardCard__top">
          <div className="boardCard__texts">
            <Link className="boardCard__title" to={`/board/${post.id}`}>
              {post.title}
            </Link>

            <div className="boardCard__meta">
              <span>{post.placeTitle || '여행 코스'}</span>
              <span className="dot">•</span>
              <span>{formatKoreanDate(post.updatedAt)}</span>
            </div>

            <div className="boardCard__tags">
              {(post.filterItemNames || []).map((t) => (
                <span key={t} className="tag">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <div className="boardCard__author">
            <img className="avatar" src={getProfileUrl(post)} alt="프로필" />
            <div className="authorName">{post.memberNickname}</div>
          </div>
        </div>

        <div className="boardCard__bottom">
          <div className="boardCard__stats">
            <span>♡ {post.likeCount}</span>
            <span>👁 {post.viewCount}</span>
          </div>
        </div>
      </div>
    </li>
  );
}
