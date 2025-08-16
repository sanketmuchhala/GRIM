import React, { useState } from 'react';
import { Seat } from '../game/types';

interface NameEditorProps {
  seat: Seat;
  currentName: string;
  onNameChange: (seat: Seat, name: string) => void;
  isBot?: boolean;
  onToggleBot?: (seat: Seat) => void;
  disabled?: boolean;
}

const NameEditor: React.FC<NameEditorProps> = ({
  seat,
  currentName,
  onNameChange,
  isBot = false,
  onToggleBot,
  disabled = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(currentName);

  const handleSave = () => {
    if (tempName.trim()) {
      onNameChange(seat, tempName.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName(currentName);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (disabled) {
    return (
      <div className="text-center">
        <div className="text-white font-medium">{currentName}</div>
        <div className="text-xs text-slate-400">Seat {seat}</div>
        {isBot && (
          <div className="text-xs text-blue-400">BOT</div>
        )}
      </div>
    );
  }

  return (
    <div className="text-center space-y-2">
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full px-2 py-1 text-sm text-black rounded"
            placeholder="Enter name"
            autoFocus
          />
          <div className="flex space-x-1">
            <button
              onClick={handleSave}
              className="flex-1 text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
            >
              ✓
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
            >
              ✗
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-white font-medium hover:text-blue-400 transition-colors"
          >
            {currentName}
          </button>
          <div className="text-xs text-slate-400">Seat {seat}</div>
          
          {onToggleBot && (
            <button
              onClick={() => onToggleBot(seat)}
              className={`text-xs px-2 py-1 rounded mt-1 transition-colors ${
                isBot 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              {isBot ? 'BOT' : 'HUMAN'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NameEditor;