import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface SimulationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  category: "physics" | "math" | "biology";
  onClick: () => void;
}

const categoryColors = {
  physics: "from-blue-500 to-purple-600",
  math: "from-cyan-500 to-blue-600",
  biology: "from-green-500 to-teal-600",
};

export function SimulationCard({ title, description, icon: Icon, category, onClick }: SimulationCardProps) {
  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${categoryColors[category]}`} />
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${categoryColors[category]} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button onClick={onClick} variant="simulation" className="w-full">
          Launch Simulation
        </Button>
      </CardContent>
    </Card>
  );
}
