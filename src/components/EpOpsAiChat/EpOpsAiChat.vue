<template>
  <div v-if="isAvailable">
    <div class="opsai clickable" @click="open">
      <div class="header d-flex justify-content-center align-items-center mb-2">
        <EpMaterialIcon>chat</EpMaterialIcon>
        <div class="ml-2 pb-1">Ops.AI</div>
      </div>
      <div class="subheader">
        {{ $t(subheader) }}
      </div>
    </div>

    <b-modal id="ai-modal"  size="xl" centered>
      <template v-slot:modal-header>
        <div class="d-flex flex-column w-100">
          <div class="d-flex w-100 align-items-center">
            <h5 class="mr-auto header-text">{{'OpsAI, ' + $kaanna(sourceName)}}</h5>
            <EpButton variant="link" icon="settings" v-b-toggle.opsai-settings v-if="sourceAvailable">Muokkaa OpsAI:n parametreja</EpButton>
            <div @click="close" class="clickable mt-1">
              <EpMaterialIcon>close</EpMaterialIcon>
            </div>
          </div>
          <div class="text-left w-100" v-if="assistantSettings">
            <b-collapse id="opsai-settings" class="my-2">
              <div class="d-flex w-50  mb-3 align-items-center">
                <div class="mr-2">Malli</div>
                <b-form-select v-model="assistantSettings.model" :options="models"/>
              </div>
              <div>Ohjeet</div>
              <b-form-textarea
                v-model="assistantSettings.instructions"
                rows="3"
                max-rows="6"/>

                <div class="d-flex text-left justify-content-around">
                  <div class="d-flex">
                    <EpInfoPopover style="padding-top: 10px" uniqueId="temp">
                      The “temperature” parameter is like a dial that controls how creative or predictable the language model is. If you turn the dial all the way down to the “cold” side, the language model will play it safe and stick to the things it knows how to write really well. But if you turn the dial all the way up to the “hot” side, the language model will get all creative and come up with lots of different ideas.
                    </EpInfoPopover>
                    <b-form-group label="Luovuus">
                      <b-form-radio v-model="assistantSettings.temperature" name="temperature" value="0.25">Päättäväinen (0.25)</b-form-radio>
                      <b-form-radio v-model="assistantSettings.temperature" name="temperature" value="0.5">Oletus (0.5)</b-form-radio>
                      <b-form-radio v-model="assistantSettings.temperature" name="temperature" value="0.75">Satunnaisempi (0.75)</b-form-radio>
                    </b-form-group>
                  </div>
                  <div class="d-flex">
                    <EpInfoPopover style="padding-top: 10px" uniqueId="topp">
                      The “top p” parameter is like a filter that controls how many different words or phrases the language model considers when it’s trying to predict the next word. If you set the “top p” value to 0.5, the language model will only consider the 50 most likely words or phrases that might come next. But if you set the “top p” value to 0.9, the language model will consider the 90 most likely words or phrases.
                    </EpInfoPopover>
                    <b-form-group label="Monimuotoisuus">
                      <b-form-radio v-model="assistantSettings.top_p" name="topp" value="0.25">Vähän (0.25)</b-form-radio>
                      <b-form-radio v-model="assistantSettings.top_p" name="topp" value="0.5">Oletus (0.5)</b-form-radio>
                      <b-form-radio v-model="assistantSettings.top_p" name="topp" value="0.75">Enemmän (0.75)</b-form-radio>
                    </b-form-group>
                  </div>
                </div>
                <hr/>
            </b-collapse>
          </div>
        </div>
      </template>
      <div class="content">
        <div class="messages" v-if="!sourceAvailable">
          <div class="message error">
            {{$t('valittu-lahde-ei-tue-opsai')}}
          </div>
        </div>
        <EpSpinner class="pt-5" v-else-if="!thread" />
        <div v-else class="messages h-100 d-flex flex-column" ref="messages">
          <div v-for="message in messages"
              :key="message.id"
              class="message"
              :class="'role-'+message.role"
              :ref="message.lastMessage ? 'lastMessage' : message.id">
            <EpSpinner v-if="prosessingMessage && message.lastMessage" class="mr-auto"/>
            <div class="d-flex" v-else>
              <template v-if="message.role ==='user'">
                <EpMaterialIcon outlined class="mr-1">person</EpMaterialIcon>
                <strong>{{$t('sina')}}</strong>
              </template>
              <template v-else>
                <EpMaterialIcon outlined class="mr-1">smart_toy</EpMaterialIcon>
                <strong>OpsAI</strong>
              </template>
            </div>
            <div v-for="(content, index) in message.content" :key="message.id + '-' + index">
              <div v-if="content.text" v-html="content.text.value"/>
            </div>
            <div class="mt-1 d-flex align-items-center" v-if="message.created_at">
              <span class="message-sent">{{$t('lahetetty')}}: {{$sdt(message.created_at)}}</span>
              <template v-if="message.thread_id && message.role !== 'user'">
                <span class="ml-2">|</span>
                <span class="ml-2">{{$t('kerro-mita-pidit-vastauksesta')}}:</span>
                <div class="d-inline-block ml-2 link-style clickable" @click="feedbackResult(message, positiveFeedback)">
                  <EpMaterialIcon class="thumb" :outlined="message.feedback?.result !== positiveFeedback">thumb_up</EpMaterialIcon>
                </div>
                <div class="d-inline-block ml-2 link-style clickable" @click="feedbackResult(message, negativeFeedback)">
                  <EpMaterialIcon class="thumb" :outlined="message.feedback?.result !== negativeFeedback">thumb_down</EpMaterialIcon>
                </div>
              </template>
              <EpButton
                v-if="message.feedback?.result && !openFeedbackMessages[message.id] && !message.feedback?.comment"
                class="ml-3 vapaa-palaute-link"
                variant="link"
                size="sm"
                @click="openFeedback(message)"
                :paddingx="false">
                {{ $t('anna-vapaamuotoinen-palaute') }}
              </EpButton>
            </div>
            <div class="mt-2" v-if="message.feedback?.result">
              <div class="font-weight-600">
                {{ message.feedback.commentClosed }}
                <template v-if="openFeedbackMessages[message.id]">
                  {{ $t('opsai-tekstipalaute') }}:
                  <div class="d-flex w-100 mt-1">
                    <b-form-input class="mr-auto" v-model="message.feedback.comment" :placeholder="$t('kirjoita-palaute-tahan')"></b-form-input>
                    <EpButton class="ml-2" @click="feedback(message)" variant="primary">{{$t('laheta')}}</EpButton>
                    <EpButton variant="link" @click="closeFeedback(message)" :paddingx="false">{{$t('sulje')}}</EpButton>
                  </div>
                </template>
                <template v-else>
                  {{ $t('opsai-palaute-kiitos') }}
                </template>
              </div>
            </div>
          </div>
          <div ref="messagesEnd"/>
        </div>
      </div>
      <template v-slot:modal-footer>
        <div class="new-message d-flex w-100 align-items-center" :class="{'disabled-events': !sourceAvailable}">
          <EpInput :placeholder="$t('kirjoita-viestisi-tahan')"
            type="string"
            v-model="message"
            isEditing
            class="laheta-btn w-100 mr-1"
            @keydown.native="enterPressed"/>
          <div @click="send" class="clickable laheta-icon">
            <EpMaterialIcon outlined>send</EpMaterialIcon>
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { OpsAiStore } from '@/stores/OpsAiStore';
import * as _ from 'lodash';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Assistant, FeedbackDtoResultEnum } from '@shared/api/ai';

@Component
export default class EpOpsAiChat extends Vue {
  @Prop({ required: true })
  private sourceName!: { [key: string]: string; };

  @Prop({ required: true })
  private sourceId!: number;

  @Prop({ required: true })
  private sourceType!: string;

  @Prop({ required: true })
  private revision!: number;

  @Prop({ required: true })
  private educationLevel!: string;

  positiveFeedback = FeedbackDtoResultEnum.POSITIVE;
  negativeFeedback = FeedbackDtoResultEnum.NEGATIVE;

  opsAiStore: OpsAiStore | null = null;
  message: string = '';
  assistantSettings: Assistant | null = null;
  openFeedbackMessages = {};

  async mounted() {
    this.opsAiStore = new OpsAiStore(
      this.sourceId,
      this.sourceType,
      this.revision,
      this.sourceName,
      this.educationLevel,
    );
    await this.opsAiStore.init();
  }

  async open() {
    this.$bvModal.show('ai-modal');
    await this.scrollToBottom();
    if (this.messages.length > 0) {
      return;
    }

    this.message = '';
    await this.opsAiStore?.fetch();
    this.opsAiStore?.setWelcomeMessage('assistant', this.$t('opsai-keskustelun-avaus'));
    this.assistantSettings = {
      ...this.opsAiStore?.assistant.value,
      ...(!!_.find(this.opsAiStore?.models?.value, { defaultModel: true }) && { model: _.find((this.opsAiStore?.models?.value as any), { defaultModel: true }).id }),
    };
  }

