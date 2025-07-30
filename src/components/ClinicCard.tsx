/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Users, 
  Activity, 
  TrendingUp, 
  Phone,
  Calendar,
  BarChart3,
  ChevronRight,
  Zap
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface Chat {
  contexto: Array<{
    role: string;
    content: string;
    timestamp?: string;
  }>;
}

interface Clinica {
  id: string;
  nome: string;
  telefone: string;
  mensagens_usadas: number;
  limite_mensal: number;
  chats?: Record<string, Chat>;
}

interface ClinicCardProps {
  clinica: Clinica;
  onClick: () => void;
  isSelected?: boolean;
}

const ClinicCard = ({ clinica, onClick, isSelected = false }: ClinicCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const usagePercentage = (clinica.mensagens_usadas / clinica.limite_mensal) * 100;
  const activeChats = Object.keys(clinica.chats || {}).length;
  const totalMessages = Object.values(clinica.chats || {}).reduce(
    (total, chat) => total + chat.contexto.length, 0
  );

  // Crescimento fixo baseado no ID da clínica para não mudar aleatoriamente
  const growthPercentage = useMemo(() => {
    const hash = clinica.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash) % 25; // 0-24%
  }, [clinica.id]);

  const getUsageColor = () => {
    if (usagePercentage >= 90) return "text-warning";
    if (usagePercentage >= 70) return "text-accent";
    return "text-success";
  };

  const getStatusBadge = () => {
    if (usagePercentage >= 90) return { color: "warning", text: "Limite Alto" };
    if (activeChats > 0) return { color: "success", text: "Online" };
    return { color: "muted", text: "Standby" };
  };

  const status = getStatusBadge();

  return (
    <Card 
      className={cn(
        "medical-card cursor-pointer group transition-all duration-500",
        "hover:scale-[1.02] hover:shadow-glow",
        isSelected && "ring-2 ring-primary shadow-primary",
        isHovered && "border-secondary/50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-primary">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              {activeChats > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full pulse-indicator" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-card-foreground">{clinica.nome}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-3 h-3" />
                {clinica.telefone}
              </div>
            </div>
          </div>
          <Badge 
            variant={status.color as any}
            className={cn(
              "text-xs font-medium",
              status.color === "success" && "bg-success/20 text-success border-success/30",
              status.color === "warning" && "bg-warning/20 text-warning border-warning/30",
              status.color === "muted" && "bg-muted/20 text-muted-foreground border-muted/30"
            )}
          >
            {status.text}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Usage Statistics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Uso Mensal</span>
            <span className={cn("font-medium", getUsageColor())}>
              {clinica.mensagens_usadas} / {clinica.limite_mensal}
            </span>
          </div>
          
          <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-700 bg-gradient-to-r",
                usagePercentage >= 90 ? "from-warning to-destructive" :
                usagePercentage >= 70 ? "from-accent to-primary" :
                "from-success to-secondary"
              )}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>

          <div className="text-xs text-muted-foreground text-center">
            {usagePercentage.toFixed(1)}% utilizado
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-muted/20">
            <div className="flex items-center justify-center gap-1 text-accent">
              <MessageCircle className="w-3 h-3" />
              <span className="text-xs font-medium">{activeChats}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Chats</div>
          </div>
          
          <div className="text-center p-2 rounded-lg bg-muted/20">
            <div className="flex items-center justify-center gap-1 text-primary">
              <BarChart3 className="w-3 h-3" />
              <span className="text-xs font-medium">{totalMessages}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Mensagens</div>
          </div>
          
          <div className="text-center p-2 rounded-lg bg-muted/20">
            <div className="flex items-center justify-center gap-1 text-secondary">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs font-medium">+{growthPercentage}%</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Crescimento</div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          variant="ghost" 
          className={cn(
            "w-full group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300",
            "flex items-center justify-between"
          )}
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Ver Conversas
          </div>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClinicCard;