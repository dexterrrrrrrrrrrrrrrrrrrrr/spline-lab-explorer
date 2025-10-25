import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

export function PendulumSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [length, setLength] = useState([200]);
  const [angle, setAngle] = useState([45]);
  const [gravity, setGravity] = useState([9.8]);
  const animationRef = useRef<number>();
  
  const angleRef = useRef(angle[0] * (Math.PI / 180));
  const angularVelocity = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = 50;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw pivot
      ctx.fillStyle = "hsl(var(--foreground))";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Calculate pendulum position
      const pendulumX = centerX + length[0] * Math.sin(angleRef.current);
      const pendulumY = centerY + length[0] * Math.cos(angleRef.current);

      // Draw rod
      ctx.strokeStyle = "hsl(var(--primary))";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(pendulumX, pendulumY);
      ctx.stroke();

      // Draw bob with gradient
      const gradient = ctx.createRadialGradient(pendulumX, pendulumY, 0, pendulumX, pendulumY, 20);
      gradient.addColorStop(0, "hsl(var(--secondary))");
      gradient.addColorStop(1, "hsl(var(--primary))");
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pendulumX, pendulumY, 20, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = "hsl(var(--primary))";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw motion trail
      ctx.strokeStyle = "hsl(var(--accent) / 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, length[0], 0, Math.PI * 2);
      ctx.stroke();

      // Physics calculation
      if (isPlaying) {
        const angularAcceleration = (-gravity[0] / length[0]) * Math.sin(angleRef.current);
        angularVelocity.current += angularAcceleration * 0.1;
        angleRef.current += angularVelocity.current * 0.1;
        angularVelocity.current *= 0.999; // Damping
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, length, gravity]);

  const reset = () => {
    setIsPlaying(false);
    angleRef.current = angle[0] * (Math.PI / 180);
    angularVelocity.current = 0;
  };

  return (
    <Card className="shadow-xl animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardTitle>Pendulum Motion Simulator</CardTitle>
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
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Length: {length[0]}px</label>
            </div>
            <Slider
              value={length}
              onValueChange={setLength}
              min={100}
              max={250}
              step={10}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Initial Angle: {angle[0]}°</label>
            </div>
            <Slider
              value={angle}
              onValueChange={(val) => {
                setAngle(val);
                if (!isPlaying) angleRef.current = val[0] * (Math.PI / 180);
              }}
              min={0}
              max={90}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Gravity: {gravity[0]} m/s²</label>
            </div>
            <Slider
              value={gravity}
              onValueChange={setGravity}
              min={1}
              max={20}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="simulation"
              className="flex-1"
            >
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
