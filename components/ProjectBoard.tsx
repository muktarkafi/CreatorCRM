import React, { useState, useEffect } from 'react';
import { Project, ProjectStage, ProjectType } from '../types';
import { AIService } from '../services/ai';
import { PlayCircle, CheckCircle2, Clock, UploadCloud, FileText, Youtube, Eye, ExternalLink, Archive, Plus, X, GraduationCap, PlaySquare, Clapperboard, Sparkles, Loader2 } from 'lucide-react';

interface ProjectBoardProps {
  projects: Project[];
  onMoveProject: (projectId: string, newStage: ProjectStage) => void;
  onUpdateProject: (projectId: string, updates: Partial<Project>) => void;
  onArchiveProject: (projectId: string) => void;
  // New Props for Tutorials Mode
  mode?: 'PROJECTS' | 'TUTORIALS';
  onAddProject?: (project: Omit<Project, 'id' | 'progress' | 'archived'>) => void;
}

// Helper to get stage-specific color for urgency
const getStageColorClass = (stage: ProjectStage) => {
    switch (stage) {
        case ProjectStage.TOOL_ACCESS:
        case ProjectStage.CONCEPT:
            return 'bg-rose-500'; // High urgency / Start
        case ProjectStage.FILMING:
            return 'bg-orange-500';
        case ProjectStage.SCRIPTING:
            return 'bg-amber-400';
        case ProjectStage.EDITING:
            return 'bg-indigo-500';
        case ProjectStage.REVIEW:
            return 'bg-blue-500';
        case ProjectStage.FINAL_PAYMENT:
            return 'bg-emerald-400';
        case ProjectStage.PUBLISHED:
            return 'bg-emerald-600';
        default:
            return 'bg-slate-500';
    }
};

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
    <div className="flex gap-1 text-[10px] font-mono opacity-80 bg-slate-800/50 px-2 py-1 rounded">
        <span>{timeLeft.days}d</span>:
        <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
    </div>
  );
};

