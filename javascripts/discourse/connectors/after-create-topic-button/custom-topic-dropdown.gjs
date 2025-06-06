import Component from "@ember/component";
import { tagName } from "@ember-decorators/component";
import CustomTopicDropdown from "../../components/custom-topic-dropdown";

@tagName("")
export default class CustomTopicDropdownConnector extends Component {
  <template>
    {{#if this.currentUser}}
      <CustomTopicDropdown @category={{this.category}} />
    {{/if}}
  </template>
}
