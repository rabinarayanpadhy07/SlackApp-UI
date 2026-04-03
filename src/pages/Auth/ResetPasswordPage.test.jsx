import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const navigate = vi.fn();
const resetPasswordMutation = vi.fn();
let tokenValue = 'reset-token';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
    useSearchParams: () => [new URLSearchParams(tokenValue ? `token=${tokenValue}` : '')]
  };
});

vi.mock('@/hooks/apis/auth/useResetPassword', () => ({
  useResetPassword: () => ({
    resetPasswordMutation,
    isPending: false,
    isSuccess: false,
    error: null
  })
}));

const { ResetPasswordPage } = await import('./ResetPasswordPage');

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    navigate.mockReset();
    resetPasswordMutation.mockReset();
    tokenValue = 'reset-token';
  });

  it('shows an error when the reset token is missing', async () => {
    tokenValue = '';

    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/^new password$/i), {
      target: { value: 'StrongPass123' }
    });
    fireEvent.change(screen.getByPlaceholderText(/^confirm new password$/i), {
      target: { value: 'StrongPass123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    expect(await screen.findByText(/reset token is missing/i)).toBeInTheDocument();
    expect(resetPasswordMutation).not.toHaveBeenCalled();
  });

  it('submits a valid token and password', async () => {
    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/^new password$/i), {
      target: { value: 'StrongPass123' }
    });
    fireEvent.change(screen.getByPlaceholderText(/^confirm new password$/i), {
      target: { value: 'StrongPass123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    expect(resetPasswordMutation).toHaveBeenCalledWith({
      token: 'reset-token',
      password: 'StrongPass123'
    });
  });
});
