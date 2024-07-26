import { ChatApi, Message, Thread, Run, FileApi, Assistant, AssistantApi, Api, ModelApi, HistoryApi } from '@shared/api/ai';
import { computed, reactive } from '@vue/composition-api';
import { Kielet } from '@shared/stores/kieli';
import * as _ from 'lodash';

export class OpsAiStore {
  public state = reactive({
    available: false,
    thread: null as Thread | null,
    assistant: null as Assistant | null,
    models: null as string[] | null,
    fileId: null as string | null,
    messages: [] as Message[],
    currentRun: null as Run | null,
    welcomeMessage: null as Message | null,
  });

  public readonly isAvailable = computed(() => this.state.available);
  public readonly thread = computed(() => this.state.thread);
  public readonly fileId = computed(() => this.state.fileId);
  public readonly messages = computed(() => this.state.messages);
  public readonly currentRun = computed(() => this.state.currentRun);
  public readonly assistant = computed(() => this.state.assistant);
  public readonly prosessingMessage = computed(() => this.state.currentRun
    && (this.state.currentRun.status === 'queued' || this.state.currentRun.status === 'in_progress'));
  public readonly models = computed(() => this.state.models);

  public async init() {
    this.state.available = (await Api.get('/api/available')).data;
  }

  public async fetch(sourceId, sourceType, revision) {
    try {
      this.state.messages = [];
      this.state.fileId = (await FileApi.upload(sourceType, sourceId, Kielet.getSisaltoKieli.value, revision)).data.id!;
      this.state.thread = (await ChatApi.createThread()).data;
      this.state.assistant = (await AssistantApi.getAssistants()).data[0];
      this.state.models = (await ModelApi.getModels()).data;
    }
    catch (e) {
      console.log(e);
      this.state.available = false;
    }
  }

  public setWelcomeMessage(role, message) {
    this.state.welcomeMessage = this.createMessage(role, message);
    this.state.messages.push(this.state.welcomeMessage as any);
  }

  public addMessage(role, message?) {
    this.state.messages.push(this.createMessage(role, message));
  }

  private createMessage(role, message?) {
    return {
      role,
      content: [
        {
          text: {
            value: message,
          },
        },
      ],
      ...(message && { created_at: new Date().getTime() / 1000 + '' }),
    } as any;
  }

  public async sendThreadMessage(message: string, assistant: Assistant) {
    if (this.state.thread) {
      this.state.currentRun = {
        status: 'queued',
      };

      this.addMessage('user', message);
      this.addMessage('assistant');

      await ChatApi.addMessage(this.state.thread.id!, this.state.fileId!, message);
      this.state.currentRun = (await ChatApi.runThread(this.state.thread.id!, 'gpt-4o', assistant.instructions, assistant.temperature, assistant.top_p)).data;
      await this.waitRunStatus();
    }
  }

  public async getMessages() {
    if (this.state.thread) {
      this.state.messages = [
        this.state.welcomeMessage,
        ...(await ChatApi.getMessages(this.state.thread.id!)).data,
      ] as any;
    }
  }

  markRunErrorronous() {
    this.state.currentRun = {
      status: 'error',
    };
  }

  public async waitRunStatus() {
    try {
      while (this.prosessingMessage.value) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.state.currentRun = (await ChatApi.getRun(this.state.thread?.id!, this.state.currentRun!.id!)).data;
      }

      await this.getMessages();

      if (this.state.currentRun?.status === 'completed') {
        await HistoryApi.addHistory(this.state.messages);
      }
    }
    catch (e) {
      this.markRunErrorronous();
    }

    if (this.state.currentRun?.status !== 'completed') {
      this.markRunErrorronous();
    }
  }
}
