import React, { useState } from 'react';
import axios from 'axios';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  TrendingUp, 
  Bot, 
  RefreshCw,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!file) return alert('Please upload a PDF resume first!');

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jd);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/resume/analyze`, formData);
      setResult(response.data.data);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze resume. Make sure your backend server is running on port 5000!');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500 bg-amber-500/10';
    return 'text-rose-400 border-rose-500 bg-rose-500/10';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-24">
      {/* Background Decorative Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none blur-3xl" />

      {/* Top Header Bar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Bot size={22} />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                TalentAI <span className="text-[10px] uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-semibold">ATS Core</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Gemini Models Active
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto mt-12 px-5 relative z-10">
        
        {/* Title Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full mb-4">
            <Zap size={14} /> Next-Gen AI Resume Screener
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Optimize Your Resume for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Maximum ATS Match
            </span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
            Upload your resume against target job requirements to instantly extract formatting compatibility, skill gaps, and AI rewrite recommendations.
          </p>
        </div>

        {/* Input Card Form */}
        <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-8 shadow-2xl shadow-indigo-950/20 mb-10">
          <div className="grid gap-6 mb-8">
            
            {/* File Dropzone */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <FileText size={16} className="text-indigo-400" /> Upload Resume (PDF)
              </label>
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer relative group ${
                  file 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                    file ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Upload size={26} />
                  </div>
                  {file ? (
                    <div>
                      <p className="text-base font-bold text-indigo-300">{file.name}</p>
                      <span className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for AI Parsing</span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-slate-200">Click to upload or drag & drop</p>
                      <span className="text-xs text-slate-500">PDF documents only (Up to 10MB)</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Job Description Textarea */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400" /> Target Job Description
              </label>
              <textarea 
                rows={4} 
                placeholder="Paste the target job description here to run deep semantic keyword analysis..." 
                value={jd} 
                onChange={(e) => setJd(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-y"
              />
            </div>

          </div>

          {/* Action Button */}
          <button 
            onClick={handleAnalyze} 
            disabled={loading}
            className={`w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 px-6 rounded-xl text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-[0.99] ${
              loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw size={20} className="animate-spin text-white" /> Analyzing Qualifications with AI...
              </>
            ) : (
              <>
                Run ATS Diagnostics <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        {result && (
          <div className="flex flex-col gap-6">
            
            {/* ATS Score Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-8 shadow-2xl">
              <div className="shrink-0">
                <div className={`w-28 h-28 rounded-full border-4 flex items-center justify-center ${getScoreColor(result.atsScore)}`}>
                  <span className="text-3xl font-black tracking-tight">
                    {result.atsScore}%
                  </span>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <TrendingUp size={16} className="text-indigo-400" /> Match Score
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {result.atsScore >= 80 ? 'Strong Candidate Alignment' : result.atsScore >= 60 ? 'Moderate Keyword Alignment' : 'Formatting & Skill Revisions Needed'}
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Your resume was processed through automated parsing models to evaluate technical keyword overlap and structural formatting compliance.
                </p>
              </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Matched Skills */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-5 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-200">Matching Qualifications</h3>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {result.matchingSkills?.map((skill, i) => (
                      <span key={i} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Missing Skills */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-5 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2">
                  <AlertCircle size={18} className="text-amber-400" />
                  <h3 className="text-sm font-bold text-slate-200">Missing Key Terms</h3>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills?.map((skill, i) => (
                      <span key={i} className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-lg text-xs font-semibold">
                        + {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden md:col-span-2">
                <div className="px-5 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2">
                  <Sparkles size={18} className="text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-200">Actionable AI Optimizations</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {result.improvements?.map((imp, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}