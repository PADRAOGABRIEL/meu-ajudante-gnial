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

// Mock data para demonstração
const mockClinicas: Clinica[] = [
  {
    id: "clinica-01",
    nome: "Clínica São João",
    telefone: "(11) 99999-9999",
    mensagens_usadas: 450,
    limite_mensal: 1000,
    chats: {
      "Maria Silva": {
        contexto: [
          { role: "user", content: "Olá, estou com dor de cabeça há 3 dias" },
          { role: "assistant", content: "Olá Maria! Sinto muito que esteja passando por isso. Pode me contar mais sobre sua dor? É constante ou vem e vai?" },
          { role: "user", content: "É constante e piora à noite" },
          { role: "assistant", content: "Entendo. Recomendo que agende uma consulta presencial para uma avaliação completa. Posso ajudar a agendar?" }
        ]
      },
      "João Santos": {
        contexto: [
          { role: "user", content: "Preciso de informações sobre exames" },
          { role: "assistant", content: "Claro! Que tipo de exame você precisa fazer?" },
          { role: "user", content: "Exame de sangue de rotina" },
          { role: "assistant", content: "Perfeito! Para exames de sangue, é necessário jejum de 12 horas. Gostaria de agendar?" }
        ]
      }
    }
  },
  {
    id: "clinica-02",
    nome: "Medical Center",
    telefone: "(11) 88888-8888",
    mensagens_usadas: 890,
    limite_mensal: 1000,
    chats: {
      "Ana Costa": {
        contexto: [
          { role: "user", content: "Boa tarde, gostaria de agendar uma consulta" },
          { role: "assistant", content: "Boa tarde Ana! Será um prazer ajudar. Que especialidade você precisa?" }
        ]
      }
    }
  },
  {
    id: "clinica-03",
    nome: "Clínica Vida",
    telefone: "(11) 77777-7777",
    mensagens_usadas: 120,
    limite_mensal: 500,
    chats: {}
  }
];

const Dashboard = () => {
  const [clinicas, setClinicas] = useState<Clinica[]>(mockClinicas);
  const [selectedClinica, setSelectedClinica] = useState<Clinica | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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