import {
  ApiListRequest,
  ApiListResponse,
  NotificationReponse,
  ReportnameType,
} from "interfaces";
import {CoreAPI} from "services/core";

class NotificationAPI extends CoreAPI {
  async getListNotification() {
    const res = await this.fetch<NotificationReponse[]>(
      "/notification",
      "GET",
      {
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async seenNotification(id: number) {
    const res = await this.fetch<NotificationReponse[]>(
      `/notification/${id}/seen`,
      "POST",
      {
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async seenAllNotification() {
    const res = await this.fetch<NotificationReponse[]>(
      `/notification/seen-all`,
      "POST",
      {
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }
}

export default new NotificationAPI();
