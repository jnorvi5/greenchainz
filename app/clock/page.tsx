'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface WorldClock {
  city: string;
  timeZone: string;
  country: string;
}

const worldClocks: WorldClock[] = [
  { city: 'New York', timeZone: 'America/New_York', country: 'USA' },
  { city: 'Los Angeles', timeZone: 'America/Los_Angeles', country: 'USA' },
  { city: 'London', timeZone: 'Europe/London', country: 'UK' },
  { city: 'Paris', timeZone: 'Europe/Paris', country: 'France' },
  { city: 'Tokyo', timeZone: 'Asia/Tokyo', country: 'Japan' },
  { city: 'Sydney', timeZone: 'Australia/Sydney', country: 'Australia' },
  { city: 'Dubai', timeZone: 'Asia/Dubai', country: 'UAE' },
  { city: 'Singapore', timeZone: 'Asia/Singapore', country: 'Singapore' },
  { city: 'Hong Kong', timeZone: 'Asia/Hong_Kong', country: 'China' },
  { city: 'Mumbai', timeZone: 'Asia/Kolkata', country: 'India' },
  { city: 'Berlin', timeZone: 'Europe/Berlin', country: 'Germany' },
  { city: 'Toronto', timeZone: 'America/Toronto', country: 'Canada' },
];

function ClockCard({ city, timeZone, country }: WorldClock) {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        const dateFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone,
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
        setTime(timeFormatter.format(now));
        setDate(dateFormatter.format(now));
      } catch (error) {
        console.error('Invalid time zone:', error);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timeZone]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{city}</h3>
          <p className="text-sm text-gray-500">{country}</p>
        </div>
        <span className="text-2xl">🌍</span>
      </div>
      <div className="text-3xl font-mono font-bold text-green-600 mb-2">
        {time || '--:--:--'}
      </div>
      <div className="text-sm text-gray-600">
        {date || 'Loading...'}
      </div>
    </div>
  );
}

export default function WorldClockPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-green-600 hover:text-green-800 mb-4"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🌐 World Clock
          </h1>
          <p className="text-lg text-gray-600">
            Check the current time across major cities and supplier locations worldwide
          </p>
        </div>

        {/* Clock Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {worldClocks.map((clock) => (
            <ClockCard key={clock.timeZone} {...clock} />
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            💡 About World Clock
          </h2>
          <p className="text-gray-700">
            Use this tool to coordinate with suppliers across different time zones. 
            When viewing a supplier profile with a configured time zone, you'll see their local time displayed automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
