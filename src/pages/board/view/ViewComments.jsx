// src/pages/board/view/ViewComments.jsx
import React from 'react';
import { formatDateTime } from './viewMappers';

export default function ViewComments({
  comments,
  badgeMap,
  commentText,
  setCommentText,
  commentPosting,

  commentPage,
  commentLast,
  commentLoading,

  onSubmit,
  onLoadMore,
}) {
  return (
    <section className="view-box view-comments">
      <h3 className="view-comments-title">댓글 ({comments.length})개</h3>

      <div className="view-comment-input-wrap">
        <textarea
          className="view-comment-textarea"
          placeholder="댓글을 입력해 주세요."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <div className="view-comment-submit-wrap">
          <button
            className="view-comment-submit-btn"
            type="button"
            onClick={onSubmit}
            disabled={commentPosting}
          >
            {commentPosting ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>

      <ul className="view-comment-list">
        {comments.map((c) => (
          <li key={c.id} className="view-comment-item">
            <div className="view-comment-header">
              <div className="view-comment-avatar">
                {c.writerName?.[0] || '?'}
              </div>
              <div>
                <div className="view-comment-writer">
                  {c.writerName}
                  {c.badgeId && badgeNameMap?.[c.badgeId] && (
                    <span className="view-badge">
                      {badgeNameMap[c.badgeId]}
                    </span>
                  )}
                </div>

                <div className="view-comment-date">
                  {formatDateTime(c.createdAt)}
                </div>
              </div>
            </div>
            <p className="view-comment-content">{c.content}</p>
          </li>
        ))}
      </ul>

      {!commentLast && (
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <button
            type="button"
            onClick={() => onLoadMore(commentPage + 1)}
            disabled={commentLoading}
          >
            {commentLoading ? '불러오는 중...' : '댓글 더 보기'}
          </button>
        </div>
      )}
    </section>
  );
}
