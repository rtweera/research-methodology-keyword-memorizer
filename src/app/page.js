'use client'

import React, { useState, useRef } from 'react';
import { Plus, Play, Edit3, Download, Upload, RotateCcw, Check, X, BookOpen } from 'lucide-react';

export default function Home() {
  const [mode, setMode] = useState('edit'); // 'edit' or 'play'
  const [keywords, setKeywords] = useState([]);
  const [baskets, setBaskets] = useState([]);
  const [draggedKeyword, setDraggedKeyword] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [playKeywords, setPlayKeywords] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [currentSubject, setCurrentSubject] = useState('Untitled Subject');
  const fileInputRef = useRef(null);

  const addKeyword = () => {
    const name = prompt('Enter keyword name:');
    if (name && name.trim()) {
      const newKeyword = {
        id: Date.now(),
        name: name.trim(),
        assignedBasket: null
      };
      setKeywords([...keywords, newKeyword]);
    }
  };

  const addBasket = () => {
    const name = prompt('Enter lesson/section name:');
    if (name && name.trim()) {
      const newBasket = {
        id: Date.now(),
        name: name.trim(),
        color: `hsl(${Math.random() * 360}, 70%, 85%)`
      };
      setBaskets([...baskets, newBasket]);
    }
  };

  const deleteKeyword = (keywordId) => {
    setKeywords(keywords.filter(k => k.id !== keywordId));
  };

  const deleteBasket = (basketId) => {
    setBaskets(baskets.filter(b => b.id !== basketId));
    setKeywords(keywords.map(k => 
      k.assignedBasket === basketId ? { ...k, assignedBasket: null } : k
    ));
  };

  const handleDragStart = (e, keyword) => {
    setDraggedKeyword(keyword);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, basketId) => {
    e.preventDefault();
    if (!draggedKeyword) return;

    if (mode === 'edit') {
      setKeywords(keywords.map(k => 
        k.id === draggedKeyword.id ? { ...k, assignedBasket: basketId } : k
      ));
    } else if (mode === 'play') {
      const correctBasket = keywords.find(k => k.id === draggedKeyword.id)?.assignedBasket;
      const isCorrect = correctBasket === basketId;
      
      if (isCorrect) {
        setPlayKeywords(playKeywords.filter(k => k.id !== draggedKeyword.id));
        setFeedback({ type: 'correct', message: '✓ Correct!' });
      } else {
        setMistakes(mistakes + 1);
        setFeedback({ type: 'incorrect', message: '✗ Try again!' });
      }
      
      setTimeout(() => setFeedback(null), 1500);
    }
    
    setDraggedKeyword(null);
  };

  const handleKeywordPoolDrop = (e) => {
    e.preventDefault();
    if (mode === 'edit' && draggedKeyword) {
      setKeywords(keywords.map(k => 
        k.id === draggedKeyword.id ? { ...k, assignedBasket: null } : k
      ));
    }
    setDraggedKeyword(null);
  };

  const exportData = () => {
    const data = {
      subject: currentSubject,
      keywords: keywords,
      baskets: baskets,
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSubject.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_keywords.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setCurrentSubject(data.subject || 'Imported Subject');
          setKeywords(data.keywords || []);
          setBaskets(data.baskets || []);
          setMistakes(0);
          setMode('edit');
        } catch (error) {
          alert('Error loading file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const startPlayMode = () => {
    if (keywords.length === 0 || baskets.length === 0) {
      alert('Please add keywords and baskets before starting play mode!');
      return;
    }
    
    const assignedKeywords = keywords.filter(k => k.assignedBasket !== null);
    if (assignedKeywords.length === 0) {
      alert('Please assign keywords to baskets before starting play mode!');
      return;
    }
    
    setPlayKeywords([...assignedKeywords]);
    setMistakes(0);
    setFeedback(null);
    setMode('play');
  };

  const resetPlayMode = () => {
    const assignedKeywords = keywords.filter(k => k.assignedBasket !== null);
    setPlayKeywords([...assignedKeywords]);
    setMistakes(0);
    setFeedback(null);
  };

  const getKeywordsInBasket = (basketId) => {
    return mode === 'edit' 
      ? keywords.filter(k => k.assignedBasket === basketId)
      : [];
  };

  const getUnassignedKeywords = () => {
    return mode === 'edit' 
      ? keywords.filter(k => k.assignedBasket === null)
      : playKeywords;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Keyword Memorization</h1>
                <p className="text-gray-600">{currentSubject}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <input
                type="file"
                ref={fileInputRef}
                onChange={importData}
                accept=".json"
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Load
              </button>
              
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Save
              </button>
              
              {mode === 'edit' ? (
                <button
                  onClick={startPlayMode}
                  className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <Play className="w-4 h-4" />
                  Play Mode
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={resetPlayMode}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    onClick={() => setMode('edit')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Mode
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`fixed top-20 right-6 px-6 py-3 rounded-lg shadow-lg z-50 ${
            feedback.type === 'correct' ? 'bg-green-500' : 'bg-red-500'
          } text-white font-medium`}>
            {feedback.message}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Keywords Pool */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {mode === 'edit' ? 'Keywords Pool' : 'Study Keywords'}
                </h2>
                {mode === 'edit' && (
                  <button
                    onClick={addKeyword}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                )}
              </div>
              
              <div 
                className="min-h-32 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
                onDragOver={handleDragOver}
                onDrop={handleKeywordPoolDrop}
              >
                <div className="space-y-2">
                  {getUnassignedKeywords().map(keyword => (
                    <div
                      key={keyword.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, keyword)}
                      className="group flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-move"
                    >
                      <span className="font-medium text-gray-700">{keyword.name}</span>
                      {mode === 'edit' && (
                        <button
                          onClick={() => deleteKeyword(keyword.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {getUnassignedKeywords().length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    {mode === 'edit' ? 'Drag keywords here or click Add to create new ones' : 
                     playKeywords.length === 0 ? 'Great! All keywords completed!' : 'Drag keywords to the correct baskets'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Baskets */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Lesson Baskets</h2>
                {mode === 'edit' && (
                  <button
                    onClick={addBasket}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Basket
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {baskets.map(basket => (
                  <div
                    key={basket.id}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-32"
                    style={{ backgroundColor: basket.color }}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, basket.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">{basket.name}</h3>
                      {mode === 'edit' && (
                        <button
                          onClick={() => deleteBasket(basket.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {getKeywordsInBasket(basket.id).map(keyword => (
                        <div
                          key={keyword.id}
                          draggable={mode === 'edit'}
                          onDragStart={(e) => mode === 'edit' && handleDragStart(e, keyword)}
                          className={`p-2 bg-white bg-opacity-80 rounded-lg shadow-sm border border-gray-200 ${
                            mode === 'edit' ? 'cursor-move hover:shadow-md transition-shadow' : ''
                          }`}
                        >
                          <span className="text-sm font-medium text-gray-700">{keyword.name}</span>
                        </div>
                      ))}
                    </div>
                    
                    {getKeywordsInBasket(basket.id).length === 0 && (
                      <div className="text-center text-gray-600 text-sm py-4 italic">
                        Drop keywords here
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {baskets.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-lg mb-2">No lesson baskets yet</div>
                  <div className="text-sm">Click "Add Basket" to create your first lesson section</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        {mode === 'play' && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{mistakes}</div>
                  <div className="text-sm text-gray-600">Mistakes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{keywords.filter(k => k.assignedBasket !== null).length - playKeywords.length}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{playKeywords.length}</div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </div>
              </div>
              
              {playKeywords.length === 0 && (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-6 h-6" />
                  <span className="font-semibold">Study Complete!</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}