import React, { useState } from 'react';
import { Deal, DealStage } from '../types';
import { MoreHorizontal, Calendar, DollarSign, Mail, AlertTriangle, ChevronRight, ChevronLeft, Plus, X, Pencil, Trash2, RefreshCcw } from 'lucide-react';

interface DealBoardProps {
  deals: Deal[];
  onMoveDeal: (dealId: string, newStage: DealStage) => void;
  onAddDeal: (deal: Omit<Deal, 'id' | 'stage' | 'lastActivity'>) => void;
  onUpdateDeal: (dealId: string, updates: Partial<Deal>) => void;
  onRemoveDeal: (dealId: string) => void;
}

const STAGES = [
  DealStage.NEW_INQUIRY,
  DealStage.RATE_SENT,
  DealStage.NEGOTIATION,
  DealStage.ACCEPTED_AWAITING_UPFRONT,
  DealStage.UPFRONT_RECEIVED,
];

const STAGE_COLORS: Record<DealStage, string> = {
  [DealStage.NEW_INQUIRY]: 'border-blue-500/50',
  [DealStage.RATE_SENT]: 'border-purple-500/50',
  [DealStage.NEGOTIATION]: 'border-orange-500/50',
  [DealStage.ACCEPTED_AWAITING_UPFRONT]: 'border-rose-500', 
  [DealStage.UPFRONT_RECEIVED]: 'border-emerald-500/50',
  [DealStage.REJECTED]: 'border-slate-700',
  [DealStage.CANCELLED]: 'border-slate-800',
};

// Date helper to prevent Invalid Date errors
const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString();
};

