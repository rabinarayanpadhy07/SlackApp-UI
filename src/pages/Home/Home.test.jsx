import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const navigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate
  };
});

vi.mock('@/hooks/apis/workspaces/useFetchWorkspace', () => ({
  useFetchWorkspace: () => ({
    isFetching: false,
    workspaces: [
      { _id: 'ws-1', name: 'Engineering' },
      { _id: 'ws-2', name: 'Design' }
    ]
  })
}));

vi.mock('@/hooks/context/useAuth', () => ({
  useAuth: () => ({
    auth: {
      isLoading: false,
      user: {
        _id: 'user-1',
        username: 'tester',
        isSuperAdmin: true,
        plan: 'Paid'
      }
    }
  })
}));

const { Home } = await import('./Home');

describe('Home', () => {
  beforeEach(() => {
    navigate.mockReset();
  });

  it('renders available workspaces and opens one on click', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('Engineering')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /open latest workspace/i }));

    expect(navigate).toHaveBeenCalledWith('/workspaces/ws-1');
  });
});
