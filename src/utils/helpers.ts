import { useState, useEffect } from 'react';

type Movement = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  cameraToggle: boolean;
  jump: boolean;
  sprint: boolean;
  debug: boolean;
};

export const usePlayerControls = (): Movement => {
  const keys: { [key: string]: keyof Movement } = {
    KeyW: 'forward',
    KeyS: 'backward',
    KeyA: 'left',
    KeyD: 'right',
    KeyP: 'cameraToggle',
    Space: 'jump',
    ShiftLeft: 'sprint',
    Backquote: 'debug'
  };
  const moveFieldByKey = (key: string): keyof Movement => keys[key];

  const [movement, setMovement] = useState<Movement>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    cameraToggle: true,
    jump: false,
    sprint: false,
    debug: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const field = moveFieldByKey(e.code);
      setMovement((m) => ({
        ...m,
        [field]: field === 'cameraToggle' ? !m.cameraToggle : true,
      }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const field = moveFieldByKey(e.code);
      if (field !== 'cameraToggle') {
        setMovement((m) => ({
          ...m,
          [field]: false,
        }));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return movement;
};
