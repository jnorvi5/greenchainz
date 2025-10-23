'use client';

import { useEffect, useState } from 'react';

interface LocalTimeChipProps {
  timeZone: string;
}

export function LocalTimeChip({ timeZone }: LocalTimeChipProps) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        setTime(formatter.format(new Date()));
      } catch (error) {
        console.error('Invalid time zone:', error);
        setTime('Invalid timezone');
      }
    };

    // Initial update
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [timeZone]);

  if (!time) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
      <span className="text-blue-500">🕐</span>
      <span>Local time: {time}</span>
    </div>
  );
}
