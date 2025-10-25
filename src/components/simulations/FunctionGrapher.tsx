import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCanvasColor } from "@/lib/canvas-utils";

type FunctionType = "sine" | "cosine" | "quadratic" | "cubic";

export function FunctionGrapher() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [functionType, setFunctionType] = useState<FunctionType>("sine");
  const [amplitude, setAmplitude] = useState([1]);
  const [frequency, setFrequency] = useState([1]);
  const [phase, setPhase] = useState([0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const scale = 50;

    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = getCanvasColor('--border');
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = getCanvasColor('--foreground');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Draw function
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, getCanvasColor('--primary'));
    gradient.addColorStop(0.5, getCanvasColor('--secondary'));
    gradient.addColorStop(1, getCanvasColor('--accent'));
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let x = 0; x < width; x++) {
      const normalizedX = (x - width / 2) / scale;
      let y;

      switch (functionType) {
        case "sine":
          y = amplitude[0] * Math.sin(frequency[0] * normalizedX + phase[0]);
          break;
        case "cosine":
          y = amplitude[0] * Math.cos(frequency[0] * normalizedX + phase[0]);
          break;
        case "quadratic":
          y = amplitude[0] * Math.pow(normalizedX + phase[0], 2) / 4;
          break;
        case "cubic":
          y = amplitude[0] * Math.pow(normalizedX + phase[0], 3) / 8;
          break;
      }

      const canvasY = centerY - y * scale;

      if (x === 0) {
        ctx.moveTo(x, canvasY);
      } else {
        ctx.lineTo(x, canvasY);
      }
    }

    ctx.stroke();

    // Add glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = getCanvasColor('--primary', 0.5);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [functionType, amplitude, frequency, phase]);

  return (
    <Card className="shadow-xl animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
        <CardTitle>Function Grapher</CardTitle>
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
            <label className="text-sm font-medium">Function Type</label>
            <Select value={functionType} onValueChange={(val) => setFunctionType(val as FunctionType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sine">Sine Wave</SelectItem>
                <SelectItem value="cosine">Cosine Wave</SelectItem>
                <SelectItem value="quadratic">Quadratic</SelectItem>
                <SelectItem value="cubic">Cubic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Amplitude: {amplitude[0].toFixed(1)}</label>
            <Slider value={amplitude} onValueChange={setAmplitude} min={0.5} max={3} step={0.1} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Frequency: {frequency[0].toFixed(1)}</label>
            <Slider value={frequency} onValueChange={setFrequency} min={0.1} max={3} step={0.1} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phase Shift: {phase[0].toFixed(1)}</label>
            <Slider value={phase} onValueChange={setPhase} min={-3} max={3} step={0.1} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
