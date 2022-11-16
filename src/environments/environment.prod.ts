export const environment = {
  production: true,
  // authenticationMethod: "password",
  authenticationMethod: "sso",
  logoutUrl: "$base_url/sso/redirect?logout=$redirect_url",
};
