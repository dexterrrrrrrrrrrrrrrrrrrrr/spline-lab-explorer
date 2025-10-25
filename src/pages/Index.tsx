import { useState } from "react";
import { SimulationCard } from "@/components/SimulationCard";
import { PendulumSimulation } from "@/components/simulations/PendulumSimulation";
import { FunctionGrapher } from "@/components/simulations/FunctionGrapher";
import { CellDivision } from "@/components/simulations/CellDivision";
import { Button } from "@/components/ui/button";
import { Activity, TrendingUp, Dna, ArrowLeft } from "lucide-react";

type SimulationType = "pendulum" | "function" | "cell" | null;

const Index = () => {
  const [activeSimulation, setActiveSimulation] = useState<SimulationType>(null);

  const simulations = [
    {
      title: "Pendulum Motion",
      description: "Explore the physics of pendulum motion. Adjust length, gravity, and initial angle to see how they affect oscillation.",
      icon: Activity,
      category: "physics" as const,
      id: "pendulum" as const,
    },
    {
      title: "Function Grapher",
      description: "Visualize mathematical functions in real-time. Manipulate amplitude, frequency, and phase to understand their effects.",
      icon: TrendingUp,
      category: "math" as const,
      id: "function" as const,
    },
    {
      title: "Cell Division",
      description: "Watch cells divide and multiply. Control the speed of mitosis to understand the process of cellular reproduction.",
      icon: Dna,
      category: "biology" as const,
      id: "cell" as const,
    },
  ];

  if (activeSimulation) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-6">
        <div className="max-w-5xl mx-auto">
          <Button
            onClick={() => setActiveSimulation(null)}
            variant="outline"
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Simulations
          </Button>
          
          {activeSimulation === "pendulum" && <PendulumSimulation />}
          {activeSimulation === "function" && <FunctionGrapher />}
          {activeSimulation === "cell" && <CellDivision />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Learn Through Experimentation
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Explore Physics, Mathematics, and Biology with interactive simulations. 
            Manipulate parameters and observe cause-effect relationships in real-time.
          </p>
        </div>
      </div>

      {/* Simulations Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12 animate-slide-up">
          <h2 className="text-3xl font-bold mb-3">Available Simulations</h2>
          <p className="text-muted-foreground text-lg">
            Choose a simulation to begin your learning journey. Each module includes interactive controls 
            for hands-on experimentation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulations.map((sim, index) => (
            <div key={sim.id} style={{ animationDelay: `${index * 100}ms` }}>
              <SimulationCard
                title={sim.title}
                description={sim.description}
                icon={sim.icon}
                category={sim.category}
                onClick={() => setActiveSimulation(sim.id)}
              />
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-2 gap-8">
          <div className="text-center p-6 animate-slide-up">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Interaction</h3>
            <p className="text-muted-foreground">
              Adjust parameters with sliders and see instant visual feedback
            </p>
          </div>
          
          <div className="text-center p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Dna className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visual Learning</h3>
            <p className="text-muted-foreground">
              Complex concepts made simple through beautiful visualizations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
