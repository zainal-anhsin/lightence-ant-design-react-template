import React, { useState } from 'react';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseAvatar } from '@app/components/common/BaseAvatar/BaseAvatar';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseTypography } from '@app/components/common/BaseTypography/BaseTypography';
import styled from 'styled-components';

const HelpLink = styled.a`
  color: var(--primary-color);
  text-decoration: underline;
`;

const SchoolPage: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);
  const [classCode, setClassCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = () => {
    setLoading(true);
    // Simulate join action
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <BaseRow justify="center" style={{ marginTop: 40 }}>
      <BaseCol xs={24} sm={18} md={12} lg={10} xl={8}>
        <BaseTypography.Title level={4} style={{ marginBottom: 24 }}>
          Join School - Ave Maria Convent. Jawi
        </BaseTypography.Title>
        <BaseCard style={{ marginBottom: 24 }}>
          <BaseTypography.Text type="secondary" style={{ marginBottom: 8, display: 'block' }}>
            You're currently signed in as
          </BaseTypography.Text>
          <BaseRow align="middle" gutter={16}>
            <BaseCol>
              <BaseAvatar size={56} src={user?.imgUrl} alt="User" />
            </BaseCol>
            <BaseCol>
              <BaseTypography.Text strong style={{ fontSize: 18 }}>
                {user?.firstName} {user?.lastName}
              </BaseTypography.Text>
              <div>
                <BaseTypography.Text type="secondary" style={{ fontSize: 14 }}>
                  Student
                </BaseTypography.Text>
              </div>
            </BaseCol>
          </BaseRow>
        </BaseCard>
        <BaseCard style={{ marginBottom: 24 }}>
          <BaseTypography.Text strong style={{ marginBottom: 8, display: 'block' }}>
            Class Code
          </BaseTypography.Text>
          <BaseTypography.Text type="secondary" style={{ marginBottom: 12, display: 'block' }}>
            Ask your teacher for the class code, then enter it here.
          </BaseTypography.Text>
          <BaseInput
            placeholder="Class Code"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            maxLength={8}
            style={{ width: '100%', marginBottom: 0 }}
          />
        </BaseCard>
        <div style={{ marginBottom: 16 }}>
          <BaseTypography.Text strong>To sign in with a Class Code</BaseTypography.Text>
          <ul style={{ margin: '8px 0 8px 20px', padding: 0 }}>
            <li>Use an authorized account</li>
            <li>Use a class code with 5-8 letters or numbers, and no space or symbols</li>
          </ul>
          <BaseTypography.Text type="secondary">
            If you have trouble joining the class, go to the{' '}
            <HelpLink href="https://helpcenter.example.com" target="_blank" rel="noopener noreferrer">
              Help Center article
            </HelpLink>
          </BaseTypography.Text>
        </div>
        <BaseRow gutter={16} justify="end">
          <BaseCol>
            <BaseButton onClick={() => setClassCode('')} type="default" disabled={loading}>
              Cancel
            </BaseButton>
          </BaseCol>
          <BaseCol>
            <BaseButton type="primary" onClick={handleJoin} loading={loading} disabled={!classCode || loading}>
              Join
            </BaseButton>
          </BaseCol>
        </BaseRow>
      </BaseCol>
    </BaseRow>
  );
};

export default SchoolPage; 