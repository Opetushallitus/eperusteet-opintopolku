import { ChatApi, OpenaiMessage, Thread, Run, FileApi, Assistant, AssistantApi, Api, ModelApi, MessageApi, Model, MessageDto } from '@shared/api/ai';
import { computed, reactive } from '@vue/composition-api';
import { Kielet } from '@shared/stores/kieli';
import * as _ from 'lodash';

export enum SourceFileTypeEnum {
  PDF = 'PDF',
  HTML = 'HTML'
}

export class OpsAiStore {
  public constructor(
    private sourceId: number,
    private sourceType: string,
    private sourceRevision: number,
    private sourceName: { [key: string]: string; },
    private educationLevel: string,
    private $el: any,
  ) {
  }

  public state = reactive({
    available: false,
    sourceAvailable: true,
    thread: null as Thread | null,
    assistant: null as Assistant | null,
    models: null as Model[] | null,
    fileId: null as string | null,
    messages: [] as MessageDto[],
    currentRun: null as Run | null,
    welcomeMessage: null as MessageDto | null,
    sourceFileType: 'PDF' as SourceFileTypeEnum,
    sourcefileUrl: null as string | null,
    supportedSourceTypes: null as string[] | null,
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
  public readonly sourceFileType = computed(() => this.state.sourceFileType);
  public readonly sourcefileUrl = computed(() => this.state.sourcefileUrl);
  public readonly supportedSourceTypes = computed(() => this.state.supportedSourceTypes);

  public async init() {
    this.state.available = (await Api.get('/api/available')).data;
    this.state.supportedSourceTypes = (await FileApi.getSupportedTypes(this.sourceType, this.sourceId, Kielet.getSisaltoKieli.value, this.sourceRevision)).data;
  }

  public async fetch() {
    try {
      this.state.messages = [];
      this.state.thread = null;
      this.state.sourcefileUrl = null;
      [this.state.fileId, this.state.thread, this.state.models, this.state.assistant, this.state.sourcefileUrl] = await Promise.all([
        FileApi.upload(this.sourceType, this.sourceId, Kielet.getSisaltoKieli.value, this.sourceRevision, this.sourceFileType.value).then(res => res.data.id!),
        ChatApi.createThread().then(res => res.data),
        ModelApi.getModels().then(res => res.data),
        AssistantApi.getAssistants().then(res => res.data[0]),
        FileApi.getSourceUrl(this.sourceType, this.sourceId, Kielet.getSisaltoKieli.value, this.sourceRevision, this.sourceFileType.value.toLowerCase()).then(res => res.data),
      ]);
    }
    catch (e) {
      console.log(e);
      this.state.sourceAvailable = false;
    }
  }

  public async setFileType(fileType: SourceFileTypeEnum) {
    this.state.sourceFileType = fileType;
  }

  public setWelcomeMessage(role, message) {
    this.state.welcomeMessage = this.createMessage(role, message);
    this.state.messages.push(this.state.welcomeMessage as any);
  }

  public addErrorMessage() {
    this.state.messages.push(this.createMessage('assistant', this.$el.$t('virhe-palvelu-virhe'), 'error'));
  }

  public addMessage(role, message?) {
    this.state.messages.push(this.createMessage(role, message));
  }

  private createMessage(role, message?, type?) {
    return {
      role,
      content: message,
      type,
      ...(message && { createdAt: new Date().getTime() }),
    } as any;
  }

  public async sendThreadMessage(message: string, assistant: Assistant) {
    if (this.state.thread) {
      this.state.currentRun = {
        status: 'queued',
      };

      this.state.assistant = {
        ...this.state.assistant,
        ...assistant,
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
        ..._.chain((await ChatApi.getThreadMessages(this.state.thread?.id!)).data)
          .map(message => {
            return {
              ...message,
              created_at: _.toString(_.toNumber(message.created_at) * 1000),
            };
          })
          .map(openaiMessage => this.openAiMessageToMessageDto(openaiMessage))
          .value(),
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
        await MessageApi.addMessage(_.filter(this.state.messages, message => !!message.threadId));
        await this.fillThreadMessageFeedback();
      }
    }
    catch (e) {
      this.markRunErrorronous();
      this.addErrorMessage();
    }

    if (this.state.currentRun?.status !== 'completed') {
      this.markRunErrorronous();
      this.addErrorMessage();
    }
  }

  public async sendFeedback(messageWithFeedback) {
    const feedbackDto = (await MessageApi.addFeedback(messageWithFeedback.messageId, messageWithFeedback.feedback)).data;
    this.state.messages = _.map(this.state.messages, (message: any) => {
      if (message.messageId === messageWithFeedback.messageId) {
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
        feedback: threadMessagesByMessageId[message.messageId]?.feedback,
      };
    });
  }

  private openAiMessageToMessageDto(message: OpenaiMessage): MessageDto {
    return {
      threadId: message.thread_id,
      messageId: message.id,
      role: message.role,
      content: message.content?.map(c => c.text?.value).join(' '),
      createdAt: new Date(_.toNumber(message.created_at)),
      meta: {
        sourceType: this.sourceType,
        sourceId: this.sourceId,
        sourceLanguage: Kielet.getSisaltoKieli.value,
        sourceRevision: this.sourceRevision,
        sourceName: this.sourceName,
        sourceFileType: this.sourceFileType as any,
        educationLevel: this.educationLevel,
        instructions: this.state.assistant?.instructions,
        temperature: this.state.assistant?.temperature,
        top_p: this.state.assistant?.top_p,
        model: this.state.assistant?.model,
      },
    } as MessageDto;
  }
}
