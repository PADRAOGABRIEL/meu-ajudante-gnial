import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Building2, 
  Phone, 
  MessageSquare, 
  Target,
  Sparkles,
  X
} from 'lucide-react';

interface AddClinicFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddClinicForm = ({ onClose, onSuccess }: AddClinicFormProps) => {
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    telefone: '',
    prompt: '',
    limite_mensal: 1000
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id || !formData.nome || !formData.telefone || !formData.prompt) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular API call (substituir pela chamada real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Sucesso!",
        description: "Clínica adicionada com sucesso.",
        variant: "default"
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao adicionar clínica. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="medical-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl">Nova Clínica</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure um novo agente de IA para sua clínica
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Building2 className="w-4 h-4" />
                <h3 className="font-semibold">Informações Básicas</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">ID da Clínica *</Label>
                  <Input
                    id="id"
                    placeholder="ex: clinica-01"
                    value={formData.id}
                    onChange={(e) => handleChange('id', e.target.value)}
                    className="bg-input/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Identificador único (sem espaços)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Clínica *</Label>
                  <Input
                    id="nome"
                    placeholder="ex: Clínica São João"
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    className="bg-input/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone" className="flex items-center gap-2">
                  <Phone className="w-3 h-3" />
                  Telefone *
                </Label>
                <Input
                  id="telefone"
                  placeholder="ex: (11) 99999-9999"
                  value={formData.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  className="bg-input/50"
                />
              </div>
            </div>

            {/* AI Configuration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-secondary">
                <Sparkles className="w-4 h-4" />
                <h3 className="font-semibold">Configuração da IA</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt" className="flex items-center gap-2">
                  <MessageSquare className="w-3 h-3" />
                  Prompt do Agente IA *
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Ex: Você é um assistente médico virtual especializado em atendimento inicial. Seja empático, profissional e sempre encaminhe casos urgentes para atendimento presencial..."
                  value={formData.prompt}
                  onChange={(e) => handleChange('prompt', e.target.value)}
                  className="bg-input/50 min-h-[120px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Define a personalidade e comportamento do agente IA
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limite" className="flex items-center gap-2">
                  <Target className="w-3 h-3" />
                  Limite Mensal de Mensagens
                </Label>
                <Input
                  id="limite"
                  type="number"
                  min="100"
                  max="10000"
                  step="100"
                  value={formData.limite_mensal}
                  onChange={(e) => handleChange('limite_mensal', parseInt(e.target.value) || 1000)}
                  className="bg-input/50"
                />
                <p className="text-xs text-muted-foreground">
                  Número máximo de mensagens que o agente pode processar por mês
                </p>
              </div>
            </div>

            {/* Preview Card */}
            <div className="p-4 rounded-lg bg-muted/20 border border-border">
              <h4 className="font-medium text-sm mb-2 text-accent">Preview da Clínica</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Nome:</span> {formData.nome || 'Não informado'}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">ID:</span> {formData.id || 'Não informado'}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Telefone:</span> {formData.telefone || 'Não informado'}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Limite:</span> {formData.limite_mensal} mensagens/mês
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="btn-medical"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Clínica
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddClinicForm;