import { Injectable } from '@nestjs/common';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { Api } from 'telegram/tl';

@Injectable()
export class TelegramService {
  private client: TelegramClient;
  private stringSession: StringSession;
  private phoneCodeHash?: string;

  constructor() {
    const apiId = Number(process.env.TELEGRAM_API_ID);
    const apiHash = process.env.TELEGRAM_API_HASH;
    this.stringSession = new StringSession(process.env.TELEGRAM_SESSION || '');

    this.client = new TelegramClient(this.stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });
  }

  // Função para verificar se o cliente está conectado
  async isConnected(): Promise<boolean> {
    try {
      await this.client.connect();
      const me = await this.client.getMe();
      return me ? true : false;
    } catch (error) {
      console.error('Erro ao verificar a conexão:', error);
      return false;
    }
  }

  // Função para iniciar a autenticação e solicitar o código
  async requestCode() {
    try {
      if (!await this.isConnected()) {
        console.log('O cliente não está conectado. Tentando conectar...');
        await this.client.connect();
      }

      const result = await this.client.invoke(
        new Api.auth.SendCode({
          phoneNumber: process.env.TELEGRAM_PHONE!,
          apiId: Number(process.env.TELEGRAM_API_ID),
          apiHash: process.env.TELEGRAM_API_HASH!,
          settings: new Api.CodeSettings({}),
        }),
      );

      if ('phoneCodeHash' in result) {
        this.phoneCodeHash = result.phoneCodeHash; // Salva o phoneCodeHash para usar na autenticação
      } else {
        throw new Error('phoneCodeHash não encontrado na resposta do servidor.');
      }// Salva o phoneCodeHash para usar na autenticação
      console.log('Código de verificação enviado para o seu número de telefone.');
      return result;
    } catch (error) {
      console.error('Erro ao enviar o código de verificação:', error);
    }
  }

  // Função para concluir a autenticação usando o código recebido
  async authenticateWithCode(code: string) {
    try {
      if (!await this.isConnected()) {
        console.log('O cliente não está conectado. Tentando conectar...');
        await this.client.connect();
      }

      if (!this.phoneCodeHash) {
        throw new Error('phoneCodeHash não encontrado. Certifique-se de chamar requestCode primeiro.');
      }

      // Verifica o código e autentica
      const result = await this.client.invoke(
        new Api.auth.SignIn({
          phoneNumber: process.env.TELEGRAM_PHONE!,
          phoneCodeHash: this.phoneCodeHash, // Usa o phoneCodeHash salvo
          phoneCode: code,
        }),
      );

      console.log('Autenticação concluída!');
      console.log('Sessão salva:', this.client.session.save());
      return result;
    } catch (error) {
      console.error('Erro ao autenticar com o código:', error);
    }
  }

  // Função para pegar as mensagens do grupo
  async getGroupMessages(groupName: string, limit: number) {
    try {
      if (!await this.isConnected()) {
        console.log('O cliente não está conectado. Tentando conectar...');
        await this.client.connect();
      }
      console.log('O cliente está conectado.');
  
      // Obter a entidade do grupo diretamente pelo nome
      const me = await this.client.getMe();
      console.log('Meu ID:', me.id);
      await this.client.sendMessage("me", { message: "Hello!" });
      await this.client.getEntity;
      
      const entity = await this.client.getEntity(groupName);
      
      if (!entity) {
        throw new Error(`Grupo com o nome "${groupName}" não encontrado.`);
      }
  
      console.log(`Encontrado grupo: ${groupName}`);
  
      // Buscar as mensagens do grupo
      const messages = await this.client.getMessages(entity, { limit });
  
      const dialogs = await this.client.invoke(
        new Api.messages.GetDialogs({
          offsetDate: 0,
          offsetId: 0,
          offsetPeer: new Api.InputPeerEmpty(),
          limit: 100,
        })
      );
  
      if (!(dialogs instanceof Api.messages.Dialogs || dialogs instanceof Api.messages.DialogsSlice)) {
        throw new Error('Erro ao obter diálogos: resposta inesperada.');
      }
  
      console.log('messages:', messages);
      return dialogs;
    } catch (error) {
      console.error('Erro ao pegar mensagens do grupo:', error);
      throw error; // Propague o erro para o chamador lidar com ele se necessário
    }
  }
}
