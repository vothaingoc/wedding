"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { LanguageMode, wedding } from "../src/config/wedding";

type RsvpData = {
  name: string;
  attendance: "yes" | "no";
  guestCount: string;
  companions: string;
  allergies: string;
  message: string;
  contact: string;
  confirmed: boolean;
};

const emptyRsvp: RsvpData = {
  name: "",
  attendance: "yes",
  guestCount: "1",
  companions: "",
  allergies: "",
  message: "",
  contact: "",
  confirmed: false,
};

function Lines({ text }: { text: string }) {
  return text.split("\n").map((line, index, all) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < all.length - 1 && <br />}
    </span>
  ));
}

function LanguageBlock({
  mode,
  ja,
  vi,
  className = "",
}: {
  mode: LanguageMode;
  ja: React.ReactNode;
  vi: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`language-block mode-${mode} ${className}`}>
      {mode !== "vi" && <div lang="ja" className="copy-ja">{ja}</div>}
      {mode !== "ja" && <div lang="vi" className="copy-vi">{vi}</div>}
    </div>
  );
}

function SectionHeading({
  mode,
  eyebrow,
  ja,
  vi,
}: {
  mode: LanguageMode;
  eyebrow: { ja: string; vi: string };
  ja: string;
  vi: string;
}) {
  return (
    <header className="section-heading">
      <span lang={mode}>{mode === "ja" ? eyebrow.ja : eyebrow.vi}</span>
      <h2 lang={mode}>{mode === "ja" ? ja : vi}</h2>
    </header>
  );
}

function ThankYouView({ language }: { language: LanguageMode }) {
  const isJapanese = language === "ja";

  return (
    <main className="thank-you-page" lang={language}>
      <section className="thank-you-card" aria-labelledby="thank-you-title">
        <div className="thank-you-ring" aria-hidden="true">
          <span>✓</span>
        </div>
        <p className="thank-you-eyebrow">
          {isJapanese ? "ご回答を受け付けました" : "ĐÃ NHẬN PHẢN HỒI"}
        </p>
        <h1 id="thank-you-title">
          {isJapanese ? "心よりありがとうございます" : "Chân thành cảm ơn"}
        </h1>
        <p className="thank-you-lead">
          {isJapanese
            ? "ご回答は正常に送信され、確かに受け付けました。"
            : "Phản hồi của bạn đã được gửi thành công và chúng tôi đã nhận được thông tin."}
        </p>
        <div className="thank-you-divider" aria-hidden="true" />
        <p className="thank-you-note">
          {isJapanese
            ? "当日お会いできますことを、家族一同心より楽しみにしております。このページは閉じていただいて構いません。"
            : "Gia đình rất mong được đón tiếp bạn trong ngày vui. Bạn có thể đóng trang này."}
        </p>
        <div className="thank-you-names">
          {wedding.groomName} <span>&amp;</span> {wedding.brideName}
        </div>
        <p className="thank-you-date">{wedding.weddingDateDisplay[language]}</p>
      </section>
    </main>
  );
}

export default function WeddingInvitation() {
  const [language, setLanguage] = useState<LanguageMode>("vi");
  const [completedLanguage, setCompletedLanguage] = useState<LanguageMode | null>(null);
  const [form, setForm] = useState<RsvpData>(emptyRsvp);
  const [formState, setFormState] = useState<
    "idle" | "sending" | "demo" | "error"
  >("idle");
  const rootRef = useRef<HTMLElement>(null);
  const isJapanese = language === "ja";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 },
    );
    const elements = rootRef.current?.querySelectorAll(".reveal");
    elements?.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("rsvp") !== "complete") return;

    const submittedLanguage: LanguageMode = params.get("lang") === "ja" ? "ja" : "vi";
    setCompletedLanguage(submittedLanguage);
    document.documentElement.lang = submittedLanguage;
  }, []);

  const deadlinePassed = useMemo(() => {
    const deadline = new Date(`${wedding.replyDeadline}T23:59:59`);
    return !Number.isNaN(deadline.getTime()) && new Date() > deadline;
  }, []);

  const responseText = useMemo(
    () =>
      [
        "【結婚式出欠回答】",
        "",
        `お名前・Họ tên：${form.name || "—"}`,
        `ご出席・Tham dự：${
          form.attendance === "yes"
            ? "出席します・Tôi sẽ tham dự"
            : "欠席します・Tôi không thể tham dự"
        }`,
        `ご参加人数・Số người：${form.guestCount || "—"}`,
        `お連れ様・Người đi cùng：${form.companions || "—"}`,
        `アレルギー・Dị ứng：${form.allergies || "—"}`,
        `メッセージ・Lời nhắn：${form.message || "—"}`,
        `ご連絡先・Liên hệ：${form.contact || "—"}`,
      ].join("\n"),
    [form],
  );

  function updateField<K extends keyof RsvpData>(key: K, value: RsvpData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (formState !== "idle") setFormState("idle");
  }

  async function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.confirmed) return;

    const endpoint =
      import.meta.env.VITE_RSVP_ENDPOINT?.trim() || wedding.rsvpEndpoint;
    if (!endpoint) {
      setFormState("demo");
      return;
    }

    setFormState("sending");
    try {
      const body = wedding.rsvpEntryId
        ? new URLSearchParams({ [wedding.rsvpEntryId]: responseText })
        : new URLSearchParams({
            ...form,
            confirmed: String(form.confirmed),
            submittedAt: new Date().toISOString(),
          });
      await fetch(endpoint, { method: "POST", mode: "no-cors", body });
      const confirmationUrl = new URL(window.location.href);
      confirmationUrl.search = "";
      confirmationUrl.hash = "";
      confirmationUrl.searchParams.set("rsvp", "complete");
      confirmationUrl.searchParams.set("lang", language);
      window.history.replaceState(
        { rsvpComplete: true },
        "",
        `${confirmationUrl.pathname}${confirmationUrl.search}`,
      );
      setForm(emptyRsvp);
      setCompletedLanguage(language);
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch {
      setFormState("error");
    }
  }

  if (completedLanguage) {
    return <ThankYouView language={completedLanguage} />;
  }

  return (
    <main ref={rootRef}>
      <div className="language-switcher" aria-label={isJapanese ? "言語を選択" : "Chọn ngôn ngữ"}>
        {([
          ["ja", "日本語"],
          ["vi", "Tiếng Việt"],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={language === value ? "active" : ""}
            onClick={() => setLanguage(value)}
            aria-pressed={language === value}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="hero">
        <img
          className="hero-image"
          src={wedding.coverImage}
          alt={isJapanese
            ? `${wedding.groomName}と${wedding.brideName}`
            : `${wedding.groomName} và ${wedding.brideName}`}
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="hero-kicker" lang={language}>
            {isJapanese ? "結婚式のご案内" : "THIỆP MỜI ĐÁM CƯỚI"}
          </p>
          <div className="hero-mark" aria-hidden="true">結</div>
          <h1>
            <span>{wedding.groomName}</span>
            <em>&amp;</em>
            <span>{wedding.brideName}</span>
          </h1>
          <div className="hero-date">{wedding.weddingDateDisplay[language]}</div>
          <LanguageBlock
            mode={language}
            ja={<Lines text={wedding.heroMessage.ja} />}
            vi={<Lines text={wedding.heroMessage.vi} />}
            className="hero-message"
          />
          <a
            className="scroll-cue"
            href="#greeting"
            aria-label={isJapanese ? "招待状を見る" : "Xem thiệp mời"}
          >
            <span />
            {isJapanese ? "スクロール" : "XEM THIỆP"}
          </a>
        </div>
      </section>

      <section id="greeting" className="section invitation-intro reveal">
        <div className="enso" aria-hidden="true">縁</div>
        <SectionHeading
          mode={language}
          eyebrow={{ ja: "ご招待", vi: "LỜI MỜI" }}
          ja="ご挨拶"
          vi="Lời chào"
        />
        <LanguageBlock
          mode={language}
          ja={wedding.greeting.ja.map((paragraph) => (
            <p key={paragraph}><Lines text={paragraph} /></p>
          ))}
          vi={wedding.greeting.vi.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          className="prose"
        />
        <div className="signature">
          {wedding.groomName} <span>&amp;</span> {wedding.brideName}
        </div>
      </section>

      <section className="section details-section">
        <div className="details-card reveal">
          <SectionHeading
            mode={language}
            eyebrow={{ ja: "挙式のご案内", vi: "NGÀY CƯỚI" }}
            ja="日時・会場"
            vi="Thời gian & địa điểm"
          />
          <div className="date-display">
            <strong className={isJapanese ? "date-ja" : undefined}>
              {wedding.weddingDateDisplay[language]}
            </strong>
            <LanguageBlock mode={language} ja={wedding.weekday.ja} vi={wedding.weekday.vi} />
          </div>
          <div className="time-grid">
            <div>
              <span>{isJapanese ? "受付" : "ĐÓN KHÁCH"}</span>
              <strong>{wedding.receptionTime}</strong>
              <LanguageBlock mode={language} ja="受付開始" vi="Thời gian đón khách" />
            </div>
            <div className="time-divider" aria-hidden="true" />
            <div>
              <span>{isJapanese ? "披露宴" : "NHẬP TIỆC"}</span>
              <strong>{wedding.banquetTime}</strong>
              <LanguageBlock mode={language} ja="披露宴開始" vi="Bắt đầu nhập tiệc" />
            </div>
          </div>
          <div className="venue">
            <span className="venue-icon" aria-hidden="true">⌖</span>
            <h3 className="venue-title">
              {language !== "vi" && <span lang="ja">{wedding.venueName.ja}</span>}
              {language !== "ja" && <span lang="vi">{wedding.venueName.vi}</span>}
            </h3>
            <p lang={language}>{wedding.venueAddress[language]}</p>
            {wedding.venuePhone && (
              <a href={`tel:${wedding.venuePhone}`}>{wedding.venuePhone}</a>
            )}
          </div>
          <a className="primary-button" href={wedding.googleMapsUrl} target="_blank" rel="noreferrer">
            <span lang={language}>{isJapanese ? "Google マップで確認" : "Xem trên Google Maps"}</span>
          </a>
        </div>
      </section>

      {wedding.showTimeline && (
        <section className="section timeline-section reveal">
          <SectionHeading
            mode={language}
            eyebrow={{ ja: "当日の予定", vi: "LỊCH TRÌNH" }}
            ja="当日の流れ"
            vi="Lịch trình"
          />
          <div className="timeline">
            {wedding.timeline.map((item, index) => (
              <div className="timeline-item" key={`${item.time}-${index}`}>
                <time>{item.time}</time>
                <span className="timeline-dot" />
                <LanguageBlock mode={language} ja={item.label.ja} vi={item.label.vi} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section message-wrap">
        <div className="family-message reveal">
          <div className="olive-symbol" aria-hidden="true">❧</div>
          <SectionHeading
            mode={language}
            eyebrow={{ ja: "私たちから", vi: "LỜI NHẮN" }}
            ja={wedding.noGiftMessage.title.ja}
            vi={wedding.noGiftMessage.title.vi}
          />
          <LanguageBlock
            mode={language}
            ja={wedding.noGiftMessage.ja.map((paragraph) => (
              <p key={paragraph}><Lines text={paragraph} /></p>
            ))}
            vi={wedding.noGiftMessage.vi.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            className="prose"
          />
        </div>
      </section>

      <section className="section rsvp-section" id="rsvp">
        <div className="rsvp-card reveal">
          <SectionHeading
            mode={language}
            eyebrow={{ ja: "ご出欠", vi: "PHẢN HỒI" }}
            ja="ご出欠のご回答"
            vi="Xác nhận tham dự"
          />
          <div className="deadline">
            <span lang={language}>
              {isJapanese
                ? `回答期限：${wedding.replyDeadlineDisplay.ja}`
                : `Vui lòng phản hồi trước ngày ${wedding.replyDeadlineDisplay.vi}.`}
            </span>
          </div>
          {deadlinePassed && (
            <div className="deadline-note" role="status">
              <p lang={language}>
                {isJapanese
                  ? "回答期限を過ぎていますので、送信後に新郎新婦へ直接ご連絡ください。"
                  : "Đã quá hạn phản hồi, sau khi gửi vui lòng liên hệ trực tiếp với cô dâu chú rể."}
              </p>
            </div>
          )}

          <form onSubmit={submitRsvp}>
            <label className="field">
              <span>{isJapanese ? "お名前" : "Họ và tên"} <b>*</b></span>
              <input required name="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder={isJapanese ? "例：山田 太郎" : "Nguyễn Văn A"} autoComplete="name" />
            </label>

            <fieldset>
              <legend>{isJapanese ? "ご出欠" : "Xác nhận tham dự"} <b>*</b></legend>
              <label className="radio-card">
                <input type="radio" name="attendance" value="yes" checked={form.attendance === "yes"} onChange={() => updateField("attendance", "yes")} />
                <span><strong lang={language}>{isJapanese ? "出席します" : "Tôi sẽ tham dự"}</strong></span>
              </label>
              <label className="radio-card">
                <input type="radio" name="attendance" value="no" checked={form.attendance === "no"} onChange={() => updateField("attendance", "no")} />
                <span><strong lang={language}>{isJapanese ? "欠席します" : "Tôi không thể tham dự"}</strong></span>
              </label>
            </fieldset>

            <label className="field">
              <span>{isJapanese ? "ご参加人数" : "Số người tham dự"}</span>
              <select name="guestCount" value={form.guestCount} onChange={(e) => updateField("guestCount", e.target.value)} disabled={form.attendance === "no"}>
                {[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count}</option>)}
              </select>
            </label>
            <label className="field">
              <span>{isJapanese ? "お連れ様のお名前" : "Tên người đi cùng"}</span>
              <input name="companions" value={form.companions} onChange={(e) => updateField("companions", e.target.value)} disabled={form.attendance === "no"} />
            </label>
            <label className="field">
              <span>{isJapanese ? "アレルギー・お食事のご要望" : "Dị ứng / yêu cầu món ăn"}</span>
              <textarea name="allergies" rows={3} value={form.allergies} onChange={(e) => updateField("allergies", e.target.value)} disabled={form.attendance === "no"} />
            </label>
            <label className="field">
              <span>{isJapanese ? "新郎新婦へのメッセージ" : "Lời nhắn cho cô dâu chú rể"}</span>
              <textarea name="message" rows={4} value={form.message} onChange={(e) => updateField("message", e.target.value)} />
            </label>
            <label className="field">
              <span>{isJapanese ? "ご連絡先（電話番号またはメール）" : "Số điện thoại hoặc email"}</span>
              <input name="contact" value={form.contact} onChange={(e) => updateField("contact", e.target.value)} placeholder={isJapanese ? "任意" : "Không bắt buộc"} />
            </label>

            <label className="confirm-row">
              <input required type="checkbox" checked={form.confirmed} onChange={(e) => updateField("confirmed", e.target.checked)} />
              <span><b lang={language}>{isJapanese ? "回答内容を確認しました。" : "Tôi đã kiểm tra nội dung trả lời."}</b></span>
            </label>

            <button className="submit-button" type="submit" disabled={formState === "sending"}>
              <span lang={language}>
                {formState === "sending"
                  ? (isJapanese ? "送信中…" : "Đang gửi…")
                  : (isJapanese ? "回答を送信する" : "Gửi xác nhận")}
              </span>
            </button>

            {formState !== "idle" && (
              <div className={`form-notice notice-${formState}`} role="status" aria-live="polite">
                {formState === "demo" && (
                  <p lang={language}>
                    {isJapanese
                      ? "フォームは現在テストモードのため、回答は送信されていません。"
                      : "Biểu mẫu đang ở chế độ thử nghiệm và chưa gửi dữ liệu."}
                  </p>
                )}
                {formState === "error" && (
                  <p lang={language}>
                    {isJapanese
                      ? "現在送信できません。しばらくしてからもう一度お試しください。"
                      : "Hiện chưa thể gửi. Vui lòng thử lại sau."}
                  </p>
                )}
              </div>
            )}
          </form>
        </div>
      </section>

      <footer>
        <div className="footer-ornament" aria-hidden="true">結</div>
        <LanguageBlock
          mode={language}
          ja={<Lines text={wedding.footerMessage.ja} />}
          vi={wedding.footerMessage.vi}
          className="footer-message"
        />
        <div className="footer-names">
          {wedding.groomName} <span>&amp;</span> {wedding.brideName}
        </div>
        <p className="footer-date">{wedding.weddingDateDisplay[language]}</p>
      </footer>
    </main>
  );
}
