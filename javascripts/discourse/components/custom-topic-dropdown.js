import { action, computed } from "@ember/object";
import { alias } from "@ember/object/computed";
import Composer from "discourse/models/composer";
import { getOwner } from "discourse-common/lib/get-owner";
import I18n from "discourse-i18n";
import DropdownSelectBoxComponent from "select-kit/components/dropdown-select-box";

export default DropdownSelectBoxComponent.extend({
  classNames: ["custom-topic-dropdown"],
  pmTaggingEnabled: alias("site.can_tag_pms"),

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
    const composerController = getOwner(this).lookup("service:composer");

    let composerOptions = {};

    let theAction = Composer.CREATE_TOPIC;
    let categoryId = this.category ? this.category.id : null;
    let draftKey = Composer.DRAFT;
    let tags;

    if (selectedAction === "new_custom") {
      theAction = settings.custom_option_action;
      if (settings.custom_option_action === "createTopic") {
        if (settings.custom_option_category > 0) {
          categoryId = settings.custom_option_category;
        }
        tags = settings.custom_option_tags
          ? settings.custom_option_tags.replace(/\|/g, ", ")
          : null;
      }
      if (settings.custom_option_action === "privateMessage") {
        draftKey = Composer.NEW_PRIVATE_MESSAGE_KEY;
        composerOptions["recipients"] = settings.pm_recipients.replace(
          /\|/g,
          ", "
        );
        composerOptions["archetypeId"] = "private_message";

        if (this.pmTaggingEnabled === false) {
          tags = null;
        }
      }
    }

    composerOptions["categoryId"] = categoryId;
    composerOptions["draftKey"] = draftKey;
    composerOptions["action"] = theAction;
    composerOptions["tags"] = tags;

    composerController.open(composerOptions);
  },
});
