import { Search, Bell, MessageSquarePlus } from 'lucide-react';
import { motion } from 'framer-motion';

export const TopNavbar = ({ user }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4 ml-4">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0a0a0a]"></span>
        </motion.button>
        
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 text-slate-400 hover:text-white transition-colors">
          <MessageSquarePlus className="w-5 h-5" />
        </motion.button>

        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 cursor-pointer flex items-center justify-center bg-purple-500 text-white font-semibold">
          {user?.avatar ? (
            <img src={user.avatar} alt="User Profile" className="w-full h-full object-cover" />
          ) : (
            getInitials(user?.username)
          )}
        </div>
      </div>
    </header>
  );
};
