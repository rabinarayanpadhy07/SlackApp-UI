import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const colors = [
  'from-purple-500 to-blue-500',
  'from-orange-500 to-red-500',
  'from-green-500 to-emerald-500',
  'from-cyan-400 to-blue-500',
  'from-pink-500 to-rose-500',
];

export const RecentWorkspaces = ({ workspaces }) => {
  const navigate = useNavigate();

  if (!workspaces || workspaces.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card rounded-xl p-6 h-full flex items-center justify-center min-h-[200px]"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">No Workspaces Yet</h3>
          <p className="text-slate-400 text-sm mb-4">You haven't joined or created any workspaces.</p>
          <button 
            onClick={() => navigate('/workspaces/create')}
            className="text-sm bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Create Workspace
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card rounded-xl p-6 h-full"
    >
      <h3 className="text-lg font-semibold text-white mb-6">Your Workspaces</h3>
      
      <div className="space-y-4">
        {workspaces.map((ws, idx) => {
          const color = colors[idx % colors.length];
          const initial = ws.name ? ws.name.charAt(0).toUpperCase() : 'W';
          
          return (
            <motion.div 
              key={ws._id}
              whileHover={{ scale: 1.01, x: 4 }}
              onClick={() => navigate(`/workspaces/${ws._id}`)}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                  {initial}
                </div>
                <div>
                  <h4 className="text-white font-medium group-hover:text-purple-400 transition-colors">{ws.name}</h4>
                  <p className="text-sm text-slate-400">Join Code: {ws.joinCode}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="hidden sm:flex -space-x-2">
                  {/* Replace with real members if you have them in the workspace object, or show an icon */}
                  <div className="w-8 h-8 rounded-full border-2 border-[#13151a] bg-slate-800 flex items-center justify-center text-xs text-white z-10">
                    {ws.members ? ws.members.length : 1}
                  </div>
                </div>
                
                <div className="text-sm text-slate-400 w-24 text-right hidden md:block">
                  {ws.members ? ws.members.length : 1} members
                </div>
                
                {/* Dummy notification for design purposes */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white/10 text-slate-400`}>
                  0
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
