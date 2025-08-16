import React, { useEffect, useRef } from 'react';

interface EventLogProps {
  events: string[];
  maxHeight?: number;
}

const EventLog: React.FC<EventLogProps> = ({ 
  events, 
  maxHeight = 200 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-3">
        Event Log
      </h3>
      
      <div 
        ref={scrollRef}
        className="overflow-y-auto text-sm space-y-1"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        {events.length === 0 ? (
          <div className="text-slate-400 italic">
            No events yet...
          </div>
        ) : (
          events.map((event, index) => (
            <div 
              key={index}
              className="text-slate-300 py-1 border-b border-slate-700/50 last:border-b-0"
            >
              {event}
            </div>
          ))
        )}
      </div>
      
      {events.length > 10 && (
        <div className="mt-2 text-xs text-slate-400 text-center">
          {events.length} total events
        </div>
      )}
    </div>
  );
};

export default EventLog;