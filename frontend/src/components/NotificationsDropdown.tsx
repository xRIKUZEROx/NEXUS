import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Dropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  width: 360px;
  background-color: var(--surface);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1000;
`;

const Header = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  color: var(--text);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid var(--border);
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: var(--surface-hover);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const Content = styled.div`
  flex: 1;
`;

const Message = styled.p`
  color: var(--text);
  margin: 0;
  font-size: 0.9rem;
`;

const Time = styled.span`
  color: var(--text-secondary);
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);
`;

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ isOpen, onClose }) => {
  // Aquí normalmente cargarías las notificaciones desde el backend
  const notifications = [
    {
      id: 1,
      avatar: '/default-avatar.jpg',
      message: 'Usuario1 ha comenzado a seguirte',
      time: '2 min'
    },
    {
      id: 2,
      avatar: '/default-avatar.jpg',
      message: 'Usuario2 ha dado me gusta a tu publicación',
      time: '5 min'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <Dropdown
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Header>
            <Title>Notificaciones</Title>
          </Header>

          <NotificationList>
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <NotificationItem key={notification.id}>
                  <Avatar src={notification.avatar} alt="User avatar" />
                  <Content>
                    <Message>{notification.message}</Message>
                    <Time>{notification.time}</Time>
                  </Content>
                </NotificationItem>
              ))
            ) : (
              <EmptyState>
                No tienes notificaciones
              </EmptyState>
            )}
          </NotificationList>
        </Dropdown>
      )}
    </AnimatePresence>
  );
};

export default NotificationsDropdown; 