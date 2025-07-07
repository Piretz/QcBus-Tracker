// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Libreng Sakay QC. All rights reserved.
        </p>
        <p className="text-xs mt-1">Made with ❤️ for Quezon City commuters.</p>
      </div>
    </footer>
  );
}
