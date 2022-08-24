export type Interceptors = {
  req?: (req: Request) => Promise<Request>;
  res?: (req: Request, res: Response) => Promise<Response>;
};

export class Sdk {
  baseUrl: string;

  constructor(opts: { baseUrl: string }) {
    this.baseUrl = opts.baseUrl;
  }

  async completeResetPassword(input: {
    data: ReqDataCompleteResetPassword;
    headers?: { [k: string]: string };
    interceptors: Interceptors;
  }): Promise<
    | {
        ok: true;
        status: 200;
        body: ResBody200CompleteResetPassword;
        res: Response;
      }
    | {
        ok: false;
        status: 422;
        body: ResBody422CompleteResetPassword;
        res: Response;
      }
  > {
    let url = `${this.baseUrl}/v1/complete-reset-password`;

    const headers = new Headers({ "content-type": "application/json" });
    if (input?.headers) {
      for (let k in input.headers) {
        headers.append(k, input.headers[k]);
      }
    }

    let req = new Request(url, {
      method: "POST",
      headers,
      body: JSON.stringify(input.data),
    });

    const interceptors = input.interceptors;

    if (interceptors?.req) {
      req = await interceptors.req(req);
    }

    let res = await fetch(req);

    if (interceptors?.res) {
      res = await interceptors.res(req, res);
    }

    const body =
      res.status === 204
        ? null
        : !res.ok
        ? await res.clone().json()
        : await res.json();

    return { ok: res.ok as any, status: res.status as any, body, res };
  }

  async runHealthCheck(input: {
    headers?: { [k: string]: string };
    interceptors: Interceptors;
  }): Promise<{
    ok: true;
    status: 200;
    body: ResBody200RunHealthCheck;
    res: Response;
  }> {
    let url = `${this.baseUrl}/v1/health-check`;

    const headers = new Headers();
    if (input?.headers) {
      for (let k in input.headers) {
        headers.append(k, input.headers[k]);
      }
    }

    let req = new Request(url, { headers });

    const interceptors = input.interceptors;

    if (interceptors?.req) {
      req = await interceptors.req(req);
    }

    let res = await fetch(req);

    if (interceptors?.res) {
      res = await interceptors.res(req, res);
    }

    const body =
      res.status === 204
        ? null
        : !res.ok
        ? await res.clone().json()
        : await res.json();

    return { ok: res.ok as any, status: res.status as any, body, res };
  }

  async loginUser(input: {
    data: ReqDataLoginUser;
    headers?: { [k: string]: string };
    interceptors: Interceptors;
  }): Promise<
    | { ok: true; status: 200; body: ResBody200LoginUser; res: Response }
    | { ok: false; status: 422; body: ResBody422LoginUser; res: Response }
  > {
    let url = `${this.baseUrl}/v1/login`;

    const headers = new Headers({ "content-type": "application/json" });
    if (input?.headers) {
      for (let k in input.headers) {
        headers.append(k, input.headers[k]);
      }
    }

    let req = new Request(url, {
      method: "POST",
      headers,
      body: JSON.stringify(input.data),
    });

    const interceptors = input.interceptors;

    if (interceptors?.req) {
      req = await interceptors.req(req);
    }

    let res = await fetch(req);

    if (interceptors?.res) {
      res = await interceptors.res(req, res);
    }

    const body =
      res.status === 204
        ? null
        : !res.ok
        ? await res.clone().json()
        : await res.json();

    return { ok: res.ok as any, status: res.status as any, body, res };
  }

