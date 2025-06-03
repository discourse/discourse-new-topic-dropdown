import Component from "@glimmer/component";
import { action } from "@ember/object";
import { service } from "@ember/service";
import DButton from "discourse/components/d-button";
import Composer from "discourse/models/composer";

export default class CustomNewMessageButton extends Component {
  @service composer;

  showNewPM = this.args.outletArgs.showNewPM;

  @action
  customCreateNewMessage() {
    const recipients = settings.pm_recipients;
    this.composer.open({
      action: Composer.PRIVATE_MESSAGE,
      recipients,
      archetypeId: "private_message",
      draftKey: Composer.NEW_PRIVATE_MESSAGE_KEY,
    });
  }

  <template>
    {{#if settings.pm_recipients}}
      {{#if this.showNewPM}}
        <DButton
          class="btn-primary custom-new-private-message"
          @action={{this.customCreateNewMessage}}
          @icon="envelope"
          @label="user.new_private_message"
        />
      {{/if}}
    {{/if}}
  </template>
}
