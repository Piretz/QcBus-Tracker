'use client';

import Navbar from '../components/navbar';
import Footer from '../components/footer';

const schedules = [
  {
    route: 'QC Hall to Cubao',
    stops: [
      'Quezon City Hall',
      'East Avenue Medical Center',
      'National Kidney Institute',
      'Philippine Heart Center',
      'EDSA-Kamuning',
      'Aurora Boulevard',
      'Cubao / Araneta Center',
    ],
    monday: '6:00 AM - 9:00 PM',
    tuesday: '6:00 AM - 9:00 PM',
    wednesday: '6:00 AM - 9:00 PM',
    thursday: '6:00 AM - 9:00 PM',
    friday: '6:00 AM - 9:00 PM',
    saturday: '6:30 AM - 8:30 PM',
    sunday: '8:00 AM - 8:00 PM',
  },
  {
    route: 'QC Hall to Litex/IBP',
    stops: [
      'Quezon City Hall',
      'Commonwealth Avenue',
      'Batasan Road',
      'Litex Market',
      'Payatas Road',
      'IBP Road',
    ],
    monday: '6:00 AM - 8:00 PM',
    tuesday: '6:00 AM - 8:00 PM',
    wednesday: '6:00 AM - 8:00 PM',
    thursday: '6:00 AM - 8:00 PM',
    friday: '6:00 AM - 8:00 PM',
    saturday: '6:30 AM - 7:30 PM',
    sunday: '8:00 AM - 7:00 PM',
  },
  {
    route: 'Welcome Rotonda to Katipunan',
    stops: [
      'Welcome Rotonda',
      'Quezon Avenue',
      'Quezon Memorial Circle',
      'Philcoa',
      'UP Campus',
      'Katipunan Avenue',
    ],
    monday: '6:00 AM - 9:30 PM',
    tuesday: '6:00 AM - 9:30 PM',
    wednesday: '6:00 AM - 9:30 PM',
    thursday: '6:00 AM - 9:30 PM',
    friday: '6:00 AM - 9:30 PM',
    saturday: '7:00 AM - 8:00 PM',
    sunday: '8:00 AM - 7:30 PM',
  },
];

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default function SchedulePage() {
  const today = new Date();
  const currentDay = days[today.getDay()];

  return (
    <>
      <Navbar />
      <main className="min-h-[85vh] bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4 py-12">
        <div className="max-w-6xl mx-auto text-center space-y-10">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-800 flex items-center justify-center gap-2">
              🕒 Libreng Sakay Bus Schedules
            </h1>
            <p className="text-gray-700 text-sm md:text-base mt-3 max-w-xl mx-auto">
              View operating hours for each route. <br />
              <span className="inline-flex items-center gap-1 text-blue-700 font-medium mt-1">
                <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                Today’s schedule is highlighted.
              </span>
            </p>
          </div>

          <div className="overflow-auto rounded-2xl border border-gray-300 shadow-xl backdrop-blur bg-white/80">
            <table className="min-w-full text-sm md:text-base table-fixed">
              <thead className="bg-blue-800 text-white sticky top-0 z-30">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold sticky left-0 z-40 bg-blue-800 w-64">
                    🛣️ Route & Stops
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className={`py-4 px-3 capitalize text-center font-medium ${
                        currentDay === day ? 'bg-blue-900 text-yellow-300' : ''
                      }`}
                    >
                      {day.slice(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-200 hover:bg-blue-50 transition duration-150 align-top"
                  >
                    <td className="py-4 px-6 text-left font-semibold text-gray-800 sticky left-0 bg-white z-20 border-r border-gray-200 w-64">
                      <div className="font-bold text-blue-900">{schedule.route}</div>
                      <ul className="text-sm text-gray-600 list-disc ml-5 mt-1 space-y-0.5">
                        {schedule.stops.map((stop, i) => (
                          <li key={i}>{stop}</li>
                        ))}
                      </ul>
                    </td>
                    {days.map((day) => (
                      <td
                        key={day}
                        className={`py-3 px-3 text-center align-middle ${
                          currentDay === day
                            ? 'bg-blue-50 font-semibold text-blue-800'
                            : 'text-gray-700'
                        }`}
                      >
                        {schedule[day as keyof typeof schedule]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-500 italic">
            📅 Last checked:{' '}
            <span className="text-gray-700 font-medium">
              {today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
