import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import ThemeSelector from '../components/ThemeSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faEye, faEyeSlash, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--background);
`;

const Section = styled.div`
  background-color: var(--surface);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: var(--text);
  margin-bottom: 1.5rem;
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const AvatarUpload = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: var(--primary);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  input {
    display: none;
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

const LogoutButton = styled(Button)`
  background-color: var(--error);
  margin-top: 2rem;
`;

const Message = styled.div<{ isError?: boolean }>`
  color: ${props => props.isError ? 'var(--error)' : 'var(--success)'};
  margin-top: 1rem;
`;

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await axios.post('/api/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Foto de perfil actualizada correctamente');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar la foto de perfil');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      await axios.put('/api/users/profile', {
        name,
        bio
      });
      setMessage('Perfil actualizado correctamente');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      await axios.put('/api/users/password', {
        currentPassword,
        newPassword
      });
      setMessage('Contraseña actualizada correctamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Section>
        <Title>Perfil</Title>
        <AvatarSection>
          <AvatarContainer>
            <Avatar src={user?.avatar || '/default-avatar.jpg'} alt="Profile" />
            <AvatarUpload>
              <label htmlFor="avatar">
                <FontAwesomeIcon icon={faCamera} />
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </AvatarUpload>
          </AvatarContainer>
        </AvatarSection>

        <Form onSubmit={handleProfileUpdate}>
          <FormGroup>
            <Label>Nombre</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Biografía</Label>
            <Input
              as="textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
            />
          </FormGroup>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </Form>
      </Section>

      <Section>
        <Title>Cambiar contraseña</Title>
        <Form onSubmit={handlePasswordChange}>
          <FormGroup>
            <Label>Contraseña actual</Label>
            <PasswordInput>
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
              </button>
            </PasswordInput>
          </FormGroup>

          <FormGroup>
            <Label>Nueva contraseña</Label>
            <PasswordInput>
              <Input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
              </button>
            </PasswordInput>
          </FormGroup>

          <FormGroup>
            <Label>Confirmar nueva contraseña</Label>
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
            {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
          </Button>
        </Form>
      </Section>

      <Section>
        <Title>Personalización</Title>
        <ThemeSelector />
      </Section>

      <LogoutButton onClick={logout}>
        <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar sesión
      </LogoutButton>

      {message && <Message>{message}</Message>}
      {error && <Message isError>{error}</Message>}
    </Container>
  );
};

export default Profile; 