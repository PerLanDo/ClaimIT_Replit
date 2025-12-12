import { useState } from 'react';
import { BottomNavigation } from '../BottomNavigation';

export default function BottomNavigationExample() {
  const [active, setActive] = useState<'home' | 'search' | 'report' | 'messages' | 'profile'>('home');

  return (
    <div className="relative h-20">
      <BottomNavigation
        activeItem={active}
        onItemClick={setActive}
        messageCount={2}
      />
    </div>
  );
}
