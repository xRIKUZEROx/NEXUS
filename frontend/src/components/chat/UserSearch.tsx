import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchContainer = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--border);
`;

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 36px;
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 0.9rem;

  &::placeholder {
    color: var(--text-secondary);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
`;

const UserList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--surface-hover);
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.div`
  color: var(--text);
  font-weight: 500;
`;

const LastMessage = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 4px;
`;

interface User {
  id: string;
  username: string;
  avatar: string;
  lastMessage?: string;
}

interface UserSearchProps {
  onSelectUser: (user: User) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([
    // Datos de ejemplo - normalmente vendrían de una API
    {
      id: '1',
      username: 'usuario1',
      avatar: '/default-avatar.jpg',
      lastMessage: 'Último mensaje...'
    },
    {
      id: '2',
      username: 'usuario2',
      avatar: '/default-avatar.jpg',
      lastMessage: 'Hola, ¿cómo estás?'
    }
  ]);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SearchContainer>
        <SearchInputWrapper>
          <SearchIcon icon={faSearch} />
          <SearchInput
            type="text"
            placeholder="Buscar usuarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchInputWrapper>
      </SearchContainer>

      <UserList>
        {filteredUsers.map(user => (
          <UserItem key={user.id} onClick={() => onSelectUser(user)}>
            <UserAvatar src={user.avatar} alt={user.username} />
            <UserInfo>
              <Username>{user.username}</Username>
              {user.lastMessage && (
                <LastMessage>{user.lastMessage}</LastMessage>
              )}
            </UserInfo>
          </UserItem>
        ))}
      </UserList>
    </>
  );
};

export default UserSearch; 