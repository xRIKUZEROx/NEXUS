import React, { useState } from 'react';
import styled from 'styled-components';
import UserSearch from '../components/chat/UserSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: calc(100vh - 60px);
  display: grid;
  grid-template-columns: 320px 1fr;
  background-color: var(--surface);
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  border-right: 1px solid var(--border);
  background-color: var(--surface);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ChatContainer = styled.div<{ isEmpty: boolean }>`
  display: flex;
  flex-direction: column;
  background-color: var(--background);
  position: relative;
  
  ${props => props.isEmpty && `
    justify-content: center;
    align-items: center;
    color: var(--text-secondary);
    font-size: 1.1rem;
  `}
`;

const ChatHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: var(--surface);
`;

const ChatAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const ChatUsername = styled.div`
  color: var(--text);
  font-weight: 500;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div<{ isMine: boolean }>`
  max-width: 70%;
  align-self: ${props => props.isMine ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.isMine ? 'var(--primary)' : 'var(--surface)'};
  color: ${props => props.isMine ? 'white' : 'var(--text)'};
  padding: 0.75rem 1rem;
  border-radius: 16px;
  border-bottom-${props => props.isMine ? 'right' : 'left'}-radius: 4px;
`;

const MessageTime = styled.div<{ isMine: boolean }>`
  font-size: 0.8rem;
  color: ${props => props.isMine ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)'};
  margin-top: 4px;
  text-align: ${props => props.isMine ? 'right' : 'left'};
`;

const InputContainer = styled.div`
  padding: 1rem;
  background-color: var(--surface);
  border-top: 1px solid var(--border);
  display: flex;
  gap: 12px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background-color: var(--background);
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

const SendButton = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  &:disabled {
    background-color: var(--border);
    cursor: not-allowed;
    transform: none;
  }
`;

interface Message {
  id: string;
  text: string;
  isMine: boolean;
  timestamp: string;
}

const Messages: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! ¿Cómo estás?',
      isMine: false,
      timestamp: '10:30'
    },
    {
      id: '2',
      text: '¡Muy bien! ¿Y tú?',
      isMine: true,
      timestamp: '10:31'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        isMine: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container>
      <Sidebar>
        <UserSearch onSelectUser={setSelectedUser} />
      </Sidebar>

      <ChatContainer isEmpty={!selectedUser}>
        {selectedUser ? (
          <>
            <ChatHeader>
              <ChatAvatar src={selectedUser.avatar} alt={selectedUser.username} />
              <ChatUsername>{selectedUser.username}</ChatUsername>
            </ChatHeader>

            <MessagesContainer>
              {messages.map(message => (
                <div key={message.id}>
                  <Message isMine={message.isMine}>
                    {message.text}
                  </Message>
                  <MessageTime isMine={message.isMine}>
                    {message.timestamp}
                  </MessageTime>
                </div>
              ))}
            </MessagesContainer>

            <InputContainer>
              <MessageInput
                type="text"
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <SendButton
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </SendButton>
            </InputContainer>
          </>
        ) : (
          <div>Selecciona un chat para comenzar</div>
        )}
      </ChatContainer>
    </Container>
  );
};

export default Messages; 