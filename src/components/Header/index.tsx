import { User } from "lucide-react";
import { Logo } from "../Logo";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo className="w-32" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={18} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
