import { action } from "@ember/object";
import { getOwner } from "discourse-common/lib/get-owner";
import Composer from "discourse/models/composer";
import DropdownSelectBoxComponent from "select-kit/components/dropdown-select-box";
import { computed } from "@ember/object";

export default DropdownSelectBoxComponent.extend({
  classNames: ["custom-topic-dropdown"],

  selectKitOptions: {
    icons: [settings.parent_button_icon],
    showFullTitle: true,
    autoFilterable: false,
    filterable: false,
    showCaret: true,
    none: themePrefix("custom_topic_dropdown.parent_button"),
  },

  content: computed(function () {
    const items = [
      {
        id: "new_discussion",
        name: I18n.t(themePrefix("custom_topic_dropdown.new_topic_option")),
        description: I18n.t(
          themePrefix("custom_topic_dropdown.new_topic_description")
        ),
        icon: settings.new_topic_icon,
      },
    ];

    items.push({
      id: "new_custom",
      name: I18n.t(themePrefix("custom_topic_dropdown.custom_option")),
      description: I18n.t(
        themePrefix("custom_topic_dropdown.custom_description")
      ),
      icon: settings.custom_option_icon,
    });

    return items;
  }),

  @action
  onChange(selectedAction) {
    const composerController = getOwner(this).lookup("controller:composer");

    let action;
    let recipients;
    let tags;
    let categoryId = this.category ? this.category.id : null;

    if (selectedAction === "new_custom") {
      action = settings.custom_option_action;
      recipients = settings.pm_recipients.replace(/\|/g, ", ");
      tags = settings.custom_option_tags
        ? settings.custom_option_tags.replace(/\|/g, ", ")
        : null;

      if (settings.custom_option_category != 0) {
        categoryId = settings.custom_option_category;
      }
    } else {
      action = Composer.CREATE_TOPIC;
    }

    composerController.open({
      action: action,
      draftKey: Composer.DRAFT,
      categoryId: categoryId,
      recipients: recipients,
      tags: tags,
    });
  },
});
