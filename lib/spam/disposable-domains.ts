// 使い捨て/捨てメールドメインの簡易ブロックリスト（静的、ヒューリスティック）。
// 網羅ではなく代表例。必要に応じて追加（軽量 dep への置換も可）。
export const DISPOSABLE_DOMAINS = new Set<string>([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "trashmail.com",
  "yopmail.com",
  "getnada.com",
  "throwawaymail.com",
  "sharklasers.com",
  "maildrop.cc",
  "fakeinbox.com",
]);
