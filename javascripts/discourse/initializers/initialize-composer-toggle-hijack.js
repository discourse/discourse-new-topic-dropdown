import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "toggle-hijack",

  initialize() {
    if (settings.hijack_pm_toggle) {
      withPluginApi("0.8.14", (api) => {
        api.modifyClass("component:composer-actions", {
          replyAsPrivateMessageSelected(options) {
            let usernames;
            let _postSnapshot;
            let _topicSnapshot;

            if (this.post && this.topic) {
              _postSnapshot = this.post;
              _topicSnapshot = this.topic;
            }

            if (_postSnapshot && !_postSnapshot.get("yours")) {
              const postUsername = _postSnapshot.get("username");
              if (postUsername) {
                usernames = postUsername;
              }
            } else if (this.get("composerModel.topic")) {
              const stream = this.get("composerModel.topic.postStream");

              if (stream.get("firstPostPresent")) {
                const post = stream.get("posts.firstObject");
                if (post && !post.get("yours") && post.get("username")) {
                  usernames = post.get("username");
                }
              }
            }

            if (!this.get("currentUser.staff")) {
              usernames = settings.pm_recipients
                ? settings.pm_recipients.replace(/\|/g, ", ")
                : null;
            }

            options.action = "privateMessage";
            options.recipients = usernames;
            options.archetypeId = "private_message";
            options.skipDraftCheck = true;

            this._replyFromExisting(options, _postSnapshot, _topicSnapshot);
          },
        });
      });
    }
  },
};
