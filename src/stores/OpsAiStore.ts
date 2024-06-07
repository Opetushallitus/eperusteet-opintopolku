import { ChatApi, Message, Thread, Run, FilesApi, Assistant, AssistantsApi } from '@shared/api/ai';
import { computed, reactive } from '@vue/composition-api';
import { Kielet } from '@shared/stores/kieli';
import Vue from 'vue';

export class OpsAiStore {
  public state = reactive({
    thread: null as Thread | null,
    assistant: null as Assistant | null,
    sourceType: null as string | null,
    sourceId: null as number | null,
    messages: [] as Message[],
    currentRun: null as Run | null,
    welcomeMessage: null as Message | null,
  });

  public readonly thread = computed(() => this.state.thread);
  public readonly sourceType = computed(() => this.state.sourceType);
  public readonly sourceId = computed(() => this.state.sourceId);
  public readonly messages = computed(() => this.state.messages);
  public readonly currentRun = computed(() => this.state.currentRun);
  public readonly assistant = computed(() => this.state.assistant);
  public readonly prosessingMessage = computed(() => this.state.currentRun
    && (this.state.currentRun.status === 'queued' || this.state.currentRun.status === 'in_progress'));

  public async init(sourceId, sourceType) {
    this.state.sourceId = sourceId;
    this.state.sourceType = sourceType;
    await FilesApi.upload(this.sourceType.value!, this.sourceId.value!);
    this.state.thread = (await ChatApi.createThread()).data;
    this.state.assistant = (await AssistantsApi.getAssistants()).data[0];
    // await this.getMessages();
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

      await ChatApi.addMessage(this.state.thread.id!, this.sourceType.value!, this.sourceId.value!, message, Kielet.getSisaltoKieli.value);
      this.state.currentRun = (await ChatApi.runThread(this.state.thread.id!, assistant.instructions, assistant.temperature, assistant.top_p)).data;
      await this.waitRunStatus();
    }
  }

  public async getMessages() {
    if (this.state.thread) {
      this.state.messages = [
        this.state.welcomeMessage,
        ...(await ChatApi.getMessages(this.state.thread.id!)).data,
      ] as any;
      // this.state.messages = (await ChatApi.getMessages('thread_0f9kUH7k1NzqkWUCvWeibTVy')).data;
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
    }
    catch (e) {
      this.markRunErrorronous();
    }

    if (this.state.currentRun?.status !== 'completed') {
      this.markRunErrorronous();
    }
  }
}
