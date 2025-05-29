import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAtom } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: var(--background);
`;

const Card = styled.div`
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  margin-bottom: 1rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: var(--text);

  .logo-icon {
    color: var(--primary);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background-color: var(--background);
  color: var(--text);
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const Message = styled.div<{ isError?: boolean }>`
  color: ${props => props.isError ? 'var(--error)' : 'var(--success)'};
  text-align: center;
  margin-top: 1rem;
`;

const BackLink = styled(Link)`
  color: var(--primary);
  text-decoration: none;
  text-align: center;
  margin-top: 1rem;
  display: block;

  &:hover {
    text-decoration: underline;
  }
`;

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      await axios.post('/api/auth/forgot-password', { email });
      setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ha ocurrido un error. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Logo>
          <FontAwesomeIcon icon={faAtom} className="logo-icon" />
          <span>Nexus</span>
        </Logo>

        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </Button>
        </Form>

        {message && <Message>{message}</Message>}
        {error && <Message isError>{error}</Message>}

        <BackLink to="/login">Volver al inicio de sesión</BackLink>
      </Card>
    </Container>
  );
};

export default ForgotPassword; 