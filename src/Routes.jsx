import { Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@/components/molecules/ProtectedRoute/ProtectedRoute';
import { SigninContainer } from '@/components/organisms/Auth/SigninContainer';
import { SignupContainer } from '@/components/organisms/Auth/SignupContainer';
import { Auth } from '@/pages/Auth/Auth';
import { Home } from '@/pages/Home/Home';
import { Notfound } from '@/pages/Notfound/Notfound';
import { GoogleAuthSuccess } from '@/pages/Auth/GoogleAuthSuccess';

import { Channel } from './pages/Workspace/Channel/Channel';
import { DirectMessage } from './pages/Workspace/DirectMessage/DirectMessage';
import { Drafts } from './pages/Workspace/Drafts/Drafts';
import { Threads } from './pages/Workspace/Threads/Threads';
import { JoinPage } from './pages/Workspace/JoinPage';
import { WorkspaceLayout } from './pages/Workspace/Layout';
import { WorkspaceRedirect } from './pages/Workspace/WorkspaceRedirect';
import { Payments } from './pages/Payments/Payments';

import { CreateWorkspacePage } from './pages/CreateWorkspace/CreateWorkspacePage';

export const AppRoutes = () => {
    return (
        <Routes>
          <Route path="/" element={<Navigate to="/auth/signin" replace />} />
          <Route path="/workspaces/create" element={<ProtectedRoute><CreateWorkspacePage /></ProtectedRoute>} />
          <Route path="/auth/signup" element={<Auth><SignupContainer /></Auth>} />
          <Route path="/auth/signin" element={<Auth><SigninContainer /></Auth>} />
          <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/workspaces/:workspaceId" element={<ProtectedRoute><WorkspaceLayout><WorkspaceRedirect /></WorkspaceLayout></ProtectedRoute>} />
          <Route 
            path="/workspaces/:workspaceId/channels/:channelId"
            element={<ProtectedRoute><WorkspaceLayout><Channel /></WorkspaceLayout></ProtectedRoute>} />
          <Route 
            path="/workspaces/:workspaceId/threads"
            element={<ProtectedRoute><WorkspaceLayout><Threads /></WorkspaceLayout></ProtectedRoute>} />
          <Route 
            path="/workspaces/:workspaceId/drafts"
            element={<ProtectedRoute><WorkspaceLayout><Drafts /></WorkspaceLayout></ProtectedRoute>} />
          <Route 
            path="/workspaces/:workspaceId/members/:memberId"
            element={<ProtectedRoute><WorkspaceLayout><DirectMessage /></WorkspaceLayout></ProtectedRoute>} />
           <Route path="/makepayment" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
          <Route path="/workspaces/join" element={<ProtectedRoute><JoinPage /></ProtectedRoute>} />
          <Route path="/workspaces/join/:workspaceId" element={<ProtectedRoute><JoinPage /></ProtectedRoute>} />
          <Route path="/*" element={<Notfound />} />
        </Routes>
    );
};
