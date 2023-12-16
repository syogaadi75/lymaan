import {AuthLoginType, UserResponse} from "interfaces";
import {CoreAPI} from "services/core";

class AuthAPI extends CoreAPI {
  async login(json: AuthLoginType) {
    const res = await this.fetch<{data: {token: string; id: string}}>(
      "/login",
      "POST",
      {
        json: {...json},
      },
    );

    const {data} = res ?? {};

    if (data?.token) {
      this.setToken({token: data?.token});
      this.setUserId({user_id: data?.id});
    }

    return res;
  }

  async getProfile() {
    const res = await this.fetch<{data: UserResponse}>(
      "/users/" + this.getUserId(),
      "GET",
      {
        prefix: "la",
        isPrivate: true,
      },
    );

    return res;
  }
}

export default new AuthAPI();
