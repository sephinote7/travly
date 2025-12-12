// src/pages/test/DatabaseTestComp.jsx
import { useState } from 'react';
import supabase from '../../util/supabaseClient';
import { useAuth } from '../../common/AuthStateContext';

export default function DatabaseTestComp() {
  const { userData } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  // 테이블 목록 확인
  const testTables = async () => {
    setLoading(true);
    try {
      // profiles 테이블 확인
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);

      // posts 테이블 확인
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .limit(5);

      // bookmarks 테이블 확인
      const { data: bookmarks, error: bookmarksError } = await supabase
        .from('bookmarks')
        .select('*')
        .limit(5);

      // comments 테이블 확인
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .limit(5);

      // likes 테이블 확인
      const { data: likes, error: likesError } = await supabase
        .from('likes')
        .select('*')
        .limit(5);

      setTestResults({
        profiles: { data: profiles, error: profilesError, count: profiles?.length || 0 },
        posts: { data: posts, error: postsError, count: posts?.length || 0 },
        bookmarks: { data: bookmarks, error: bookmarksError, count: bookmarks?.length || 0 },
        comments: { data: comments, error: commentsError, count: comments?.length || 0 },
        likes: { data: likes, error: likesError, count: likes?.length || 0 },
      });
    } catch (error) {
      console.error('테스트 중 에러:', error);
      setTestResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  // 프로필 생성 테스트
  const testCreateProfile = async () => {
    if (!userData?.isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    try {
      // 현재 사용자 정보 가져오기
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        alert('사용자 정보를 가져올 수 없습니다: ' + (userError?.message || '알 수 없는 오류'));
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id, // auth.users의 UUID 사용
          nickname: `test_${Date.now()}`,
          bio: '테스트 프로필입니다.',
          badge_type: 'badge01',
        })
        .select();

      if (error) {
        alert('프로필 생성 실패: ' + error.message);
        console.error('에러 상세:', error);
      } else {
        alert('프로필 생성 성공!');
        console.log('생성된 프로필:', data);
      }
    } catch (error) {
      console.error('프로필 생성 중 에러:', error);
      alert('에러: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">데이터베이스 연결 테스트</h1>

      <div className="space-y-4">
        {/* 테이블 목록 확인 버튼 */}
        <button
          onClick={testTables}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? '테스트 중...' : '모든 테이블 확인'}
        </button>

        {/* 테스트 결과 표시 */}
        {Object.keys(testResults).length > 0 && (
          <div className="mt-6 space-y-4">
            {Object.entries(testResults).map(([tableName, result]) => {
              if (tableName === 'error') {
                return (
                  <div key={tableName} className="p-4 bg-red-100 border border-red-400 rounded">
                    <p className="text-red-700">에러: {result}</p>
                  </div>
                );
              }

              return (
                <div key={tableName} className="p-4 border rounded">
                  <h3 className="font-semibold mb-2">
                    {tableName} 테이블 ({result.count}개 레코드)
                  </h3>
                  {result.error ? (
                    <p className="text-red-600">에러: {result.error.message}</p>
                  ) : (
                    <div>
                      <p className="text-green-600 mb-2">✓ 연결 성공</p>
                      {result.data && result.data.length > 0 && (
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 프로필 생성 테스트 */}
        {userData?.isLoggedIn && (
          <div className="mt-6">
            <button
              onClick={testCreateProfile}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading ? '생성 중...' : '프로필 생성 테스트'}
            </button>
            <p className="text-sm text-gray-600 mt-2">
              현재 로그인된 사용자로 프로필을 생성합니다.
            </p>
          </div>
        )}

        {/* 로그인 안내 */}
        {!userData?.isLoggedIn && (
          <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded">
            <p className="text-yellow-800">로그인 후 프로필 생성 테스트를 사용할 수 있습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

