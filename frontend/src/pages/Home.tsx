import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart as farHeart,
  faCommentDots as farCommentDots,
  faBookmark as farBookmark
} from '@fortawesome/free-regular-svg-icons';
import {
  faHeart as fasHeart,
  faShareNodes,
  faEllipsisH,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

interface Post {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  image: string;
  caption: string;
  likes: string[];
  comments: Array<{
    _id: string;
    user: {
      _id: string;
      username: string;
      avatar: string;
    };
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
}

const HomeContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 935px;
  margin: 0 auto;
`;

const Feed = styled.div`
  flex: 1;
  max-width: 614px;
`;

const StoriesContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Story = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  min-width: 66px;
`;

const StoryAvatar = styled.div<{ isUser?: boolean }>`
  width: 66px;
  height: 66px;
  border-radius: 50%;
  padding: 3px;
  background: ${({ isUser, theme }) => 
    isUser 
      ? theme.colors.background.secondary
      : 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'};
  position: relative;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.background.secondary};
    object-fit: cover;
  }
`;

const StoryUsername = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  max-width: 74px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
`;

const AddStoryIcon = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.accent};
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme }) => theme.colors.background.secondary};
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

const PostCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
`;

const PostUser = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
`;

const PostUserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const PostUsername = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PostImage = styled.img`
  width: 100%;
  max-height: 767px;
  object-fit: cover;
`;

const PostActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
`;

const PostActionsLeft = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ActionIcon = styled.div`
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const PostLikes = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.md};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PostCaption = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};

  span {
    font-weight: 600;
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
`;

const PostComments = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
`;

const PostTime = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  text-transform: uppercase;
`;

const AddComment = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const CommentInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const PostButton = styled.button`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 600;
  opacity: 0.5;

  &:enabled {
    opacity: 1;
    cursor: pointer;
  }
`;

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/feed`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: response.data.likes } : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diff = now.getTime() - postDate.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} días`;
    if (hours > 0) return `${hours} horas`;
    if (minutes > 0) return `${minutes} minutos`;
    return 'ahora';
  };

  return (
    <HomeContainer>
      <Feed>
        <StoriesContainer>
          <Story>
            <StoryAvatar isUser>
              <img src={user?.avatar || 'default-avatar.jpg'} alt="Your story" />
              <AddStoryIcon>
                <FontAwesomeIcon icon={faPlus} />
              </AddStoryIcon>
            </StoryAvatar>
            <StoryUsername>Tu historia</StoryUsername>
          </Story>
          {/* Add more stories here */}
        </StoriesContainer>

        {posts.map(post => (
          <PostCard key={post._id}>
            <PostHeader>
              <PostUser>
                <PostUserAvatar src={post.user.avatar} alt={post.user.username} />
                <PostUsername>{post.user.username}</PostUsername>
              </PostUser>
              <ActionIcon>
                <FontAwesomeIcon icon={faEllipsisH} />
              </ActionIcon>
            </PostHeader>

            <PostImage src={post.image} alt="Post" />

            <PostActions>
              <PostActionsLeft>
                <ActionIcon onClick={() => handleLike(post._id)}>
                  <FontAwesomeIcon 
                    icon={post.likes.includes(user?._id || '') ? fasHeart : farHeart}
                    style={post.likes.includes(user?._id || '') ? { color: '#ed4956' } : undefined}
                  />
                </ActionIcon>
                <ActionIcon>
                  <FontAwesomeIcon icon={farCommentDots} />
                </ActionIcon>
                <ActionIcon>
                  <FontAwesomeIcon icon={faShareNodes} />
                </ActionIcon>
              </PostActionsLeft>
              <ActionIcon>
                <FontAwesomeIcon icon={farBookmark} />
              </ActionIcon>
            </PostActions>

            <PostLikes>{post.likes.length} conexiones</PostLikes>

            <PostCaption>
              <span>{post.user.username}</span>
              {post.caption}
            </PostCaption>

            {post.comments.length > 0 && (
              <PostComments>
                Ver los {post.comments.length} comentarios
              </PostComments>
            )}

            <PostTime>hace {formatTimestamp(post.createdAt)}</PostTime>

            <AddComment>
              <CommentInput placeholder="Añade un comentario..." />
              <PostButton disabled={true}>Publicar</PostButton>
            </AddComment>
          </PostCard>
        ))}
      </Feed>
    </HomeContainer>
  );
};

export default Home; 