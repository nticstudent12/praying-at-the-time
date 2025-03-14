
import { format } from 'date-fns';
import { Moon } from 'lucide-react';

const Header = () => {
  const today = new Date();
  const formattedDate = format(today, 'EEEE, MMMM d, yyyy');

  return (
    <header className="flex flex-col items-center py-6 space-y-2 text-center animate-slide-down">
      <div className="flex items-center justify-center mb-2">
        <Moon className="h-8 w-8 text-prayer-highlight mr-2" />
        <h1 className="text-3xl font-bold text-prayer-text">Salat Times</h1>
      </div>
      <p className="text-prayer-dark font-medium">{formattedDate}</p>
    </header>
  );
};

export default Header;
