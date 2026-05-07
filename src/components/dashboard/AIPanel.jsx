import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const AIPanel = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-xl p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white">AI Summary</h3>
        </div>
        
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          Your team had <span className="text-white font-semibold">24 conversations</span> across <span className="text-white font-semibold">5 channels</span> today. Key topics include the new dashboard redesign and Q3 marketing goals.
        </p>
        
        <button className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors border border-white/5 w-full md:w-auto">
          View Summary
        </button>
      </div>
    </motion.div>
  );
};
