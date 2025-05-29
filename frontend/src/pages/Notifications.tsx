import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: var(--text);
  margin-bottom: 2rem;
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NotificationItem = styled.div`
  background-color: var(--surface);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
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
`;

const Time = styled.span`
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

const Notifications: React.FC = () => {
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
    <Container>
      <Title>Notificaciones</Title>
      <NotificationList>
        {notifications.map(notification => (
          <NotificationItem key={notification.id}>
            <Avatar src={notification.avatar} alt="User avatar" />
            <Content>
              <Message>{notification.message}</Message>
              <Time>{notification.time}</Time>
            </Content>
          </NotificationItem>
        ))}
      </NotificationList>
    </Container>
  );
};

export default Notifications; 