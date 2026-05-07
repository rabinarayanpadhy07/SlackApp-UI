import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Sparkles } from 'lucide-react';

const stats = [
  { label: 'Active Channels', value: '12', trend: 'down', trendValue: '12 this week', highlight: false },
  { label: 'Messages Sent', value: '1,248', trend: 'up', trendValue: '18.5%', highlight: false },
  { label: 'AI Summaries', value: '32', trend: 'down', trendValue: '12 this week', highlight: false, icon: Sparkles },
  { label: 'Online Members', value: '18', action: 'View all', highlight: false },
];

export const AnalyticsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="glass-card rounded-xl p-5 relative overflow-hidden group"
        >
          {/* Subtle gradient hover effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-sm font-medium text-slate-400">{stat.label}</span>
            {stat.icon && <stat.icon className="w-4 h-4 text-purple-400" />}
          </div>
          
          <div className="relative z-10">
            <h4 className="text-3xl font-bold text-white mb-2">{stat.value}</h4>
            
            {stat.trend && (
              <div className={`flex items-center text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {stat.trend === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                <span>{stat.trendValue}</span>
              </div>
            )}
            
            {stat.action && (
              <button className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors">
                {stat.action}
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
