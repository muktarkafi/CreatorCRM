import React, { useState } from 'react';
import { Course, Chapter, ProjectStage } from '../types';
import { Plus, ChevronDown, ChevronRight, GraduationCap, X, CheckCircle2, PlayCircle, BookOpen, Trash2 } from 'lucide-react';

interface CourseBoardProps {
    courses: Course[];
    onAddCourse: (course: Omit<Course, 'id' | 'chapters' | 'progress'>) => void;
    onUpdateCourse: (courseId: string, updates: Partial<Course>) => void;
    onAddChapter: (courseId: string, title: string) => void;
    onUpdateChapter: (courseId: string, chapterId: string, updates: Partial<Chapter>) => void;
    onDeleteCourse: (courseId: string) => void;
}

// Custom Pipeline for Course Chapters (Same as Tutorials)
const CHAPTER_STAGES = [
    ProjectStage.CONCEPT,
    ProjectStage.FILMING,     // Filming before Scripting as per request
    ProjectStage.SCRIPTING,
    ProjectStage.EDITING,
    ProjectStage.PUBLISHED
];

const CourseBoard: React.FC<CourseBoardProps> = ({ courses, onAddCourse, onUpdateCourse, onAddChapter, onUpdateChapter, onDeleteCourse }) => {
    const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCourseData, setNewCourseData] = useState({ title: '', description: '', totalChapters: 5 });
    
    // Local state for new chapter input
    const [newChapterTitle, setNewChapterTitle] = useState('');

    const toggleExpand = (id: string) => {
        setExpandedCourse(expandedCourse === id ? null : id);
    };

    const handleCreateCourse = (e: React.FormEvent) => {
        e.preventDefault();
        onAddCourse(newCourseData);
        setIsAddModalOpen(false);
        setNewCourseData({ title: '', description: '', totalChapters: 5 });
    };

    const handleAddChapterSubmit = (e: React.FormEvent, courseId: string) => {
        e.preventDefault();
        if(newChapterTitle.trim()) {
            onAddChapter(courseId, newChapterTitle);
            setNewChapterTitle('');
        }
    };

    // Calculate specific color based on stage urgency
    const getStageColor = (stage: ProjectStage) => {
        switch (stage) {
            case ProjectStage.CONCEPT:
                return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            case ProjectStage.FILMING:
                return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            case ProjectStage.SCRIPTING:
                return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case ProjectStage.EDITING:
                return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case ProjectStage.PUBLISHED:
                return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            default:
                return 'text-slate-400 bg-slate-800 border-slate-700';
        }
    };

    return (
        <div className="p-8 h-full flex flex-col overflow-y-auto custom-scrollbar bg-slate-950">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <GraduationCap className="w-8 h-8 text-blue-500" />
                        Course Manager
                    </h2>
                    <p className="text-slate-400 mt-1">Plan, produce, and track your educational courses chapter by chapter.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    New Course
                </button>
            </div>

            <div className="space-y-6">
                {courses.length === 0 && (
                    <div className="h-64 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-500">
                        <GraduationCap className="w-12 h-12 mb-4 opacity-50" />
                        <p>No courses started yet.</p>
                        <p className="text-sm">Create a course to begin structuring your curriculum.</p>
                    </div>
                )}

                {courses.map(course => (
                    <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl">
                        {/* Course Header */}
                        <div 
                            className="p-6 cursor-pointer hover:bg-slate-800/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
                            onClick={() => toggleExpand(course.id)}
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-white">{course.title}</h3>
                                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                                        {course.chapters.length} / {course.totalChapters} Chapters
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400">{course.description}</p>
                            </div>

                            <div className="flex items-center gap-8 w-full md:w-1/2">
                                <div className="flex-1">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-400">Production Progress</span>
                                        <span className="text-blue-400 font-mono">{course.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                                        <div 
                                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                     <button 
                                        onClick={(e) => { e.stopPropagation(); onDeleteCourse(course.id); }}
                                        className="text-slate-600 hover:text-red-500 p-2"
                                        title="Delete Course"
                                     >
                                         <Trash2 className="w-5 h-5" />
                                     </button>
                                     <ChevronDown className={`w-6 h-6 text-slate-500 transition-transform ${expandedCourse === course.id ? 'rotate-180' : ''}`} />
                                </div>
                            </div>
                        </div>

                        {/* Expanded Content (Chapters) */}
                        {expandedCourse === course.id && (
                            <div className="bg-slate-950/50 border-t border-slate-800 p-6 animate-fade-in">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {course.chapters.map((chapter, index) => (
                                        <div key={chapter.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between group hover:border-blue-500/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-mono text-slate-500 border border-slate-700">
                                                    {index + 1}
                                                </span>
                                                <div>
                                                    <input 
                                                        className="bg-transparent border-none text-slate-200 font-medium text-sm focus:ring-0 p-0 w-full"
                                                        value={chapter.title}
                                                        onChange={(e) => onUpdateChapter(course.id, chapter.id, { title: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                {/* Status Selector */}
                                                <select 
                                                    value={chapter.stage}
                                                    onChange={(e) => onUpdateChapter(course.id, chapter.id, { stage: e.target.value as ProjectStage })}
                                                    className={`
                                                        text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded cursor-pointer outline-none border
                                                        ${getStageColor(chapter.stage)}
                                                    `}
                                                >
                                                    {CHAPTER_STAGES.map(s => <option key={s} value={s} className="bg-slate-900 text-slate-300">{s}</option>)}
                                                </select>
                                                
                                                {/* Delete Chapter */}
                                                <button 
                                                    onClick={() => {
                                                        const updatedChapters = course.chapters.filter(c => c.id !== chapter.id);
                                                        onUpdateCourse(course.id, { chapters: updatedChapters });
                                                    }}
                                                    className="text-slate-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {/* Add Chapter Button */}
                                    <form 
                                        onSubmit={(e) => handleAddChapterSubmit(e, course.id)}
                                        className="bg-slate-900/50 border border-dashed border-slate-700 p-4 rounded-xl flex items-center gap-3 hover:bg-slate-900 transition-colors"
                                    >
                                        <Plus className="w-5 h-5 text-slate-500" />
                                        <input 
                                            placeholder="Add new chapter title..."
                                            className="bg-transparent border-none text-sm text-white placeholder-slate-500 focus:ring-0 flex-1"
                                            value={newChapterTitle}
                                            onChange={(e) => setNewChapterTitle(e.target.value)}
                                        />
                                        <button type="submit" className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 hover:text-white">Add</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Create Course Modal */}
            {isAddModalOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Create New Course</h3>
                            <button onClick={() => setIsAddModalOpen(false)}><X className="text-slate-500 hover:text-white" /></button>
                        </div>
                        <form onSubmit={handleCreateCourse} className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Course Title</label>
                                <input 
                                    required
                                    className="w-full bg-slate-800 border-slate-700 rounded-lg p-2.5 text-white"
                                    value={newCourseData.title}
                                    onChange={(e) => setNewCourseData({...newCourseData, title: e.target.value})}
                                    placeholder="e.g. Master React 2024"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Description</label>
                                <textarea 
                                    className="w-full bg-slate-800 border-slate-700 rounded-lg p-2.5 text-white h-24 resize-none"
                                    value={newCourseData.description}
                                    onChange={(e) => setNewCourseData({...newCourseData, description: e.target.value})}
                                    placeholder="Brief summary..."
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Planned Chapters</label>
                                <input 
                                    type="number"
                                    min="1"
                                    className="w-full bg-slate-800 border-slate-700 rounded-lg p-2.5 text-white"
                                    value={newCourseData.totalChapters}
                                    onChange={(e) => setNewCourseData({...newCourseData, totalChapters: parseInt(e.target.value)})}
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold mt-2">
                                Start Planning
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseBoard;