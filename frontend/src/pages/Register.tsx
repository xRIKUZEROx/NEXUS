import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAtom, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: var(--text);
  font-weight: 600;
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

const PasswordInput = styled.div`
  position: relative;
  
  input {
    width: 100%;
  }

  button {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
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

const StyledLink = styled(Link)`
  color: var(--primary);
  text-decoration: none;
  text-align: center;
  margin-top: 1rem;
  display: block;

  &:hover {
    text-decoration: underline;
  }
`;

const PasswordRequirements = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: var(--text-secondary);

  li {
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &.valid {
      color: var(--success);
    }

    &.invalid {
      color: var(--error);
    }
  }
`;

const Register: React.FC = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string): boolean => {
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    return hasMinLength && hasNumber && hasLowerCase && hasUpperCase;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      setError('La contraseña no cumple con los requisitos mínimos');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      await register(username, email, password, name);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { label: 'Al menos 8 caracteres', valid: password.length >= 8 },
    { label: 'Al menos un número', valid: /\d/.test(password) },
    { label: 'Al menos una letra minúscula', valid: /[a-z]/.test(password) },
    { label: 'Al menos una letra mayúscula', valid: /[A-Z]/.test(password) }
  ];

  return (
    <Container>
      <Card>
        <Logo>
          <FontAwesomeIcon icon={faAtom} className="logo-icon" />
          <span>Nexus</span>
        </Logo>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nombre de usuario</Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Nombre completo</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Contraseña</Label>
            <PasswordInput>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </PasswordInput>
            <PasswordRequirements>
              {passwordRequirements.map((req, index) => (
                <li key={index} className={req.valid ? 'valid' : 'invalid'}>
                  {req.valid ? '✓' : '✗'} {req.label}
                </li>
              ))}
            </PasswordRequirements>
          </FormGroup>

          <FormGroup>
            <Label>Confirmar contraseña</Label>
            <PasswordInput>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </PasswordInput>
          </FormGroup>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </Button>

          {error && <Message isError>{error}</Message>}
        </Form>

        <StyledLink to="/login">¿Ya tienes una cuenta? Inicia sesión</StyledLink>
      </Card>
    </Container>
  );
};

export default Register; 