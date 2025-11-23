"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"] as const;
type Fruit = typeof fruits[number];

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>([
    [randomFruit(), randomFruit(), randomFruit()],
    [randomFruit(), randomFruit(), randomFruit()],
    [randomFruit(), randomFruit(), randomFruit()],
  ]);
  const [spinning, setSpinning] = useState(false);

  function randomFruit(): Fruit {
    return fruits[Math.floor(Math.random() * fruits.length)];
  }

  // Spin logic
  useEffect(() => {
    if (!spinning) return;
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid: Fruit[][] = Array.from({ length: 3 }, () => Array(3) as Fruit[]);
        for (let col = 0; col < 3; col++) {
          newGrid[0][col] = randomFruit();
          for (let row = 1; row < 3; row++) {
            newGrid[row][col] = prev[row - 1][col];
          }
        }
        return newGrid;
      });
    }, 200);
    const timeout = setTimeout(() => setSpinning(false), 2000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [spinning]);

  // Win condition (checked directly in JSX)
  const win =
    (grid[0][0] === grid[0][1] && grid[0][1] === grid[0][2]) ||
    (grid[1][0] === grid[1][1] && grid[1][1] === grid[1][2]) ||
    (grid[2][0] === grid[2][1] && grid[2][1] === grid[2][2]) ||
    (grid[0][0] === grid[1][0] && grid[1][0] === grid[2][0]) ||
    (grid[0][1] === grid[1][1] && grid[1][1] === grid[2][1]) ||
    (grid[0][2] === grid[1][2] && grid[1][2] === grid[2][2]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <div key={idx} className="border p-4 text-center">
            <span className="text-2xl">{fruit}</span>
          </div>
        ))}
      </div>
      <Button disabled={spinning} onClick={() => setSpinning(true)}>
        Spin
      </Button>
      {win && (
        <div className="mt-4 space-y-2">
          <h2 className="text-xl font-semibold">You won!</h2>
          <Share text={`I just won a slot machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
