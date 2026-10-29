import { Registration } from '../auth/auth.models';
export type Address = Registration['endereco'];
export interface Registered {
  id: number;
  mensagem: string;
}
export interface Professional {
  cadastro: Registration;
  nivel?: 'ADMINISTRADOR_TOTAL' | 'ADMINISTRADOR_PARCIAL';
  rg?: string;
  registro?: string;
  especialidade?: string;
  cargo?: string;
  unidade?: string;
  admissao?: string;
}
export interface ProfessionalSummary {
  id: number;
  nome: string;
  perfil: string;
  ativo: boolean;
  registro?: string;
  especialidade?: string;
  cargo?: string;
  unidade?: string;
  admissao?: string;
}
export interface HubInput {
  nome: string;
  endereco: Address;
  latitude: number;
  longitude: number;
}
export interface Hub extends Address {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
  ativo: boolean;
}
export interface ModalityInput {
  nome: string;
  idadeMinima: number;
  idadeMaxima: number;
  limiteFaltasMensais: number;
  poloId: number;
}
export interface Modality extends Omit<
  ModalityInput,
  'idadeMinima' | 'idadeMaxima' | 'limiteFaltasMensais' | 'poloId'
> {
  idadeMinima: number | null;
  idadeMaxima: number | null;
  limiteFaltasMensais: number | null;
  poloId: number | null;
  id: number;
  ativo: boolean;
}
export interface Medical {
  condicoes?: string;
  alergias?: string;
  medicamentos?: string;
  restricoes?: string;
  contatoEmergencia: string;
  telefoneEmergencia: string;
}
export interface Child {
  dadosPessoais: Registration['dadosPessoais'];
  endereco: Address;
  parentesco: string;
  fichaMedica: Medical;
}
export interface ProfileInput {
  nome: string;
  nomeSocial?: string;
  email: string;
  telefone: string;
  endereco: Address;
}
export interface Profile {
  nome: string;
  nomeSocial?: string;
  email: string;
  perfil: string;
  dataNascimento: string;
  genero: string;
  cpfProtegido: boolean;
  telefones: string[];
  enderecos: Address[];
}