  async getLogEvents(input: {
    headers?: { [k: string]: string };
    interceptors: Interceptors;
  }): Promise<{
    ok: true;
    status: 200;
    body: ResBody200GetLogEvents;
    res: Response;
  }> {
    let url = `${this.baseUrl}/v1/logs`;

    const headers = new Headers();
    if (input?.headers) {
      for (let k in input.headers) {
        headers.append(k, input.headers[k]);
      }
    }

    let req = new Request(url, { headers });

    const interceptors = input.interceptors;

    if (interceptors?.req) {
      req = await interceptors.req(req);
    }

    let res = await fetch(req);

    if (interceptors?.res) {
      res = await interceptors.res(req, res);
    }

    const body =
      res.status === 204
        ? null
        : !res.ok
        ? await res.clone().json()
        : await res.json();

    return { ok: res.ok as any, status: res.status as any, body, res };
  }

  async getMe(input: {
    headers?: { [k: string]: string };
    interceptors: Interceptors;
  }): Promise<{ ok: true; status: 200; body: ResBody200GetMe; res: Response }> {
    let url = `${this.baseUrl}/v1/me`;

    const headers = new Headers();
    if (input?.headers) {
      for (let k in input.headers) {
        headers.append(k, input.headers[k]);
      }
    }

    let req = new Request(url, { headers });

    const interceptors = input.interceptors;

    if (interceptors?.req) {
      req = await interceptors.req(req);
    }

    let res = await fetch(req);

    if (interceptors?.res) {
      res = await interceptors.res(req, res);
    }

    const body =
      res.status === 204
        ? null
        : !res.ok
        ? await res.clone().json()
        : await res.json();

    return { ok: res.ok as any, status: res.status as any, body, res };
  }

  async getPolicyDefinitionList(input: {
    headers?: { [k: string]: string };
    interceptors: Interceptors;
  }): Promise<{
    ok: true;
    status: 200;
    body: ResBody200GetPolicyDefinitionList;
    res: Response;
  }> {
    let url = `${this.baseUrl}/v1/policies/policy-definitions`;

    const headers = new Headers();
    if (input?.headers) {
      for (let k in input.headers) {
        headers.append(k, input.headers[k]);
      }
    }

    let req = new Request(url, { headers });

    const interceptors = input.interceptors;

    if (interceptors?.req) {
      req = await interceptors.req(req);
    }

    let res = await fetch(req);

    if (interceptors?.res) {
      res = await interceptors.res(req, res);
    }

    const body =
      res.status === 204
        ? null
        : !res.ok
        ? await res.clone().json()
        : await res.json();

    return { ok: res.ok as any, status: res.status as any, body, res };
  }

  async createPolicyDefinition(input: {
    data: ReqDataCreatePolicyDefinition;
    headers?: { [k: string]: string };
    interceptors: Interceptors;
  }): Promise<
    | {
        ok: true;
        status: 200;
        body: ResBody200CreatePolicyDefinition;
        res: Response;
      }
    | {
        ok: false;
        status: 422;
        body: ResBody422CreatePolicyDefinition;
        res: Response;
      }
  > {
    let url = `${this.baseUrl}/v1/policies/policy-definitions`;

    const headers = new Headers({ "content-type": "application/json" });
    if (input?.headers) {
      for (let k in input.headers) {
        headers.append(k, input.headers[k]);
      }
    }

    let req = new Request(url, {
      method: "POST",
      headers,
      body: JSON.stringify(input.data),
    });

    const interceptors = input.interceptors;

    if (interceptors?.req) {
      req = await interceptors.req(req);
    }

    let res = await fetch(req);

    if (interceptors?.res) {
      res = await interceptors.res(req, res);
    }

    const body =
      res.status === 204
        ? null
        : !res.ok
        ? await res.clone().json()
        : await res.json();

    return { ok: res.ok as any, status: res.status as any, body, res };
  }