  get sourceAvailable() {
    return this.opsAiStore?.sourceAvailable.value;
  }

  get isAvailable() {
    return this.opsAiStore?.isAvailable.value;
  }

  close() {
    this.$bvModal.hide('ai-modal');
  }

  get thread() {
    return this.opsAiStore?.thread.value;
  }

  get messages() {
    return _.map(this.opsAiStore?.messages.value, (message: any) => {
      return {
        ...message,
        content: _.map(message.content, content => {
          return {
            ...content,
            text: {
              ...content.text,
              value: content.text?.value?.replace(/\n/g, '<br>'),
            },
          };
        }),
        lastMessage: message === _.last(this.opsAiStore?.messages.value),
        feedback: {
          ...(message.feedback && message.feedback),
        },
      };
    });
  }

  async newMessage(message: string) {
    await this.opsAiStore?.sendThreadMessage(message, this.assistantSettings!);
  }

  @Watch('messages')
  async scrollToBottom() {
    await this.$nextTick();
    if (this.$refs.messagesEnd) {
      const messagesEnd = this.$refs.messagesEnd as HTMLElement;
      messagesEnd.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }

  async send() {
    const messageToSend = this.message;
    this.message = '';
    await this.newMessage(messageToSend);
  }

  async enterPressed(event) {
    if (event.which === 13) {
      await this.send();
    }
  }

  async feedback(message) {
    this.closeFeedback(message);
    await this.opsAiStore?.sendFeedback(message.id, message.feedback);
  }

  async feedbackResult(message, result) {
    message = {
      ...message,
      feedback: {
        ...(!!message.feedback && message.feedback),
        result,
      },
    };
    this.openFeedback(message);
    await this.opsAiStore?.sendFeedback(message.id, message.feedback);
  }

  closeFeedback(message) {
    this.openFeedbackMessages = {
      ...this.openFeedbackMessages,
      [message.id]: false,
    };
  }

  openFeedback(message) {
    this.openFeedbackMessages = {
      ...this.openFeedbackMessages,
      [message.id]: true,
    };
  }

  get run() {
    return this.opsAiStore?.currentRun.value;
  }

  get prosessingMessage() {
    return this.opsAiStore?.prosessingMessage.value;
  }

  get subheader() {
    if (this.sourceType === 'peruste') {
      return 'opsai-keskustele-peruste';
    }

    return 'opsai-keskustele-opetussuunnitelma';
  }

  get models() {
    return _.map(this.opsAiStore?.models.value, 'id');
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.opsai {
  padding: $sidenav-padding;
  margin: $sidenav-padding;
  background-color: #0033cc;
  color: $white;
  border-radius: 0.5rem;
  text-align: center;
}

::v-deep .modal-body {
  padding: 0;
  background-color: #EDEDED;
}

.clickable {
  .header {
    font-size: 1.2rem;
  }

  .subheader {
    font-size: 0.8rem;

  }
}

.header-text {
  margin: 0;
}

.content {
  height: calc(90vh - 200px);
  border-bottom: 1px solid #C8C8C8;

  .messages {
    overflow-y: auto;
    padding: 1rem;

    .message {
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 1rem;
      border: 1px solid #DADADA;

      &.role-user {
        display: inline-block;
        background-color: #C1EAFF;
        margin-left: auto !important;
        border-bottom-right-radius: 0;
      }

      &.role-assistant {
        display: inline-block;
        max-width: 800px;
        margin-right: auto !important;
        background-color: $white;
        border-top-left-radius: 0;
      }

      &.error {
        background-color: $red;
        color: $white;
        border-top-left-radius: 0;
        max-width: 700px;
        display: inline-block;
      }

      .message-sent {
        font-size: 0.8rem;
        color: #999;
      }
    }
  }
}

.laheta-btn ::v-deep input{
  border: 0;
}

.laheta-icon {
  background-color: $light-blue;
  color: $white;
  border-radius: 2rem;
  padding: 0.5rem;
}

.thumb {
  font-size: 1.2rem;
  color: $blue-lighten-5;
}
::v-deep .ep-button {
  &.vapaa-palaute-link .btn-sm {
    padding: 0;
    margin: 0;
    border:0;
  }
}

</style>
