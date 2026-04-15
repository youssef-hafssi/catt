import React, { useState, useEffect } from 'react';
import './Cat.css';
import catImage from '../assets/cat.png';

const Cat: React.FC = () => {
  const [position, setPosition] = useState({ top: 50, left: 50 });

  useEffect(() => {
    const moveCat = () => {
      const newTop = Math.random() * (window.innerHeight - 100);
      const newLeft = Math.random() * (window.innerWidth - 100);
      setPosition({ top: newTop, left: newLeft });
    };

    const intervalId = setInterval(moveCat, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <img
      src={catImage}
      className="moving-cat"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      alt="Moving Cat"
    />
  );
};

export default Cat;
