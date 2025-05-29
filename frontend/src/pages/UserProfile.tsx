import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserCheck, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  max-width: 935px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ProfileHeader = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary);
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Username = styled.h1`
  color: var(--text);
  font-size: 1.75rem;
  margin: 0;
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  color: var(--text);
  font-size: 1.25rem;
  font-weight: 600;
`;

const StatLabel = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const Bio = styled.p`
  color: var(--text);
  margin: 0;
  white-space: pre-line;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  ${props => props.variant === 'primary' ? `
    background-color: var(--primary);
    color: white;

    &:hover {
      opacity: 0.9;
    }
  ` : `
    background-color: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);

    &:hover {
      background-color: var(--surface-hover);
    }
  `}
`;

const TabsContainer = styled.div`
  border-top: 1px solid var(--border);
  margin-top: 2rem;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: 1rem 0;
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-secondary)'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: var(--primary);
    opacity: ${props => props.active ? '1' : '0'};
    transition: opacity 0.2s;
  }

  &:hover {
    color: var(--text);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const PostCard = styled.div`
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  &:hover img {
    transform: scale(1.05);
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
`;

const PostOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;

  ${PostCard}:hover & {
    opacity: 1;
  }
`;

const PostStats = styled.div`
  color: white;
  font-weight: 600;
  display: flex;
  gap: 2rem;
`;

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  // Simular datos del usuario - normalmente vendrían de una API
  const userData = {
    username: username,
    avatar: '/default-avatar.jpg',
    followers: 1234,
    following: 567,
    posts: 89,
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 🚀\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    posts_data: Array(9).fill(null).map((_, i) => ({
      id: i + 1,
      image: '/default-post.jpg',
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100)
    }))
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // Aquí irían las llamadas a la API
  };

  const handleMessage = () => {
    // Aquí iría la lógica para abrir el chat
  };

  return (
    <Container>
      <ProfileHeader>
        <AvatarContainer>
          <Avatar src={userData.avatar} alt={userData.username} />
        </AvatarContainer>

        <ProfileInfo>
          <Username>{userData.username}</Username>

          <Stats>
            <StatItem>
              <StatValue>{userData.posts}</StatValue>
              <StatLabel>Publicaciones</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{userData.followers}</StatValue>
              <StatLabel>Seguidores</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{userData.following}</StatValue>
              <StatLabel>Siguiendo</StatLabel>
            </StatItem>
          </Stats>

          <Bio>{userData.bio}</Bio>

          <ActionButtons>
            <Button
              variant={isFollowing ? 'secondary' : 'primary'}
              onClick={handleFollow}
            >
              <FontAwesomeIcon icon={isFollowing ? faUserCheck : faUserPlus} />
              {isFollowing ? 'Siguiendo' : 'Seguir'}
            </Button>
            <Button variant="secondary" onClick={handleMessage}>
              <FontAwesomeIcon icon={faEnvelope} />
              Mensaje
            </Button>
          </ActionButtons>
        </ProfileInfo>
      </ProfileHeader>

      <TabsContainer>
        <Tabs>
          <Tab
            active={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
          >
            Publicaciones
          </Tab>
          <Tab
            active={activeTab === 'saved'}
            onClick={() => setActiveTab('saved')}
          >
            Guardados
          </Tab>
        </Tabs>

        <Grid>
          {userData.posts_data.map(post => (
            <PostCard key={post.id}>
              <PostImage src={post.image} alt={`Post ${post.id}`} />
              <PostOverlay>
                <PostStats>
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                </PostStats>
              </PostOverlay>
            </PostCard>
          ))}
        </Grid>
      </TabsContainer>
    </Container>
  );
};

export default UserProfile; 