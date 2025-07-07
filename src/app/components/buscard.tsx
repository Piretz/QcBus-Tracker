// components/BusCard.tsx
import { FC } from 'react';

interface BusCardProps {
  routeName: string;
  stops: string[];
  schedule: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
}

const BusCard: FC<BusCardProps> = ({ routeName, stops, schedule }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-all duration-200">
      <h2 className="text-xl font-bold text-blue-700 mb-2">{routeName}</h2>
      <p className="font-semibold text-sm text-gray-700">Stops:</p>
      <ul className="list-disc list-inside text-sm text-gray-600 mb-3">
        {stops.map((stop, index) => (
          <li key={index}>{stop}</li>
        ))}
      </ul>
      <div className="text-sm text-gray-700 space-y-1">
        <p><span className="font-medium">Weekday:</span> {schedule.weekday}</p>
        <p><span className="font-medium">Saturday:</span> {schedule.saturday}</p>
        <p><span className="font-medium">Sunday:</span> {schedule.sunday}</p>
      </div>
    </div>
  );
};

export default BusCard;
