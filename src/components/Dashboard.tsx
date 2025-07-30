import axios from "axios";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter,
  BarChart3,
  Activity,
  Users,
  MessageCircle,
  Zap,
  Settings,
  RefreshCw
} from 'lucide-react';
import FluximedLogo from './FluximedLogo';
import ClinicCard from './ClinicCard';
import ClinicDetails from './ClinicDetails';
import AddClinicForm from './AddClinicForm';
import { useToast } from "@/hooks/use-toast";

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



const Dashboard = () => {
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [selectedClinica, setSelectedClinica] = useState<Clinica | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // ✅ useEffect sempre DENTRO do componente
  useEffect(() => {
    const fetchClinicas = async () => {
      try {
        // Tentativa de buscar do backend primeiro
        const res = await axios.get("http://localhost:8500/clinicas");
        const dados = res.data.clinicas;

        const lista: Clinica[] = Object.entries(dados).map(([id, info]) => ({
          id,
          ...(info as Omit<Clinica, 'id'>)
        }));

        setClinicas(lista);
      } catch (error) {
        console.log("Backend não disponível, carregando dados mock...");
        
        // Dados mock baseados no arquivo backend/data/data.json
        const mockData: Clinica[] = [
          {
            id: "clinica_icarai",
            nome: "Clínica Icaraí",
            telefone: "5521988888888",
            mensagens_usadas: 432,
            limite_mensal: 1000,
            chats: {
              "5511987654321": {
                contexto: [
                  { role: "user", content: "Quero marcar uma consulta", timestamp: "2025-07-24T10:12:00" },
                  { role: "assistant", content: "Claro! Qual dia seria melhor para você?", timestamp: "2025-07-24T10:13:00" },
                  { role: "user", content: "Amanhã à tarde pode ser?", timestamp: "2025-07-24T10:15:00" },
                  { role: "assistant", content: "Temos às 15h ou 16h disponíveis.", timestamp: "2025-07-24T10:16:00" }
                ]
              },
              "5511987000000": {
                contexto: [
                  { role: "user", content: "Quais convênios aceitam?", timestamp: "2025-07-23T09:30:00" },
                  { role: "assistant", content: "Aceitamos Amil, Bradesco, e Unimed.", timestamp: "2025-07-23T09:31:00" }
                ]
              }
            }
          },
          {
            id: "clinica_norte",
            nome: "Clínica Norte",
            telefone: "5521999999999",
            mensagens_usadas: 892,
            limite_mensal: 2000,
            chats: {
              "5521977777777": {
                contexto: [
                  { role: "user", content: "Vocês atendem plano de saúde?", timestamp: "2025-07-23T17:44:00" },
                  { role: "assistant", content: "Sim! Atendemos Unimed, Amil e SulAmérica.", timestamp: "2025-07-23T17:45:00" }
                ]
              },
              "5521966666666": {
                contexto: [
                  { role: "user", content: "Onde fica localizada a clínica?", timestamp: "2025-07-23T18:00:00" },
                  { role: "assistant", content: "Estamos na Av. Central, 123 - Centro.", timestamp: "2025-07-23T18:01:00" }
                ]
              }
            }
          },
          {
            id: "clinica_sul",
            nome: "Clínica Sul",
            telefone: "5521961234567",
            mensagens_usadas: 1050,
            limite_mensal: 1500,
            chats: {
              "5521955555555": {
                contexto: [
                  { role: "user", content: "Preciso remarcar minha consulta", timestamp: "2025-07-22T16:00:00" },
                  { role: "assistant", content: "Claro, para qual data gostaria de reagendar?", timestamp: "2025-07-22T16:01:00" }
                ]
              },
              "5521944444444": {
                contexto: [
                  { role: "user", content: "Qual o valor da consulta particular?", timestamp: "2025-07-22T17:30:00" },
                  { role: "assistant", content: "A consulta particular custa R$ 250,00.", timestamp: "2025-07-22T17:31:00" }
                ]
              },
              "5521933333333": {
                contexto: [
                  { role: "user", content: "Tem atendimento sábado?", timestamp: "2025-07-22T19:10:00" },
                  { role: "assistant", content: "Sim, atendemos até às 13h aos sábados.", timestamp: "2025-07-22T19:11:00" }
                ]
              }
            }
          },
          {
            id: "clin_nikity",
            nome: "Nikity Dental",
            telefone: "5521969360654",
            mensagens_usadas: 0,
            limite_mensal: 1000,
            chats: {}
          }
        ];

        setClinicas(mockData);
        
        toast({
          title: "Modo Demonstração",
          description: "Carregando dados de exemplo. Conecte o backend para dados reais.",
        });
      }
    };

    fetchClinicas();
  }, [toast]);

  const filteredClinicas = clinicas.filter(clinica =>
    clinica.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinica.telefone.includes(searchTerm)
  );

  const totalClinicas = clinicas.length;
  const totalChats = clinicas.reduce((total, clinica) => 
    total + Object.keys(clinica.chats || {}).length, 0
  );
  const totalMessages = clinicas.reduce((total, clinica) => 
    total + Object.values(clinica.chats || {}).reduce((sum, chat) => 
      sum + chat.contexto.length, 0
    ), 0
  );
  const averageUsage = clinicas.reduce((total, clinica) => 
    total + (clinica.mensagens_usadas / clinica.limite_mensal), 0
  ) / clinicas.length * 100;

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simular carregamento
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Atualizado!",
        description: "Dados das clínicas atualizados com sucesso.",
      });
    }, 1000);
  };

  if (selectedClinica) {
    return (
      <ClinicDetails 
        clinica={selectedClinica} 
        onBack={() => setSelectedClinica(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <FluximedLogo size={40} />
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="hover:bg-primary/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-accent/10"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="medical-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalClinicas}</p>
                <p className="text-sm text-muted-foreground">Clínicas Ativas</p>
              </div>
            </div>
          </div>

          <div className="medical-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalChats}</p>
                <p className="text-sm text-muted-foreground">Conversas Ativas</p>
              </div>
            </div>
          </div>

          <div className="medical-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalMessages}</p>
                <p className="text-sm text-muted-foreground">Total Mensagens</p>
              </div>
            </div>
          </div>

          <div className="medical-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{averageUsage.toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Uso Médio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <h1 className="text-3xl font-bold gradient-text">
              Painel de Controle
            </h1>
            <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
              {totalClinicas} clínicas registradas
            </Badge>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clínicas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-input/50"
              />
            </div>
            
            <Button
              onClick={() => setShowAddForm(true)}
              className="btn-medical"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Clínica
            </Button>
          </div>
        </div>

        {/* Clinics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClinicas.map((clinica) => (
            <ClinicCard
              key={clinica.id}
              clinica={clinica}
              onClick={() => setSelectedClinica(clinica)}
            />
          ))}
        </div>

        {filteredClinicas.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Nenhuma clínica encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Tente ajustar sua busca' : 'Comece adicionando sua primeira clínica'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowAddForm(true)} className="btn-medical">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeira Clínica
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add Clinic Form Modal */}
      {showAddForm && (
        <AddClinicForm 
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            // Aqui você adicionaria a nova clínica à lista
            handleRefresh();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;