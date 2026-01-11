import React, { useState, useEffect } from 'react';
import { Project, ProjectStage } from '../types';
import { PlayCircle, CheckCircle2, Clock, UploadCloud, FileText, Youtube, Eye, ExternalLink, Archive } from 'lucide-react';

interface ProjectBoardProps {
  projects: Project[];
  onMoveProject: (projectId: string, newStage: ProjectStage) => void;
  onUpdateProject: (projectId: string, updates: Partial<Project>) => void;
  onArchiveProject: (projectId: string) => void;
}

const CountdownTimer: React.FC<{ dueDate: string }> = ({ dueDate }) => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(dueDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsOverdue(false);
      } else {
        setTimeLeft(null);
        setIsOverdue(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [dueDate]);

  if (isOverdue) {
    return <span className="text-red-400 font-bold">Overdue!</span>;
  }

  if (!timeLeft) return <span className="text-slate-500">Loading...</span>;

  return (
    <div className="flex gap-1 text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded">
        <span>{timeLeft.days}d</span>:
        <span>{String(timeLeft.hours).padStart(2, '0')}h</span>:
        <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>:
        <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
    </div>
  );
};

const ProjectBoard: React.FC<ProjectBoardProps> = ({ projects, onMoveProject, onUpdateProject, onArchiveProject }) => {
  const STAGES = Object.values(ProjectStage);
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const [targetStage, setTargetStage] = useState<ProjectStage | null>(null);

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    setDraggedProjectId(projectId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, stage: ProjectStage) => {
    e.preventDefault();
    if (draggedProjectId && targetStage !== stage) {
        setTargetStage(stage);
    }
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
      // Logic to clear target if leaving the board area generally, 
      // but individual column leave is handled by the new Over
  };

  const handleDrop = (e: React.DragEvent, stage: ProjectStage) => {
    e.preventDefault();
    setTargetStage(null);
    if (draggedProjectId) {
      onMoveProject(draggedProjectId, stage);
      setDraggedProjectId(null);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-white">Active Projects</h2>
           <p className="text-slate-400 text-sm">Track production from tool access to publishing.</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-6 h-full min-w-max px-2">
          {STAGES.map((stage) => {
             const stageProjects = projects.filter(p => p.stage === stage);
             const isTarget = targetStage === stage;
             
             return (
               <div 
                  key={stage} 
                  className={`w-80 flex flex-col h-full transition-all duration-300 rounded-2xl p-3 border ${
                      isTarget 
                      ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]' 
                      : 'bg-slate-900/40 border-slate-800/60'
                  }`}
                  onDragOver={(e) => handleDragOver(e, stage)}
                  onDrop={(e) => handleDrop(e, stage)}
               >
                  <div className="mb-4 flex items-center gap-2 px-1">
                     <span className={`text-xs font-bold uppercase tracking-wider ${isTarget ? 'text-indigo-300' : 'text-slate-400'}`}>{stage}</span>
                     <div className={`h-px flex-1 ${isTarget ? 'bg-indigo-500/50' : 'bg-slate-800'}`}></div>
                     <span className={`text-xs font-mono px-2 py-0.5 rounded ${isTarget ? 'bg-indigo-500 text-white' : 'text-slate-500 bg-slate-950'}`}>{stageProjects.length}</span>
                  </div>

                  <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar -mr-1 p-1">
                    {stageProjects.map(project => (
                      <div 
                        key={project.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, project.id)}
                        className={`
                            relative bg-slate-900 border border-slate-800 rounded-xl p-4 transition-all cursor-move group 
                            shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-500/40 hover:-translate-y-1
                            ${draggedProjectId === project.id ? 'opacity-50 ring-2 ring-indigo-500' : ''}
                        `}
                      >
                        <div className="flex items-start justify-between mb-3">
                           <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">{project.brandName}</span>
                           {project.upfrontPaid && <span className="text-[10px] text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Paid</span>}
                        </div>
                        <h4 className="font-bold text-slate-200 text-sm leading-snug mb-3">{project.title}</h4>
                        
                        {stage !== ProjectStage.PUBLISHED && (
                            <div className="w-full bg-slate-800 h-1.5 rounded-full mb-4 overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                                style={{ width: `${project.progress}%` }}
                            />
                            </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                           <div className="flex items-center gap-1 w-full">
                              <Clock className="w-3 h-3 shrink-0" />
                              {stage !== ProjectStage.PUBLISHED ? (
                                  <CountdownTimer dueDate={project.dueDate} />
                              ) : (
                                  <span className="text-slate-400">Published on {new Date(project.dueDate).toLocaleDateString()}</span>
                              )}
                           </div>
                        </div>

                        {/* Video URL Input for Published Stage */}
                        {stage === ProjectStage.PUBLISHED && (
                            <div className="mt-3 pt-3 border-t border-slate-800">
                                {project.videoUrl ? (
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <a 
                                                href={project.videoUrl} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-900/20"
                                            >
                                                <Youtube className="w-4 h-4" />
                                                Watch Video
                                            </a>
                                            <button 
                                                onClick={() => onUpdateProject(project.id, { videoUrl: undefined })}
                                                className="px-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-400"
                                                title="Edit Link"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => onArchiveProject(project.id)}
                                            className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-white hover:bg-slate-800 py-1.5 rounded text-xs transition-colors border border-dashed border-slate-700 hover:border-slate-500 mt-2"
                                        >
                                            <Archive className="w-3 h-3" />
                                            Archive to Finished
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Paste YouTube URL..."
                                            className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                                            onKeyDown={(e) => {
                                                if(e.key === 'Enter') {
                                                    onUpdateProject(project.id, { videoUrl: e.currentTarget.value });
                                                }
                                            }}
                                            onBlur={(e) => {
                                                if(e.target.value) onUpdateProject(project.id, { videoUrl: e.target.value });
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Shortcuts overlay */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             {/* Hint for drag */}
                             <div className="bg-slate-800/80 p-1 rounded text-slate-400 cursor-grab active:cursor-grabbing">
                                <span className="text-[10px]">::</span>
                             </div>
                        </div>
                      </div>
                    ))}
                    
                    {stageProjects.length === 0 && (
                        <div className={`
                            h-32 border-2 border-dashed rounded-xl flex items-center justify-center text-slate-600 text-xs transition-colors
                            ${isTarget ? 'border-indigo-500/50 bg-indigo-500/5 text-indigo-400' : 'border-slate-800/50'}
                        `}>
                            {isTarget ? 'Drop to move here' : 'Drop projects here'}
                        </div>
                    )}
                  </div>
               </div>
             )
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectBoard;