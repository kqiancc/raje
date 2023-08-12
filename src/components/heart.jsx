import React from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

const Heart = ({ isHeartClicked, setIsHeartClicked }) => {

    const handleHeartClick = () => {
        setIsHeartClicked(!isHeartClicked);
      };

  return (
    <div>
    <div className="rating gap-1">
      <button
        className="bg-transparent transition-colors duration-300"
        onClick={handleHeartClick}
      >
        {isHeartClicked ? (
          <AiFillHeart className="h-8 w-8 text-primary" />
        ) : (
          <AiOutlineHeart className="h-8 w-8 text-primary" />
        )}
      </button>
    </div>
  </div>
  );
};

export default Heart;