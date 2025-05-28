import { useEffect, useRef, useState } from "react";

export default function DinoGame() {
  const [isJumping, setIsJumping] = useState(false);
  const [dinoBottom, setDinoBottom] = useState(0);
  const [obstacleLeft, setObstacleLeft] = useState(500);
  const [isGameOver, setIsGameOver] = useState(false);
  const gameContainerRef = useRef(null);

  useEffect(() => {
    const handleJump = () => {
      if (!isJumping) {
        setIsJumping(true);
        let jumpHeight = 0;
        const upInterval = setInterval(() => {
          if (jumpHeight >= 100) {
            clearInterval(upInterval);
            const downInterval = setInterval(() => {
              if (jumpHeight <= 0) {
                clearInterval(downInterval);
                setIsJumping(false);
              } else {
                jumpHeight -= 5;
                setDinoBottom(jumpHeight);
              }
            }, 20);
          } else {
            jumpHeight += 5;
            setDinoBottom(jumpHeight);
          }
        }, 20);
      }
    };

    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        handleJump();
      }
    };

    const handleTouch = () => handleJump();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouch);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, [isJumping]);

  useEffect(() => {
    if (isGameOver) return;

    const obstacleInterval = setInterval(() => {
      setObstacleLeft((prev) => {
        if (prev < -20) return 500;
        return prev - 5;
      });
    }, 30);

    return () => clearInterval(obstacleInterval);
  }, [isGameOver]);

  useEffect(() => {
    if (
      obstacleLeft < 50 &&
      obstacleLeft > 0 &&
      dinoBottom < 50
    ) {
      setIsGameOver(true);
    }
  }, [obstacleLeft, dinoBottom]);

  return (
    <div
      ref={gameContainerRef}
      className="w-full h-screen bg-gray-100 overflow-hidden relative flex items-end justify-center"
    >
      {isGameOver && (
        <div className="absolute top-10 text-3xl font-bold text-red-600">
          Game Over
        </div>
      )}
      <div
        className="absolute bottom-0 left-10 w-12 h-12 bg-green-500 rounded"
        style={{ bottom: `${dinoBottom}px` }}
      ></div>
      <div
        className="absolute bottom-0 w-10 h-10 bg-red-500"
        style={{ left: `${obstacleLeft}px` }}
      ></div>
    </div>
  );
}