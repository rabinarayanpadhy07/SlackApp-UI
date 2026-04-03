import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const forgotPasswordMutation = vi.fn();

vi.mock('@/hooks/apis/auth/useForgotPassword', () => ({
  useForgotPassword: () => ({
    forgotPasswordMutation,
    isPending: false,
    isSuccess: false,
    error: null
  })
}));

const { ForgotPasswordPage } = await import('./ForgotPasswordPage');

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    forgotPasswordMutation.mockReset();
  });

  it('validates that email is required', async () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(forgotPasswordMutation).not.toHaveBeenCalled();
  });

  it('submits the entered email', async () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'person@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

    expect(forgotPasswordMutation).toHaveBeenCalledWith({
      email: 'person@example.com'
    });
  });
});
