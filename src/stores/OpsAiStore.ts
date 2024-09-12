import { ChatApi, OpenaiMessage, Thread, Run, FileApi, Assistant, AssistantApi, Api, ModelApi, MessageApi, Model, MessageDto } from '@shared/api/ai';
import { computed, reactive } from '@vue/composition-api';
import { Kielet } from '@shared/stores/kieli';
import * as _ from 'lodash';
import { FeedbackDto } from '../../eperusteet-frontend-utils/vue/src/api/ai';

export class OpsAiStore {
  public constructor(
    private sourceId: number,
    private sourceType: string,
    private sourceRevision: number,
    private sourceName: { [key: string]: string; },
    private educationLevel: string) {
  }

  public state = reactive({
    available: false,
    sourceAvailable: true,
    thread: null as Thread | null,
    assistant: null as Assistant | null,
    models: null as Model[] | null,
    fileId: null as string | null,
    messages: [] as OpenaiMessage[],
    currentRun: null as Run | null,
    welcomeMessage: null as OpenaiMessage | null,
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
  public readonly sourceAvailable = computed(() => this.state.sourceAvailable);

  public async init() {
    this.state.available = (await Api.get('/api/available')).data;
  }

  public async fetch() {
    try {
      this.state.messages = [];
      [this.state.fileId, this.state.thread, this.state.models, this.state.assistant] = await Promise.all([
        FileApi.upload(this.sourceType, this.sourceId, Kielet.getSisaltoKieli.value, this.sourceRevision).then(res => res.data.id!),
        ChatApi.createThread().then(res => res.data),
        ModelApi.getModels().then(res => res.data),
        AssistantApi.getAssistants().then(res => res.data[0]),
      ]);
    }
    catch (e) {
      console.log(e);
      this.state.sourceAvailable = false;
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
      ...(message && { created_at: new Date().getTime() }),
    } as any;
  }

  public async sendThreadMessage(message: string, assistant: Assistant) {
    if (this.state.thread) {
      this.state.currentRun = {
        status: 'queued',
      };

      this.addMessage('user', message);
      this.addMessage('assistant');

      await ChatApi.addMessageToThread(this.state.thread.id!, this.state.fileId!, message);
      this.state.currentRun = (await ChatApi.runThread(this.state.thread.id!, assistant.model, assistant.instructions, assistant.temperature, assistant.top_p)).data;
      await this.waitRunStatus();
    }
  }

  public async getMessages() {
    if (this.state.thread) {
      this.state.messages = [
        this.state.welcomeMessage,
        ..._.map((await ChatApi.getThreadMessages(this.state.thread?.id!)).data, message => {
          return {
            ...message,
            created_at: _.toNumber(message.created_at) * 1000,
          };
        }),
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
        await MessageApi.addMessage(_.map(_.filter(this.state.messages, message => !!message.thread_id), openaiMessage => this.openAiMessageToMessageDto(openaiMessage)));
        await this.fillThreadMessageFeedback();
      }
    }
    catch (e) {
      this.markRunErrorronous();
    }

    if (this.state.currentRun?.status !== 'completed') {
      this.markRunErrorronous();
    }
  }

  public async sendFeedback(messageId, feedback) {
    const feedbackDto = (await MessageApi.addFeedback(messageId, feedback)).data;
    this.state.messages = _.map(this.state.messages, (message: any) => {
      if (message.id === messageId) {
        message = {
          ...message,
          feedback: feedbackDto,
        };
      }

      return message;
    });
  }

  public async fillThreadMessageFeedback() {
    const threadMessagesByMessageId = _.keyBy((await MessageApi.getMessagesByThreadId(this.state.thread?.id!)).data, 'messageId');
    this.state.messages = _.map(this.state.messages, (message: any) => {
      return {
        ...message,
        feedback: threadMessagesByMessageId[message.id]?.feedback,
      };
    });
  }

  private openAiMessageToMessageDto(message: OpenaiMessage): MessageDto {
    return {
      threadId: message.thread_id,
      messageId: message.id,
      role: message.role,
      content: message?.content?.map(c => c.text?.value).join(' '),
      createdAt: message.created_at,
      meta: {
        sourceType: this.sourceType,
        sourceId: this.sourceId,
        sourceLanguage: Kielet.getSisaltoKieli.value,
        sourceRevision: this.sourceRevision,
        sourceName: this.sourceName,
        educationLevel: this.educationLevel,
      },
    } as MessageDto;
  }
}
