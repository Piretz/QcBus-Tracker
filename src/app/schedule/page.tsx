'use client';
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const schedules = [
  {
    route: 'QC Hall to Cubao',
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
      <main className="min-h-[85vh] bg-gradient-to-br from-blue-100 to-white px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-3 flex items-center justify-center gap-2">
            🕒 Libreng Sakay Bus Schedules
          </h1>
          <p className="text-gray-700 mb-10 text-sm md:text-base max-w-2xl mx-auto">
            Check real-time operating hours for each route. Today’s schedule is <span className="font-semibold text-blue-700">highlighted</span>.
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-lg">
            <table className="min-w-full bg-white text-sm md:text-sm lg:text-base">
              <thead>
                <tr className="bg-blue-700 text-white text-left">
                  <th className="py-4 px-5 text-base font-semibold whitespace-nowrap">🛣️ Route</th>
                  {days.map(day => (
                    <th
                      key={day}
                      className={`py-4 px-5 capitalize text-sm font-medium tracking-wide ${
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
                    className="border-t border-gray-200 hover:bg-blue-50 transition duration-150"
                  >
                    <td className="py-3 px-5 font-semibold text-gray-800">{schedule.route}</td>
                    {days.map(day => (
                      <td
                        key={day}
                        className={`py-3 px-5 text-gray-700 text-sm text-center ${
                          currentDay === day ? 'font-bold text-blue-800 bg-blue-50' : ''
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

          <p className="mt-6 text-sm text-gray-500 italic">
            📅 Last checked:{" "}
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
