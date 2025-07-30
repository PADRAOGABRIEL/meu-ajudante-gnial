/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  MessageCircle, 
  User, 
  Bot,
  Calendar,
  Clock,
  BarChart3,
  Activity,
  Zap,
  Users,
  TrendingUp,
  Phone,
  AlertCircle
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface Chat {
  contexto: Array<{
    role: string;
    content: string;
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

interface ClinicDetailsProps {
  clinica: Clinica;
  onBack: () => void;
}

const ClinicDetails = ({ clinica, onBack }: ClinicDetailsProps) => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  
  const usagePercentage = (clinica.mensagens_usadas / clinica.limite_mensal) * 100;
  const activeChats = Object.keys(clinica.chats || {}).length;
  const totalMessages = Object.values(clinica.chats || {}).reduce(
    (total, chat) => total + chat.contexto.length, 0
  );

  const formatTime = (index: number) => {
    const now = new Date();
    const time = new Date(now.getTime() - (index * 5 * 60 * 1000)); // 5 min intervals
    return time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const ChatMessage = ({ message, index }: { message: any; index: number }) => {
    const isUser = message.role === 'user';
    return (
      <div className={cn("flex gap-3 mb-4", isUser ? "justify-end" : "justify-start")}>
        <div className={cn("flex gap-3 max-w-[80%]", isUser && "flex-row-reverse")}>
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
            isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          )}>
            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </div>
          <div className={cn("space-y-1", isUser && "text-right")}>
            <div className={cn(
              "rounded-2xl px-4 py-3 text-sm",
              isUser 
                ? "bg-primary text-primary-foreground" 
                : "bg-card-secondary border border-border"
            )}>
              {message.content}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(index)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold gradient-text">{clinica.nome}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              {clinica.telefone}
            </div>
          </div>
        </div>
        
        <Badge 
          variant={activeChats > 0 ? "default" : "secondary"}
          className={cn(
            "px-3 py-1",
            activeChats > 0 && "bg-success/20 text-success border-success/30"
          )}
        >
          {activeChats > 0 ? "Ativa" : "Standby"}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="medical-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeChats}</p>
                <p className="text-sm text-muted-foreground">Conversas Ativas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalMessages}</p>
                <p className="text-sm text-muted-foreground">Total Mensagens</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usagePercentage.toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Uso do Limite</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                usagePercentage >= 90 ? "bg-warning/20" : "bg-success/20"
              )}>
                <Activity className={cn(
                  "w-5 h-5",
                  usagePercentage >= 90 ? "text-warning" : "text-success"
                )} />
              </div>
              <div>
                <p className="text-2xl font-bold">{clinica.limite_mensal - clinica.mensagens_usadas}</p>
                <p className="text-sm text-muted-foreground">Restantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Conversas ({activeChats})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {Object.entries(clinica.chats || {}).map(([paciente, chat]) => (
                <div 
                  key={paciente}
                  className={cn(
                    "p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200",
                    "hover:bg-primary/10 border border-transparent",
                    selectedChat === paciente && "bg-primary/20 border-primary/30"
                  )}
                  onClick={() => setSelectedChat(paciente)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{paciente}</p>
                        <p className="text-xs text-muted-foreground">
                          {chat.contexto.length} mensagens
                        </p>
                      </div>
                    </div>
                    {chat.contexto.length > 0 && (
                      <div className="w-2 h-2 bg-success rounded-full pulse-indicator" />
                    )}
                  </div>
                </div>
              ))}
              {activeChats === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma conversa ativa</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Detail */}
        <div className="lg:col-span-2">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {selectedChat ? `Conversa com ${selectedChat}` : "Selecione uma conversa"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedChat && clinica.chats?.[selectedChat] ? (
                <ScrollArea className="h-[400px] pr-4">
                  {clinica.chats[selectedChat].contexto.map((message, index) => (
                    <ChatMessage key={index} message={message} index={index} />
                  ))}
                </ScrollArea>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">FluxiMed AI Assistant</p>
                    <p className="text-sm">Selecione uma conversa para visualizar os detalhes</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Usage Alert */}
      {usagePercentage >= 90 && (
        <Card className="medical-card border-warning/50 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-warning" />
              <div>
                <p className="font-medium text-warning">Limite de uso próximo do esgotamento</p>
                <p className="text-sm text-muted-foreground">
                  Restam apenas {clinica.limite_mensal - clinica.mensagens_usadas} mensagens este mês
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClinicDetails;