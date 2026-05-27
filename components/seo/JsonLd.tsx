// JSON-LD 構造化データの埋め込み — docs/_shared/seo §1
// data は**静的な構造化データのみ**（ユーザー入力を含めない）。"<" をエスケープして
// </script> ブレイクアウトを防ぐ（SEC-003 の禁止対象はユーザー本文。本用途は静的データで、
// 唯一の XSS ベクタである </script> を無害化済み = 安全な JSON-LD 埋め込みの定石）。
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
