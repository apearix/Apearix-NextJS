import { CAPTCHA_TYPES } from "@/components/common/captcha/CaptchaField";

type CaptchaType = (typeof CAPTCHA_TYPES)[keyof typeof CAPTCHA_TYPES];

function isTruthySetting(value: unknown) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function getSetting(settings: any, key: string, fallback: unknown = "") {
  if (Array.isArray(settings)) {
    const item = settings.find((setting) => setting?.key === key);
    return item?.resolved_value ?? item?.value ?? fallback;
  }

  return settings?.[key] ?? fallback;
}

export function getAuthCaptchaConfig(settings: any) {
  const type = getSetting(settings, "recaptcha_type", CAPTCHA_TYPES.GOOGLE);
  const siteKey = String(
    getSetting(settings, "google_recaptcha_site_key", "") ||
      process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY ||
      "",
  ).trim();

  return {
    enabled: isTruthySetting(getSetting(settings, "recaptcha", false)),
    type: (type === CAPTCHA_TYPES.CHARACTERS
      ? CAPTCHA_TYPES.CHARACTERS
      : CAPTCHA_TYPES.GOOGLE) as CaptchaType,
    siteKey,
  };
}

export function createCaptchaState(type: CaptchaType = CAPTCHA_TYPES.GOOGLE) {
  return {
    type,
    valid: false,
    token: "",
  };
}

export function validateCaptcha(config: ReturnType<typeof getAuthCaptchaConfig>, captcha: ReturnType<typeof createCaptchaState>) {
  if (!config.enabled) return "";

  if (config.type === CAPTCHA_TYPES.GOOGLE && !config.siteKey) {
    return "Google reCAPTCHA is not configured";
  }

  return captcha.valid ? "" : "Complete captcha verification";
}

export function buildCaptchaPayload(
  config: ReturnType<typeof getAuthCaptchaConfig>,
  captcha: ReturnType<typeof createCaptchaState>,
  action: string,
) {
  if (!config.enabled) return {};

  return {
    captcha_type: config.type,
    captcha_token: captcha.token,
    captcha_action: action,
  };
}
