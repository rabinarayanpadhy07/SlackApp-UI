import { useQueryClient } from '@tanstack/react-query';
import { Building2Icon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCreateWorkspace } from '@/hooks/apis/workspaces/useCreateWorkspace';

export const CreateWorkspacePage = () => {
    const [workspaceName, setWorkspaceName] = useState('');
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isPending, createWorkspaceMutation } = useCreateWorkspace();

    async function handleSubmit(e) {
        e.preventDefault();
        if (!workspaceName.trim()) return;
        try {
            const data = await createWorkspaceMutation({ name: workspaceName.trim() });
            queryClient.invalidateQueries({ queryKey: ['fetchWorkspaces'] });
            navigate(`/workspaces/${data._id}`);
        } catch (err) {
            console.error('Failed to create workspace', err);
        }
    }

    return (
        <div className="min-h-screen bg-slack-dark flex items-center justify-center p-6">
            <Card className="w-full max-w-md shadow-xl border-0 bg-card/95 backdrop-blur-sm">
                <CardHeader>
                    <div className="mx-auto mb-4 rounded-2xl bg-muted/50 p-6 w-fit">
                        <Building2Icon className="size-12 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-xl text-center">Create a new workspace</CardTitle>
                    <CardDescription className="text-center">
                        Enter a name for your workspace. You can change it later.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            required
                            minLength={3}
                            placeholder="e.g. My Workspace, Dev Team"
                            value={workspaceName}
                            onChange={(e) => setWorkspaceName(e.target.value)}
                            disabled={isPending}
                        />
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => navigate('/home')}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1" disabled={isPending}>
                                {isPending ? 'Creating...' : 'Create workspace'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
