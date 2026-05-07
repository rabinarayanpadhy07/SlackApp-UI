import { motion } from 'framer-motion';

export const WelcomeHero = ({ user }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
        Welcome back, {user?.username || 'User'} <span className="ml-2 inline-block animate-bounce origin-bottom-right">👋</span>
      </h1>
      <p className="text-slate-400">
        Here's what's happening with your team today.
      </p>
    </motion.div>
  );
};
