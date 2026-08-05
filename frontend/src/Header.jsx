import React from 'react';
import { Bot, User, LogOut, Sparkles } from 'lucide-react';

export default function Header({ user, onOpenAuth, onLogout }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Bot size={22} />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              TalentAI 
              <span className="text-[10px] uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-semibold">
                ATS Platform
              </span>
            </span>
          </div>
        </div>

        {/* Right Section: Status Indicator or User Actions */}
        <div className="flex items-center gap-4">
          <span className="hidden md:inline-flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            AI Models Active
          </span>

          {user ? (
            <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700/80 rounded-full pl-3 pr-2 py-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white uppercase shadow-inner">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-full h-full rounded-full" />
                ) : (
                  user.name ? user.name[0] : <User size={14} />
                )}
              </div>
              <div className="text-left hidden sm:block pr-1">
                <p className="text-xs font-bold text-slate-200 leading-tight">{user.name}</p>
                <p className="text-[10px] text-indigo-400 font-medium capitalize">{user.role || 'Candidate'}</p>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-full transition-colors ml-1"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 active:scale-95"
            >
              <Sparkles size={14} />
              Sign In / Register
            </button>
          )}
        </div>

      </div>
    </header>
  );
}