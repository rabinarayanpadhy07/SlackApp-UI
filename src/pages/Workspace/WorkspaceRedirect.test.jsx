import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const navigate = vi.fn();
let workspaceResponse = {
  workspace: {
    _id: 'workspace-1',
    channels: [{ _id: 'channel-1', name: 'general' }]
  },
  isFetching: false,
  isSuccess: true,
  error: null
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
    useParams: () => ({ workspaceId: 'workspace-1' })
  };
});

vi.mock('@/hooks/apis/workspaces/useGetWorkspaceById', () => ({
  useGetWorkspaceById: () => workspaceResponse
}));

const { WorkspaceRedirect } = await import('./WorkspaceRedirect');

describe('WorkspaceRedirect', () => {
  beforeEach(() => {
    navigate.mockReset();
    workspaceResponse = {
      workspace: {
        _id: 'workspace-1',
        channels: [{ _id: 'channel-1', name: 'general' }]
      },
      isFetching: false,
      isSuccess: true,
      error: null
    };
  });

  it('redirects to the first available channel', () => {
    render(
      <MemoryRouter>
        <WorkspaceRedirect />
      </MemoryRouter>
    );

    expect(navigate).toHaveBeenCalledWith(
      '/workspaces/workspace-1/channels/channel-1',
      { replace: true }
    );
  });

  it('shows a friendly empty-state message when no channels exist', () => {
    workspaceResponse = {
      workspace: {
        _id: 'workspace-1',
        channels: []
      },
      isFetching: false,
      isSuccess: true,
      error: null
    };

    render(
      <MemoryRouter>
        <WorkspaceRedirect />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/no channels are available in this workspace yet/i)
    ).toBeInTheDocument();
  });
});
