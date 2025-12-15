// 프로필 관련 Supabase 서비스 함수
import supabase from './supabaseClient';

/**
 * 프로필 조회
 */
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('프로필 조회 실패:', error);
    return null;
  }

  return data;
};

/**
 * 프로필 생성 또는 업데이트
 */
export const upsertProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      nickname: profileData.nickname,
      bio: profileData.bio,
      profile_image_url: profileData.profileImage,
      badge_type: profileData.badgeType || 'badge01',
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('프로필 저장 실패:', error);
    return { success: false, error };
  }

  return { success: true, data };
};

/**
 * 프로필 업데이트 (일부 필드만)
 */
export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('프로필 업데이트 실패:', error);
    return { success: false, error };
  }

  return { success: true, data };
};

/**
 * 닉네임 중복 확인
 */
export const checkNicknameAvailable = async (nickname, currentUserId = null) => {
  let query = supabase
    .from('profiles')
    .select('id, nickname')
    .eq('nickname', nickname);

  // 현재 사용자의 닉네임은 제외 (수정 시 자신의 닉네임은 사용 가능)
  if (currentUserId) {
    query = query.neq('id', currentUserId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('닉네임 확인 실패:', error);
    return { available: false, error };
  }

  return { available: data.length === 0 };
};







