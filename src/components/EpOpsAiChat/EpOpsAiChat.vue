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
            <h5 class="mr-auto header-text">{{'OpsAI, ' + topic}}</h5>
            <EpButton variant="link" icon="settings" v-b-toggle.opsai-settings>Muokkaa OpsAI:n parametreja</EpButton>
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
        <div v-if="currentSourceNotAvailable">
          <p>{{$t('valittu-lahde-ei-tue-opsai')}}</p>
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
                <strong>{{$t('sinä')}}</strong>
              </template>
              <template v-else>
                <EpMaterialIcon outlined class="mr-1">smart_toy</EpMaterialIcon>
                <strong>OpsAI</strong>
              </template>
            </div>
            <div v-for="(content, index) in message.content" :key="message.id + '-' + index">
              <div v-if="content.text" v-html="content.text.value"/>
            </div>
            <div class="message-sent" v-if="message.created_at">{{$t('lahetetty')}}: {{$sdt(message.created_at)}}</div>
          </div>
          <div ref="messagesEnd"/>
        </div>
      </div>
      <template v-slot:modal-footer>
        <div class="new-message d-flex w-100 align-items-center">
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
import { Assistant } from '@shared/api/ai';

@Component
export default class EpOpsAiChat extends Vue {
  @Prop({ required: true })
  private topic!: string;

  @Prop({ required: true })
  private sourceId!: number;

  @Prop({ required: true })
  private sourceType!: string;

  @Prop({ required: true })
  private revision!: number;

  opsAiStore: OpsAiStore | null = null;
  message: string = '';
  currentSourceNotAvailable: boolean = false;
  assistantSettings: Assistant | null = null;

  async mounted() {
    this.opsAiStore = new OpsAiStore();
    await this.opsAiStore.init();
  }

  async open() {
    this.currentSourceNotAvailable = false;
    this.message = '';
    this.$bvModal.show('ai-modal');
    try {
      await this.opsAiStore?.fetch(this.sourceId, this.sourceType, this.revision);
      this.opsAiStore?.setWelcomeMessage('assistant', this.$t('opsai-keskustelun-avaus'));
      this.assistantSettings = {
        ...this.opsAiStore?.assistant.value,
      };
    }
    catch (e) {
      console.log(e);
      this.currentSourceNotAvailable = true;
    }
  }

  get isAvailable() {
    return this.opsAiStore?.isAvailable.value;
  }

  close() {
    this.$bvModal.hide('ai-modal');
    this.assistantSettings = null;
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
        ...(message.created_at && { created_at: new Date(message.created_at * 1000) }),
        lastMessage: message === _.last(this.opsAiStore?.messages.value),
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
    return this.opsAiStore?.models.value;
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
        max-width: 700px;
        margin-right: auto !important;
        background-color: $white;
        border-top-left-radius: 0;
      }

      .message-sent {
        margin-top: 0.5rem;
        font-size: 0.8rem;
        color: #999;
        font-style: italic;
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

</style>
