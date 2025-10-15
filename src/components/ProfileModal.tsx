import React, { useState } from 'react';
import { useUserProfile } from '../contexts/UserProfileContext';
import './ProfileModal.css';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, setUserProfile } = useUserProfile();
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    birthDate: userProfile?.birthDate || '',
    birthTime: userProfile?.birthTime || '',
    occupation: userProfile?.occupation || '',
    gender: userProfile?.gender || 'other' as 'male' | 'female' | 'other'
  });

  const occupations = [
    '학생', '직장인', '프리랜서', '사업자', '공무원', '교사', '의료진',
    '엔지니어', '디자이너', '마케터', '영업직', '연구원', '법무직',
    '예술가', '스포츠선수', '요리사', '기타'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(formData);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h2>🎯 개인화 설정</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">👤 이름 (선택사항)</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="이름을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="birthDate">📅 생년월일</label>
            <input
              type="date"
              id="birthDate"
              value={formData.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="birthTime">🕐 출생시간 (선택사항)</label>
            <input
              type="time"
              id="birthTime"
              value={formData.birthTime}
              onChange={(e) => handleChange('birthTime', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">⚥ 성별</label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              required
            >
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="occupation">💼 직업</label>
            <select
              id="occupation"
              value={formData.occupation}
              onChange={(e) => handleChange('occupation', e.target.value)}
              required
            >
              <option value="">직업을 선택하세요</option>
              {occupations.map(occupation => (
                <option key={occupation} value={occupation}>
                  {occupation}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              취소
            </button>
            <button type="submit" className="save-btn">
              💾 저장하기
            </button>
          </div>
        </form>

        <div className="profile-tips">
          <p>💡 <strong>개인화 팁:</strong></p>
          <ul>
            <li>정확한 생년월일과 직업을 입력하면 더 맞춤형 운세를 받을 수 있어요!</li>
            <li>출생시간은 선택사항이지만, 더 정확한 운세 분석에 도움이 됩니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