const ProjectBoard: React.FC<ProjectBoardProps> = ({ projects, onMoveProject, onUpdateProject, onArchiveProject, mode = 'PROJECTS', onAddProject }) => {
  
  // Define custom pipelines based on user request
  const SPONSORED_STAGES = [
    ProjectStage.TOOL_ACCESS,
    ProjectStage.FILMING,     // Filming before Scripting
    ProjectStage.SCRIPTING,
    ProjectStage.EDITING,
    ProjectStage.REVIEW,
    ProjectStage.FINAL_PAYMENT,
    ProjectStage.PUBLISHED
  ];

  const TUTORIAL_STAGES = [
    ProjectStage.CONCEPT,     // Instead of Tool Access
    ProjectStage.FILMING,     // Filming before Scripting
    ProjectStage.SCRIPTING,
    ProjectStage.EDITING,
    ProjectStage.PUBLISHED
    // Removed: Review, Final Payment
  ];

  const CURRENT_PIPELINE = mode === 'TUTORIALS' ? TUTORIAL_STAGES : SPONSORED_STAGES;

  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const [targetStage, setTargetStage] = useState<ProjectStage | null>(null);
  
  // Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('');

  // Script Viewer/Generator State
  const [viewingScriptProject, setViewingScriptProject] = useState<Project | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter projects based on mode
  const filteredProjects = projects.filter(p => {
      if (mode === 'TUTORIALS') return p.type === 'TUTORIAL';
      return p.type === 'SPONSORED';
  });

  // Visual Styles based on Mode
  const isTutorial = mode === 'TUTORIALS';
  const themeColor = isTutorial ? 'text-pink-400' : 'text-indigo-400';
  const themeBg = isTutorial ? 'bg-pink-500' : 'bg-indigo-500';
  const themeBorder = isTutorial ? 'border-pink-500' : 'border-indigo-500';

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
  
  const handleDrop = (e: React.DragEvent, stage: ProjectStage) => {
    e.preventDefault();
    setTargetStage(null);
    if (draggedProjectId) {
      onMoveProject(draggedProjectId, stage);
      setDraggedProjectId(null);
    }
  };

  const handleCreateTutorial = (e: React.FormEvent) => {
      e.preventDefault();
      if(onAddProject) {
          onAddProject({
              title: newTitle,
              brandName: newTopic || 'Self',
              type: 'TUTORIAL',
              stage: ProjectStage.CONCEPT,
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              upfrontPaid: true, // N/A for tutorials
              finalPaid: true,   // N/A for tutorials
              totalValue: 0
          });
          setNewTitle('');
          setNewTopic('');
          setIsModalOpen(false);
      }
  };

  const handleGenerateScript = async (project: Project) => {
      if(!project) return;
      setIsGenerating(true);
      try {
          const script = await AIService.generateScript(project.title, project.brandName, project.type);
          onUpdateProject(project.id, { scriptUrl: script }); // Storing text in scriptUrl for simplicity in this demo
      } catch (e: any) {
          alert(e.message);
      } finally {
          setIsGenerating(false);
      }
  };

  return (
    <div className={`p-6 h-full flex flex-col ${isTutorial ? 'bg-gradient-to-br from-slate-950 to-slate-900' : ''}`}>
       <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className={`text-2xl font-bold text-white flex items-center gap-3`}>
               {isTutorial ? <PlaySquare className="w-8 h-8 text-pink-500" /> : <Clapperboard className="w-8 h-8 text-indigo-500" />}
               {isTutorial ? 'Free Tutorials Manager' : 'Active Sponsored Projects'}
           </h2>
           <p className="text-slate-400 text-sm mt-1">
               {isTutorial 
                ? 'Create and track value-first content to grow your audience.' 
                : 'Track production from tool access to publishing.'}
           </p>
        </div>
        
        {isTutorial && (
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-pink-500/20 flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Create Tutorial
            </button>
        )}
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-6 h-full min-w-max px-2">
          {CURRENT_PIPELINE.map((stage) => {
             const stageProjects = filteredProjects.filter(p => p.stage === stage);
             const isTarget = targetStage === stage;
             
             return (
               <div 
                  key={stage} 
                  className={`w-80 flex flex-col h-full transition-all duration-300 rounded-2xl p-3 border ${
                      isTarget 
                      ? `${themeBg}/10 ${themeBorder}/50 shadow-[0_0_30px_rgba(0,0,0,0.3)]` 
                      : 'bg-slate-900/40 border-slate-800/60'
                  }`}
                  onDragOver={(e) => handleDragOver(e, stage)}
                  onDrop={(e) => handleDrop(e, stage)}
               >
                  <div className="mb-4 flex items-center gap-2 px-1">
                     <span className={`text-xs font-bold uppercase tracking-wider ${isTarget ? themeColor : 'text-slate-400'}`}>{stage}</span>
                     <div className={`h-px flex-1 ${isTarget ? `${themeBg}/50` : 'bg-slate-800'}`}></div>
                     <span className={`text-xs font-mono px-2 py-0.5 rounded ${isTarget ? `${themeBg} text-white` : 'text-slate-500 bg-slate-950'}`}>{stageProjects.length}</span>
                  </div>

                  <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar -mr-1 p-1">
                    {stageProjects.map(project => (
                      <div 
                        key={project.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, project.id)}
                        className={`
                            relative bg-slate-900 border border-slate-800 rounded-xl p-4 transition-all cursor-move group 
                            shadow-lg hover:shadow-lg hover:-translate-y-1
                            ${draggedProjectId === project.id ? `opacity-50 ring-2 ${themeBorder}` : ''}
                            ${isTutorial ? 'hover:shadow-pink-500/10 hover:border-pink-500/40' : 'hover:shadow-indigo-500/10 hover:border-indigo-500/40'}
                        `}
                      >
                        <div className="flex items-start justify-between mb-3">
                           <span className={`text-xs font-semibold ${themeColor} ${themeBg}/10 px-2 py-1 rounded border ${themeBorder}/20`}>
                               {project.brandName}
                           </span>
                           {!isTutorial && project.upfrontPaid && <span className="text-[10px] text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Paid</span>}
                        </div>
                        <h4 className="font-bold text-slate-200 text-sm leading-snug mb-3">{project.title}</h4>
                        
                        {stage !== ProjectStage.PUBLISHED && (
                            <div className="w-full bg-slate-950 h-1.5 rounded-full mb-4 overflow-hidden border border-slate-800">
                                <div 
                                    className={`${getStageColorClass(stage)} h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.3)]`} 
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

                        {/* Scripting Stage: AI Action */}
                        {stage === ProjectStage.SCRIPTING && (
                             <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center">
                                 {project.scriptUrl ? (
                                     <button 
                                        onClick={() => setViewingScriptProject(project)}
                                        className="text-xs flex items-center gap-1 text-amber-400 hover:text-amber-300"
                                     >
                                         <FileText className="w-3 h-3" /> View Script
                                     </button>
                                 ) : (
                                     <button 
                                        onClick={() => handleGenerateScript(project)}
                                        disabled={isGenerating}
                                        className={`
                                            w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 
                                            text-white text-xs font-bold py-1.5 rounded flex items-center justify-center gap-2 transition-all shadow-lg
                                            ${isGenerating ? 'opacity-70 cursor-wait' : ''}
                                        `}
                                     >
                                         {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                         {isGenerating ? 'Generating...' : 'Generate Script (AI)'}
                                     </button>
                                 )}
                             </div>
                        )}

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
                      </div>
                    ))}
                    
                    {stageProjects.length === 0 && (
                        <div className={`
                            h-32 border-2 border-dashed rounded-xl flex items-center justify-center text-slate-600 text-xs transition-colors
                            ${isTarget ? `${themeBorder}/50 ${themeBg}/5 ${themeColor}` : 'border-slate-800/50'}
                        `}>
                            {isTarget ? 'Drop here' : 'Empty'}
                        </div>
                    )}
                  </div>
               </div>
             )
          })}
        </div>
      </div>

      {/* Script Viewer Modal */}
      {viewingScriptProject && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm animate-fade-in p-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-full">
                  <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-amber-400" />
                          <h3 className="text-xl font-bold text-white">{viewingScriptProject.title} - Script</h3>
                      </div>
                      <button onClick={() => setViewingScriptProject(null)}><X className="text-slate-500 hover:text-white" /></button>
                  </div>
                  <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                      <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                          {viewingScriptProject.scriptUrl}
                      </pre>
                  </div>
                  <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
                      <button 
                        onClick={() => {
                             navigator.clipboard.writeText(viewingScriptProject.scriptUrl || '');
                             alert('Copied to clipboard!');
                        }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm"
                      >
                          Copy Text
                      </button>
                      <button 
                        onClick={() => {
                             // Re-generate
                             setViewingScriptProject(null);
                             handleGenerateScript(viewingScriptProject);
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm flex items-center gap-2"
                      >
                          <Sparkles className="w-4 h-4" /> Regenerate
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Create Tutorial Modal */}
      {isModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in">
             <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xl font-bold text-white">Create Free Tutorial</h3>
                     <button onClick={() => setIsModalOpen(false)}><X className="text-slate-500" /></button>
                 </div>
                 <form onSubmit={handleCreateTutorial} className="space-y-4">
                     <div>
                         <label className="text-xs text-slate-400 block mb-1">Tutorial Title</label>
                         <input 
                            required 
                            className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white" 
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="e.g. How to use Blender 4.0"
                        />
                     </div>
                     <div>
                         <label className="text-xs text-slate-400 block mb-1">Topic / Category</label>
                         <input 
                            required 
                            className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white" 
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                            placeholder="e.g. 3D Design"
                        />
                     </div>
                     <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-bold">Start Creating</button>
                 </form>
             </div>
          </div>
      )}
    </div>
  );
};

export default ProjectBoard;