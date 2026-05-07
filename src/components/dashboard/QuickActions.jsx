import { Link, Users, UserPlus, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const actions = [
  { icon: Link, label: 'Create Workspace', color: 'text-blue-400', bg: 'bg-blue-500/10', path: '/workspaces/create' },
  { icon: Users, label: 'Join Workspace', color: 'text-green-400', bg: 'bg-green-500/10', path: '/workspaces/join' },
  { icon: UserPlus, label: 'Invite People', color: 'text-purple-400', bg: 'bg-purple-500/10', path: '/workspaces/join' }, // Just an example path
  { icon: Video, label: 'Start Huddle', color: 'text-cyan-400', bg: 'bg-cyan-500/10', path: '#' },
];

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => action.path !== '#' && navigate(action.path)}
            className="glass-card rounded-xl p-4 flex items-center cursor-pointer group hover:border-purple-500/30 transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${action.bg} ${action.color}`}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
              {action.label.split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
