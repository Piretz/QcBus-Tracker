export default function handler(req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { id: number; name: string; stops: { name: string; etaSeconds: number; realTime: string; }[]; }[]): void; new(): any; }; }; }) {
  // Get current timestamp to simulate real-time data
  const currentTime = Date.now();

  res.status(200).json([
    {
      id: 1,
      name: "QC Hall to Cubao",
      stops: [
        { name: "QC Hall", etaSeconds: 120, realTime: new Date(currentTime + 120000).toLocaleTimeString() },
        { name: "EDSA-Kamuning", etaSeconds: 300, realTime: new Date(currentTime + 300000).toLocaleTimeString() },
        { name: "Cubao Terminal", etaSeconds: 600, realTime: new Date(currentTime + 600000).toLocaleTimeString() },
      ],
    },
    {
      id: 2,
      name: "QC Hall to Litex/IBP",
      stops: [
        { name: "QC Hall", etaSeconds: 90, realTime: new Date(currentTime + 90000).toLocaleTimeString() },
        { name: "Commonwealth", etaSeconds: 480, realTime: new Date(currentTime + 480000).toLocaleTimeString() },
        { name: "Litex", etaSeconds: 720, realTime: new Date(currentTime + 720000).toLocaleTimeString() },
        { name: "IBP Road", etaSeconds: 900, realTime: new Date(currentTime + 900000).toLocaleTimeString() },
      ],
    },
    {
      id: 3,
      name: "Welcome Rotonda to Katipunan",
      stops: [
        { name: "Welcome Rotonda", etaSeconds: 150, realTime: new Date(currentTime + 150000).toLocaleTimeString() },
        { name: "España", etaSeconds: 320, realTime: new Date(currentTime + 320000).toLocaleTimeString() },
        { name: "Aurora Blvd", etaSeconds: 500, realTime: new Date(currentTime + 500000).toLocaleTimeString() },
        { name: "Katipunan", etaSeconds: 700, realTime: new Date(currentTime + 700000).toLocaleTimeString() },
      ],
    },
  ]);
}
