import React from 'react';
import { Project } from '../types';
import { Youtube, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';

interface FinishedProjectsProps {
  projects: Project[];
}

const FinishedProjects: React.FC<FinishedProjectsProps> = ({ projects }) => {
  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-3xl font-bold text-white">Finished Projects</h2>
           <p className="text-slate-400 mt-1">Archive of all published and completed collaborations.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-slate-400 text-sm">
            Total Finished: <span className="text-white font-bold">{projects.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-4 custom-scrollbar">
         {projects.length === 0 && (
             <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
                 <p>No archived projects yet.</p>
                 <p className="text-sm mt-2">Publish projects and click "Archive" to move them here.</p>
             </div>
         )}
         
         {projects.map(project => (
             <div key={project.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors group">
                 {/* Thumbnail Placeholder or Preview */}
                 <div className="h-32 bg-slate-800 flex items-center justify-center relative">
                    <Youtube className="w-12 h-12 text-slate-700 group-hover:text-red-500 transition-colors" />
                    {project.videoUrl && (
                        <a 
                            href={project.videoUrl}
                            target="_blank"
                            rel="noreferrer" 
                            className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-colors"
                            title="Watch Video"
                        >
                            <span className="sr-only">Watch</span>
                        </a>
                    )}
                 </div>
                 
                 <div className="p-5">
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">{project.brandName}</span>
                        <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                        </div>
                     </div>
                     
                     <h3 className="font-bold text-white mb-4 line-clamp-2 min-h-[3rem]">{project.title}</h3>
                     
                     <div className="space-y-2 text-sm text-slate-400">
                         <div className="flex items-center gap-2">
                             <Calendar className="w-4 h-4 text-slate-600" />
                             <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <DollarSign className="w-4 h-4 text-slate-600" />
                             <span>${project.totalValue.toLocaleString()}</span>
                         </div>
                     </div>

                     <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                        {project.videoUrl ? (
                             <a 
                                href={project.videoUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
                             >
                                 <Youtube className="w-4 h-4" />
                                 Watch on YouTube
                             </a>
                        ) : (
                            <span className="text-xs text-slate-600">No URL</span>
                        )}
                     </div>
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
};

export default FinishedProjects;