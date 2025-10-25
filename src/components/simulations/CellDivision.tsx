import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw } from "lucide-react";
import { getCSSColor } from "@/lib/canvas-utils";

interface Cell {
  x: number;
  y: number;
  radius: number;
  phase: number;
  dividing: boolean;
}

export function CellDivision() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([1]);
  const [cells, setCells] = useState<Cell[]>([
    { x: 300, y: 200, radius: 40, phase: 0, dividing: false },
  ]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw cells
      cells.forEach((cell, index) => {
        if (cell.dividing) {
          // Cell in division
          const offset = cell.phase * 20;
          
          // Left daughter cell
          const gradient1 = ctx.createRadialGradient(
            cell.x - offset, cell.y, 0,
            cell.x - offset, cell.y, cell.radius
          );
          gradient1.addColorStop(0, getCSSColor('--accent'));
          gradient1.addColorStop(1, getCSSColor('--primary'));
          
          ctx.fillStyle = gradient1;
          ctx.beginPath();
          ctx.arc(cell.x - offset, cell.y, cell.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = getCSSColor('--primary');
          ctx.lineWidth = 2;
          ctx.stroke();

          // Right daughter cell
          const gradient2 = ctx.createRadialGradient(
            cell.x + offset, cell.y, 0,
            cell.x + offset, cell.y, cell.radius
          );
          gradient2.addColorStop(0, getCSSColor('--accent'));
          gradient2.addColorStop(1, getCSSColor('--secondary'));
          
          ctx.fillStyle = gradient2;
          ctx.beginPath();
          ctx.arc(cell.x + offset, cell.y, cell.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = getCSSColor('--secondary');
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw chromosomes
          ctx.strokeStyle = getCSSColor('--foreground');
          ctx.lineWidth = 3;
          for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            const x1 = cell.x - offset + Math.cos(angle) * (cell.radius * 0.5);
            const y1 = cell.y + Math.sin(angle) * (cell.radius * 0.5);
            const x2 = cell.x + offset + Math.cos(angle) * (cell.radius * 0.5);
            const y2 = cell.y + Math.sin(angle) * (cell.radius * 0.5);
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 + 5, y1 + 5);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 5, y2 - 5);
            ctx.stroke();
          }
        } else {
          // Normal cell
          const gradient = ctx.createRadialGradient(cell.x, cell.y, 0, cell.x, cell.y, cell.radius);
          gradient.addColorStop(0, getCSSColor('--accent').replace('hsl(', 'hsla(').replace(')', ', 0.8)'));
          gradient.addColorStop(0.7, getCSSColor('--primary'));
          gradient.addColorStop(1, getCSSColor('--primary').replace('hsl(', 'hsla(').replace(')', ', 0.5)'));
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.strokeStyle = getCSSColor('--primary');
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw nucleus
          ctx.fillStyle = getCSSColor('--secondary');
          ctx.beginPath();
          ctx.arc(cell.x, cell.y, cell.radius * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Update cell states
      if (isPlaying) {
        setCells((prevCells) => {
          const newCells = [...prevCells];
          const updatedCells: Cell[] = [];

          newCells.forEach((cell) => {
            if (cell.dividing) {
              cell.phase += 0.02 * speed[0];
              if (cell.phase >= 1.5) {
                // Complete division - create two new cells
                const offset = 30;
                updatedCells.push(
                  { x: cell.x - offset, y: cell.y, radius: cell.radius, phase: 0, dividing: false },
                  { x: cell.x + offset, y: cell.y, radius: cell.radius, phase: 0, dividing: false }
                );
              } else {
                updatedCells.push(cell);
              }
            } else {
              cell.phase += 0.01 * speed[0];
              if (cell.phase >= 1 && updatedCells.length + newCells.length < 16) {
                cell.dividing = true;
                cell.phase = 0;
              }
              updatedCells.push(cell);
            }
          });

          return updatedCells;
        });
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, cells, speed]);

  const reset = () => {
    setIsPlaying(false);
    setCells([{ x: 300, y: 200, radius: 40, phase: 0, dividing: false }]);
  };

  return (
    <Card className="shadow-xl animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
        <CardTitle>Cell Division Simulator</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="bg-muted rounded-lg p-4">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full border-2 border-border rounded-lg bg-card"
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Division Speed: {speed[0].toFixed(1)}x</label>
            <Slider value={speed} onValueChange={setSpeed} min={0.5} max={3} step={0.1} />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setIsPlaying(!isPlaying)} variant="simulation" className="flex-1">
              {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button onClick={reset} variant="outline" className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