  async deletePolicyDefinition(input: {
    params: { policy_definition_uuid: string };
    headers?: { [k: string]: string };
    interceptors: Interceptors;
  }): Promise<
    | {
        ok: true;
        status: 200;
        body: ResBody200DeletePolicyDefinition;
        res: Response;
      }
    | {
        ok: false;
        status: 422;
        body: ResBody422DeletePolicyDefinition;
        res: Response;
      }
  > {
    if (input.params.policy_definition_uuid == null) {
      throw new Error("Missing `params.policy_definition_uuid`");
    }

    let url = `${this.baseUrl}/v1/policies/policy-definitions/${input.params.policy_definition_uuid}`;

    const headers = new Headers();
    if (input?.headers) {
      for (let k in input.headers) {
        headers.append(k, input.headers[k]);
      }
    }

    let req = new Request(url, { method: "DELETE", headers });

    const interceptors = input.interceptors;

    if (interceptors?.req) {
      req = await interceptors.req(req);
    }

    let res = await fetch(req);

    if (interceptors?.res) {
      res = await interceptors.res(req, res);
    }

    const body =
      res.status === 204
        ? null
        : !res.ok
        ? await res.clone().json()
        : await res.json();

    return { ok: res.ok as any, status: res.status as any, body, res };
  }

  async getPolicyDefinition(input: {
    params: { policy_definition_uuid: string };
    headers?: { [k: string]: string };
    interceptors: Interceptors;
  }): Promise<
    | {
        ok: true;
        status: 200;
        body: ResBody200GetPolicyDefinition;
        res: Response;
      }
    | {
        ok: false;
        status: 422;
        body: ResBody422GetPolicyDefinition;
        res: Response;
      }
  > {
    if (input.params.policy_definition_uuid == null) {
      throw new Error("Missing `params.policy_definition_uuid`");
    }

    let url = `${this.baseUrl}/v1/policies/policy-definitions/${input.params.policy_definition_uuid}`;

    const headers = new Headers();
    if (input?.headers) {
      for (let k in input.headers) {
        headers.append(k, input.headers[k]);
      }
    }

    let req = new Request(url, { headers });

    const interceptors = input.interceptors;

    if (interceptors?.req) {
      req = await interceptors.req(req);
    }

    let res = await fetch(req);

    if (interceptors?.res) {
      res = await interceptors.res(req, res);
    }

    const body =
      res.status === 204
        ? null
        : !res.ok
        ? await res.clone().json()
        : await res.json();

    return { ok: res.ok as any, status: res.status as any, body, res };
  }

  async updatePolicyDefinition(input: {
    params: { policy_definition_uuid: string };
    data: ReqDataUpdatePolicyDefinition;
    headers?: { [k: string]: string };
    interceptors: Interceptors;
  }): Promise<
    | {
        ok: true;
        status: 200;
        body: ResBody200UpdatePolicyDefinition;
        res: Response;
      }
    | {
        ok: false;
        status: 422;
        body: ResBody422UpdatePolicyDefinition;
        res: Response;
      }
  > {
    if (input.params.policy_definition_uuid == null) {
      throw new Error("Missing `params.policy_definition_uuid`");
    }

    let url = `${this.baseUrl}/v1/policies/policy-definitions/${input.params.policy_definition_uuid}`;

    const headers = new Headers({ "content-type": "application/json" });
    if (input?.headers) {
      for (let k in input.headers) {
        headers.append(k, input.headers[k]);
      }
    }

    let req = new Request(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(input.data),
    });

    const interceptors = input.interceptors;

    if (interceptors?.req) {
      req = await interceptors.req(req);
    }

    let res = await fetch(req);

    if (interceptors?.res) {
      res = await interceptors.res(req, res);
    }

    const body =
      res.status === 204
        ? null
        : !res.ok
        ? await res.clone().json()
        : await res.json();

    return { ok: res.ok as any, status: res.status as any, body, res };
  }

  async getPolicyDefinitionDownload(input: {
    params: { policy_definition_uuid: string };
    headers?: { [k: string]: string };
    interceptors: Interceptors;
  }): Promise<
    | {
        ok: true;
        status: 200;
        body: ResBody200GetPolicyDefinitionDownload;
        res: Response;
      }
    | {
        ok: false;
        status: 422;
        body: ResBody422GetPolicyDefinitionDownload;
        res: Response;
      }
  > {
    if (input.params.policy_definition_uuid == null) {
      throw new Error("Missing `params.policy_definition_uuid`");
    }

    let url = `${this.baseUrl}/v1/policies/policy-definitions/${input.params.policy_definition_uuid}/download`;

    const headers = new Headers();
    if (input?.headers) {
      for (let k in input.headers) {
        headers.append(k, input.headers[k]);
      }
    }

    let req = new Request(url, { headers });

    const interceptors = input.interceptors;

    if (interceptors?.req) {
      req = await interceptors.req(req);
    }

    let res = await fetch(req);

    if (interceptors?.res) {
      res = await interceptors.res(req, res);
    }

    const body =
      res.status === 204
        ? null
        : !res.ok
        ? await res.clone().json()
        : await res.json();

    return { ok: res.ok as any, status: res.status as any, body, res };
  }

  async createUser(input: {
    query: { self: unknown };
    data: ReqDataCreateUser;
    headers?: { [k: string]: string };
    interceptors: Interceptors;
  }): Promise<
    | { ok: true; status: 200; body: ResBody200CreateUser; res: Response }
    | { ok: false; status: 422; body: ResBody422CreateUser; res: Response }
  > {
    let url = `${this.baseUrl}/v1/register`;

    if (input.query) {
      let q: [string, string][] = [];
      for (let k in input.query) {
        const _v = (input.query as any)[k];
        if (_v === void 0) {
          continue;
        } else if (Array.isArray(_v)) {
          for (let __v of _v) {
            const v = typeof __v === "string" ? __v : String(__v);
            q.push([k, v]);
          }
        } else {
          const v = typeof _v === "string" ? _v : String(_v);
          q.push([k, v]);
        }
      }
      url += `?${new URLSearchParams(q)}`;
    }

    const headers = new Headers({ "content-type": "application/json" });
    if (input?.headers) {
      for (let k in input.headers) {
        headers.append(k, input.headers[k]);
      }
    }

    let req = new Request(url, {
      method: "POST",
      headers,
      body: JSON.stringify(input.data),
    });

    const interceptors = input.interceptors;

    if (interceptors?.req) {
      req = await interceptors.req(req);
    }

    let res = await fetch(req);

    if (interceptors?.res) {
      res = await interceptors.res(req, res);
    }

    const body =
      res.status === 204
        ? null
        : !res.ok
        ? await res.clone().json()
        : await res.json();

    return { ok: res.ok as any, status: res.status as any, body, res };
  }

  async initiatePasswordReset(input: {
    query: { email: string };
    headers?: { [k: string]: string };
    interceptors: Interceptors;
  }): Promise<
    | {
        ok: true;
        status: 200;
        body: ResBody200InitiatePasswordReset;
        res: Response;
      }
    | {
        ok: false;
        status: 422;
        body: ResBody422InitiatePasswordReset;
        res: Response;
      }
  > {
    let url = `${this.baseUrl}/v1/reset-password`;

    if (input.query) {
      let q: [string, string][] = [];
      for (let k in input.query) {
        const _v = (input.query as any)[k];
        if (_v === void 0) {
          continue;
        } else if (Array.isArray(_v)) {
          for (let __v of _v) {
            const v = typeof __v === "string" ? __v : String(__v);
            q.push([k, v]);
          }
        } else {
          const v = typeof _v === "string" ? _v : String(_v);
          q.push([k, v]);
        }
      }
      url += `?${new URLSearchParams(q)}`;
    }

    const headers = new Headers();
    if (input?.headers) {
      for (let k in input.headers) {
        headers.append(k, input.headers[k]);
      }
    }

    let req = new Request(url, { method: "POST", headers });

    const interceptors = input.interceptors;

    if (interceptors?.req) {
      req = await interceptors.req(req);
    }

    let res = await fetch(req);

    if (interceptors?.res) {
      res = await interceptors.res(req, res);
    }

    const body =
      res.status === 204
        ? null
        : !res.ok
        ? await res.clone().json()
        : await res.json();

    return { ok: res.ok as any, status: res.status as any, body, res };
  }

  async verify(input: {
    headers?: { [k: string]: string };
    interceptors: Interceptors;
  }): Promise<{
    ok: true;
    status: 200;
    body: ResBody200Verify;
    res: Response;
  }> {
    let url = `${this.baseUrl}/v1/system/verify`;

    const headers = new Headers();
    if (input?.headers) {
      for (let k in input.headers) {
        headers.append(k, input.headers[k]);
      }
    }

    let req = new Request(url, { headers });

    const interceptors = input.interceptors;

    if (interceptors?.req) {
      req = await interceptors.req(req);
    }

    let res = await fetch(req);

    if (interceptors?.res) {
      res = await interceptors.res(req, res);
    }

    const body =
      res.status === 204
        ? null
        : !res.ok
        ? await res.clone().json()
        : await res.json();

    return { ok: res.ok as any, status: res.status as any, body, res };
  }

  async getUser(input: {
    params: { user_uuid: string };
    headers?: { [k: string]: string };
    interceptors: Interceptors;
  }): Promise<
    | { ok: true; status: 200; body: ResBody200GetUser; res: Response }
    | { ok: false; status: 422; body: ResBody422GetUser; res: Response }
  > {
    if (input.params.user_uuid == null) {
      throw new Error("Missing `params.user_uuid`");
    }

    let url = `${this.baseUrl}/v1/users/user/${input.params.user_uuid}`;

    const headers = new Headers();
    if (input?.headers) {
      for (let k in input.headers) {
        headers.append(k, input.headers[k]);
      }
    }

    let req = new Request(url, { headers });

    const interceptors = input.interceptors;

    if (interceptors?.req) {
      req = await interceptors.req(req);
    }

    let res = await fetch(req);

    if (interceptors?.res) {
      res = await interceptors.res(req, res);
    }

    const body =
      res.status === 204
        ? null
        : !res.ok
        ? await res.clone().json()
        : await res.json();

    return { ok: res.ok as any, status: res.status as any, body, res };
  }

  async getUserList(input: {
    headers?: { [k: string]: string };
    interceptors: Interceptors;
  }): Promise<{
    ok: true;
    status: 200;
    body: ResBody200GetUserList;
    res: Response;
  }> {
    let url = `${this.baseUrl}/v1/users/users_list`;

    const headers = new Headers();
    if (input?.headers) {
      for (let k in input.headers) {
        headers.append(k, input.headers[k]);
      }
    }

    let req = new Request(url, { headers });

    const interceptors = input.interceptors;

    if (interceptors?.req) {
      req = await interceptors.req(req);
    }

    let res = await fetch(req);

    if (interceptors?.res) {
      res = await interceptors.res(req, res);
    }

    const body =
      res.status === 204
        ? null
        : !res.ok
        ? await res.clone().json()
        : await res.json();

    return { ok: res.ok as any, status: res.status as any, body, res };
  }
}

export interface ReqDataCompleteResetPassword {
  token: string;
  password: string;
  password_confirm: string;
}

export interface ResBody200CompleteResetPassword {
  user: {
    uuid: string;
    firstName: string;
    lastName: string;
    email?: string;
    username: string;
  };
  token: string;
  token_expiration: number;
  refresh_token: string;
  refresh_token_expiration: number;
}

export interface ResBody422CompleteResetPassword {
  detail?: {
    loc: string[];
    msg: string;
    type: string;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}

export interface ResBody200RunHealthCheck {
  [k: string]: unknown;
}

export interface ReqDataLoginUser {
  username: string;
  password: string;
}

export interface ResBody200LoginUser {
  user: {
    uuid: string;
    firstName: string;
    lastName: string;
    email?: string;
    username: string;
  };
  token: string;
  token_expiration: number;
  refresh_token: string;
  refresh_token_expiration: number;
}

export interface ResBody422LoginUser {
  detail?: {
    loc: string[];
    msg: string;
    type: string;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}

export interface ResBody200GetLogEvents {
  [k: string]: unknown;
}

export interface ResBody200GetMe {
  uuid: string;
  firstName: string;
  lastName: string;
  email?: string;
  username: string;
}

export interface ResBody200GetPolicyDefinitionList {
  paging: {
    totalCount: number;
    hasNextPage: boolean;
  };
  results: {
    uuid: string;
    name: string;
    enum: string;
    privacyPolicy: {
      [k: string]: unknown;
    };
    dataTypeList: string[];
    version: number;
    publicUrl: string;
  }[];
}

export interface ReqDataCreatePolicyDefinition {
  name: string;
  privacyPolicy: {
    [k: string]: unknown;
  };
  schemaVersion: number;
}

export interface ResBody200CreatePolicyDefinition {
  uuid: string;
  name: string;
  enum: string;
  privacyPolicy: {
    [k: string]: unknown;
  };
  dataTypeList: string[];
  version: number;
  publicUrl: string;
}

export interface ResBody422CreatePolicyDefinition {
  detail?: {
    loc: string[];
    msg: string;
    type: string;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}

export interface ResBody200DeletePolicyDefinition {
  status: string;
}

export interface ResBody422DeletePolicyDefinition {
  detail?: {
    loc: string[];
    msg: string;
    type: string;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}

export interface ResBody200GetPolicyDefinition {
  uuid: string;
  name: string;
  enum: string;
  privacyPolicy: {
    [k: string]: unknown;
  };
  dataTypeList: string[];
  version: number;
  publicUrl: string;
}

export interface ResBody422GetPolicyDefinition {
  detail?: {
    loc: string[];
    msg: string;
    type: string;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}

export interface ReqDataUpdatePolicyDefinition {
  name?: string;
  privacyPolicy?: {
    [k: string]: unknown;
  };
  schemaVersion?: number;
  publicUrl?: string;
  active?: boolean;
}

export interface ResBody200UpdatePolicyDefinition {
  uuid: string;
  name: string;
  enum: string;
  privacyPolicy: {
    [k: string]: unknown;
  };
  dataTypeList: string[];
  version: number;
  publicUrl: string;
}

export interface ResBody422UpdatePolicyDefinition {
  detail?: {
    loc: string[];
    msg: string;
    type: string;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}

export interface ResBody200GetPolicyDefinitionDownload {
  [k: string]: unknown;
}

export interface ResBody422GetPolicyDefinitionDownload {
  detail?: {
    loc: string[];
    msg: string;
    type: string;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}

export interface ReqDataCreateUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export interface ResBody200CreateUser {
  [k: string]: unknown;
}

export interface ResBody422CreateUser {
  detail?: {
    loc: string[];
    msg: string;
    type: string;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}

export interface ResBody200InitiatePasswordReset {
  status: string;
  info?: string;
}

export interface ResBody422InitiatePasswordReset {
  detail?: {
    loc: string[];
    msg: string;
    type: string;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}

export interface ResBody200Verify {
  status: string;
  message?: string;
}

export interface ResBody200GetUser {
  uuid: string;
  firstName: string;
  lastName: string;
  email?: string;
  username: string;
}

export interface ResBody422GetUser {
  detail?: {
    loc: string[];
    msg: string;
    type: string;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}

export interface ResBody200GetUserList {
  results: {
    uuid: string;
    firstName: string;
    lastName: string;
    email?: string;
    username: string;
  }[];
  pagination: {
    totalCount: number;
    cursors: {
      after?: string;
      before?: string;
    };
    previous?: string;
    next?: string;
  };
}