const DealBoard: React.FC<DealBoardProps> = ({ deals, onMoveDeal, onAddDeal, onUpdateDeal, onRemoveDeal }) => {
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [showCancelled, setShowCancelled] = useState(false);
  
  // Modal State
  const [modalType, setModalType] = useState<'ADD' | 'EDIT' | null>(null);
  const [editingDealId, setEditingDealId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    toolName: '',
    value: 0,
    expectedPublishDate: ''
  });

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    setDraggedDealId(dealId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    if (draggedDealId) {
      onMoveDeal(draggedDealId, stage);
      setDraggedDealId(null);
    }
  };

  const openAddModal = () => {
    setModalType('ADD');
    setFormData({
        toolName: '',
        value: 0,
        expectedPublishDate: ''
    });
  };

  const openEditModal = (deal: Deal) => {
      setModalType('EDIT');
      setEditingDealId(deal.id);
      setFormData({
          toolName: deal.toolName,
          value: deal.value,
          expectedPublishDate: deal.expectedPublishDate || ''
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalType === 'ADD') {
        onAddDeal({
            brandName: '', 
            toolName: formData.toolName,
            contactEmail: '', 
            value: formData.value,
            expectedPublishDate: formData.expectedPublishDate
        });
    } else if (modalType === 'EDIT' && editingDealId) {
        onUpdateDeal(editingDealId, {
            value: formData.value,
            expectedPublishDate: formData.expectedPublishDate
        });
    }

    setModalType(null);
    setEditingDealId(null);
  };

  // Helper function to handle cancellation/deletion
  const handleCancelDeal = (dealId: string) => {
      onMoveDeal(dealId, DealStage.CANCELLED);
  };

  const cancelledDeals = deals.filter(d => d.stage === DealStage.CANCELLED);

  return (
    <div className="p-6 h-full flex flex-col overflow-hidden relative">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
           <h2 className="text-2xl font-bold text-white">Collaboration Pipeline</h2>
           <p className="text-slate-400 text-sm">Drag deals to update status.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Inquiry
        </button>
      </div>
      
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start h-full mb-4">
        {STAGES.map((stage) => {
          const stageDeals = deals.filter(d => d.stage === stage);
          const isWarningStage = stage === DealStage.ACCEPTED_AWAITING_UPFRONT;

          return (
            <div 
              key={stage}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
              className={`flex-shrink-0 w-80 flex flex-col h-full rounded-xl bg-slate-900/50 border ${isWarningStage ? 'border-rose-500/20 bg-rose-500/5' : 'border-slate-800'}`}
            >
              <div className={`p-4 border-b ${isWarningStage ? 'border-rose-500/20' : 'border-slate-800'} flex justify-between items-center bg-slate-900/80 rounded-t-xl sticky top-0 backdrop-blur-sm z-10`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isWarningStage ? 'bg-rose-500' : 'bg-slate-400'}`}></span>
                  <h3 className={`font-semibold text-sm ${isWarningStage ? 'text-rose-200' : 'text-slate-300'}`}>{stage}</h3>
                </div>
                <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded-md">{stageDeals.length}</span>
              </div>

              <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                {stageDeals.length === 0 && (
                   <div className="h-24 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-600 text-xs">
                     No deals
                   </div>
                )}
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal.id)}
                    className={`bg-slate-800 p-4 rounded-xl border-l-4 ${STAGE_COLORS[stage]} shadow-sm hover:shadow-md hover:bg-slate-750 transition-all cursor-move group relative`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-white text-sm">{deal.brandName}</h4>
                      <div className="flex gap-1">
                          <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(deal);
                            }}
                            className="text-slate-500 hover:text-indigo-400 p-1 rounded hover:bg-slate-700 transition-colors"
                            title="Edit Deal"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCancelDeal(deal.id);
                            }}
                            className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-700 transition-colors"
                            title="Move to Cancelled"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-indigo-300 font-medium mb-3">{deal.toolName}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <DollarSign className="w-3 h-3 text-slate-500" />
                        <span>${deal.value.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>Est: {formatDate(deal.expectedPublishDate)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1">
                             {stage !== STAGES[0] && (
                                <button 
                                    onClick={() => onMoveDeal(deal.id, STAGES[STAGES.indexOf(stage) - 1])}
                                    className="p-1 hover:bg-slate-700 rounded" title="Move Back">
                                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                                </button>
                             )}
                              {stage !== STAGES[STAGES.length - 1] && (
                                <button 
                                    onClick={() => onMoveDeal(deal.id, STAGES[STAGES.indexOf(stage) + 1])}
                                    className="p-1 hover:bg-slate-700 rounded" title="Move Forward">
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </button>
                             )}
                        </div>
                    </div>

                    {isWarningStage && (
                        <div className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-lg animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancelled Deals Section */}
      <div className="mt-auto border-t border-slate-800 pt-4 shrink-0">
          <button 
            onClick={() => setShowCancelled(!showCancelled)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm font-medium mb-3"
          >
              <Trash2 className="w-4 h-4" />
              Cancelled History ({cancelledDeals.length})
              <ChevronRight className={`w-4 h-4 transition-transform ${showCancelled ? 'rotate-90' : ''}`} />
          </button>
          
          {showCancelled && (
              <div className="bg-slate-900/50 rounded-xl p-4 flex gap-4 overflow-x-auto h-40 custom-scrollbar border border-slate-800">
                  {cancelledDeals.length === 0 && <span className="text-slate-600 text-sm">No cancelled deals.</span>}
                  {cancelledDeals.map(deal => (
                      <div key={deal.id} className="min-w-[200px] bg-slate-800 p-3 rounded-lg border border-slate-700 opacity-70 hover:opacity-100 transition-opacity">
                          <div className="flex justify-between items-start">
                             <h4 className="text-slate-300 text-sm font-bold line-through">{deal.brandName}</h4>
                             <button 
                                onClick={() => onMoveDeal(deal.id, DealStage.NEW_INQUIRY)}
                                title="Restore Deal"
                                className="text-emerald-500 hover:bg-slate-700 p-1 rounded"
                             >
                                 <RefreshCcw className="w-3 h-3" />
                             </button>
                          </div>
                          <p className="text-xs text-slate-500">{deal.toolName}</p>
                          <p className="text-xs text-slate-500 mt-2">Value: ${deal.value}</p>
                      </div>
                  ))}
              </div>
          )}
      </div>

      {/* Shared Modal (Add / Edit) */}
      {modalType && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                  {modalType === 'ADD' ? 'Add New Collaboration' : 'Edit Deal Details'}
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {modalType === 'ADD' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Tool Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      value={formData.toolName}
                      onChange={(e) => setFormData({...formData, toolName: e.target.value})}
                      placeholder="e.g. Nexus Generative Suite"
                    />
                  </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Deal Value ($)</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      value={formData.value || ''}
                      onChange={(e) => setFormData({...formData, value: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Est. Publish Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      value={formData.expectedPublishDate}
                      onChange={(e) => setFormData({...formData, expectedPublishDate: e.target.value})}
                    />
                  </div>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                 <button 
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                 >
                   Cancel
                 </button>
                 <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-indigo-500/20"
                 >
                   {modalType === 'ADD' ? 'Add Inquiry' : 'Save Changes'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealBoard;