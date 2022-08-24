export const schemaReqDataCompleteResetPassword = {
  title: "ReqDataCompleteResetPassword",
  required: ["token", "password", "password_confirm"],
  type: "object",
  properties: {
    token: { title: "Token", type: "string" },
    password: { title: "Password", type: "string" },
    password_confirm: { title: "Password Confirm", type: "string" },
  },
  additionalProperties: false,
};

export const schemaReqDataLoginUser = {
  title: "ReqDataLoginUser",
  required: ["username", "password"],
  type: "object",
  properties: {
    username: { title: "Username", type: "string" },
    password: { title: "Password", maxLength: 72, type: "string" },
  },
  additionalProperties: false,
};

export const schemaReqDataCreatePolicyDefinition = {
  title: "ReqDataCreatePolicyDefinition",
  required: ["name", "privacyPolicy", "schemaVersion"],
  type: "object",
  properties: {
    name: { title: "Name", type: "string" },
    privacyPolicy: { title: "Privacypolicy", type: "object" },
    schemaVersion: { title: "Schemaversion", type: "integer" },
  },
  additionalProperties: false,
};

export const schemaReqDataUpdatePolicyDefinition = {
  title: "ReqDataUpdatePolicyDefinition",
  type: "object",
  properties: {
    name: { title: "Name", type: "string" },
    privacyPolicy: { title: "Privacypolicy", type: "object" },
    schemaVersion: { title: "Schemaversion", type: "integer" },
    publicUrl: { title: "Publicurl", type: "string" },
  },
  additionalProperties: false,
};

export const schemaReqDataCreateUser = {
  title: "ReqDataCreateUser",
  required: ["firstName", "lastName", "email", "username", "password"],
  type: "object",
  properties: {
    firstName: { title: "Firstname", maxLength: 255, type: "string" },
    lastName: { title: "Lastname", maxLength: 255, type: "string" },
    email: { title: "Email", type: "string", format: "email" },
    username: { title: "Username", maxLength: 255, type: "string" },
    password: { title: "Password", maxLength: 72, type: "string" },
  },
  additionalProperties: false,
};
