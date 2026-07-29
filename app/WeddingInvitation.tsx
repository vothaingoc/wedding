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
  eyebrow,
  ja,
  vi,
}: {
  eyebrow: string;
  ja: string;
  vi: string;
}) {
  return (
    <header className="section-heading">
      <span>{eyebrow}</span>
      <h2 lang="ja">{ja}</h2>
      <p>{vi}</p>
    </header>
  );
}

export default function WeddingInvitation() {
  const [language, setLanguage] = useState<LanguageMode>("both");
  const [form, setForm] = useState<RsvpData>(emptyRsvp);
  const [formState, setFormState] = useState<
    "idle" | "sending" | "success" | "demo" | "error" | "copied"
  >("idle");
  const rootRef = useRef<HTMLElement>(null);

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

  async function copyResponse() {
    await navigator.clipboard.writeText(responseText);
    setFormState("copied");
  }

  async function shareResponse() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "結婚式出欠回答・Xác nhận tham dự",
          text: responseText,
        });
        return;
      } catch {
        return;
      }
    }
    await copyResponse();
    window.open(
      `https://line.me/R/msg/text/?${encodeURIComponent(responseText)}`,
      "_blank",
      "noopener,noreferrer",
    );
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
      setFormState("success");
    } catch {
      setFormState("error");
    }
  }

  return (
    <main ref={rootRef}>
      <div className="language-switcher" aria-label="Chọn ngôn ngữ">
        {([
          ["ja", "日本語"],
          ["vi", "Tiếng Việt"],
          ["both", "日本語・Việt"],
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
          alt={`${wedding.groomName} và ${wedding.brideName}`}
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="hero-kicker">WEDDING INVITATION</p>
          <div className="hero-mark" aria-hidden="true">結</div>
          <h1>
            <span>{wedding.groomName}</span>
            <em>&amp;</em>
            <span>{wedding.brideName}</span>
          </h1>
          <div className="hero-date">{wedding.weddingDateDisplay}</div>
          <LanguageBlock
            mode={language}
            ja={<Lines text={wedding.heroMessage.ja} />}
            vi={<Lines text={wedding.heroMessage.vi} />}
            className="hero-message"
          />
          <a className="scroll-cue" href="#greeting" aria-label="Xem thiệp mời">
            <span />
            SCROLL
          </a>
        </div>
      </section>

      <section id="greeting" className="section invitation-intro reveal">
        <div className="enso" aria-hidden="true">縁</div>
        <SectionHeading eyebrow="OUR INVITATION" ja="ご挨拶" vi="Lời chào" />
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
          <SectionHeading eyebrow="WEDDING DAY" ja="日時・会場" vi="Thời gian & địa điểm" />
          <div className="date-display">
            <strong>{wedding.weddingDateDisplay}</strong>
            <LanguageBlock mode={language} ja={wedding.weekday.ja} vi={wedding.weekday.vi} />
          </div>
          <div className="time-grid">
            <div>
              <span>RECEPTION</span>
              <strong>{wedding.receptionTime}</strong>
              <LanguageBlock mode={language} ja="受付" vi="Đón khách" />
            </div>
            <div className="time-divider" aria-hidden="true" />
            <div>
              <span>CEREMONY</span>
              <strong>{wedding.ceremonyTime}</strong>
              <LanguageBlock mode={language} ja="挙式" vi="Bắt đầu" />
            </div>
          </div>
          <div className="venue">
            <span className="venue-icon" aria-hidden="true">⌖</span>
            <h3>{wedding.venueName}</h3>
            <p>{wedding.venueAddress}</p>
            {wedding.venuePhone && (
              <a href={`tel:${wedding.venuePhone}`}>{wedding.venuePhone}</a>
            )}
          </div>
          <a className="primary-button" href={wedding.googleMapsUrl} target="_blank" rel="noreferrer">
            <span lang="ja">Google Mapで確認</span>
            <span>Xem trên Google Maps</span>
          </a>
        </div>
      </section>

      {wedding.showTimeline && (
        <section className="section timeline-section reveal">
          <SectionHeading eyebrow="SCHEDULE" ja="当日の流れ" vi="Lịch trình" />
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
            eyebrow="A NOTE FROM US"
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
            eyebrow="RÉPONDEZ S’IL VOUS PLAÎT"
            ja="ご出欠のご回答"
            vi="Xác nhận tham dự"
          />
          <div className="deadline">
            <span lang="ja">回答期限：{wedding.replyDeadlineDisplay}</span>
            <span>Vui lòng phản hồi trước ngày {wedding.replyDeadlineDisplay}.</span>
          </div>
          {deadlinePassed && (
            <div className="deadline-note" role="status">
              <p lang="ja">回答期限を過ぎていますので、送信後に新郎新婦へ直接ご連絡ください。</p>
              <p>Đã quá hạn phản hồi, sau khi gửi vui lòng liên hệ trực tiếp với cô dâu chú rể.</p>
            </div>
          )}

          <form onSubmit={submitRsvp}>
            <label className="field">
              <span>お名前・Họ và tên <b>*</b></span>
              <input required name="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Nguyễn Văn A" autoComplete="name" />
            </label>

            <fieldset>
              <legend>ご出欠・Xác nhận <b>*</b></legend>
              <label className="radio-card">
                <input type="radio" name="attendance" value="yes" checked={form.attendance === "yes"} onChange={() => updateField("attendance", "yes")} />
                <span><strong lang="ja">出席します</strong>Tôi sẽ tham dự</span>
              </label>
              <label className="radio-card">
                <input type="radio" name="attendance" value="no" checked={form.attendance === "no"} onChange={() => updateField("attendance", "no")} />
                <span><strong lang="ja">欠席します</strong>Tôi không thể tham dự</span>
              </label>
            </fieldset>

            <label className="field">
              <span>ご参加人数・Số người tham dự</span>
              <select name="guestCount" value={form.guestCount} onChange={(e) => updateField("guestCount", e.target.value)} disabled={form.attendance === "no"}>
                {[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count}</option>)}
              </select>
            </label>
            <label className="field">
              <span>お連れ様・Tên người đi cùng</span>
              <input name="companions" value={form.companions} onChange={(e) => updateField("companions", e.target.value)} disabled={form.attendance === "no"} />
            </label>
            <label className="field">
              <span>アレルギー・Dị ứng / yêu cầu món ăn</span>
              <textarea name="allergies" rows={3} value={form.allergies} onChange={(e) => updateField("allergies", e.target.value)} disabled={form.attendance === "no"} />
            </label>
            <label className="field">
              <span>メッセージ・Lời nhắn cho cô dâu chú rể</span>
              <textarea name="message" rows={4} value={form.message} onChange={(e) => updateField("message", e.target.value)} />
            </label>
            <label className="field">
              <span>ご連絡先・Số điện thoại hoặc email</span>
              <input name="contact" value={form.contact} onChange={(e) => updateField("contact", e.target.value)} placeholder="Không bắt buộc" />
            </label>

            <label className="confirm-row">
              <input required type="checkbox" checked={form.confirmed} onChange={(e) => updateField("confirmed", e.target.checked)} />
              <span><b lang="ja">内容を確認しました。</b>Tôi đã kiểm tra nội dung trả lời.</span>
            </label>

            <button className="submit-button" type="submit" disabled={formState === "sending"}>
              <span lang="ja">{formState === "sending" ? "送信中…" : "回答を送信する"}</span>
              <span>{formState === "sending" ? "Đang gửi…" : "Gửi xác nhận"}</span>
            </button>

            {formState !== "idle" && (
              <div className={`form-notice notice-${formState}`} role="status" aria-live="polite">
                {formState === "demo" && (
                  <>
                    <p>フォームは現在テストモードです。Form đang ở chế độ thử nghiệm và chưa gửi dữ liệu.</p>
                    <button type="button" onClick={copyResponse}>Sao chép nội dung・内容をコピー</button>
                  </>
                )}
                {formState === "success" && <p>ご回答ありがとうございます。Cảm ơn bạn đã gửi xác nhận.</p>}
                {formState === "error" && <p>Không thể gửi lúc này. Vui lòng dùng nút LINE bên dưới.</p>}
                {formState === "copied" && <p>Đã sao chép nội dung・回答内容をコピーしました。</p>}
              </div>
            )}

            <div className="or-divider"><span>OR・HOẶC</span></div>
            <button className="line-button" type="button" onClick={shareResponse}>
              <span className="line-badge">LINE</span>
              <span>LINEで回答を送る<small>Gửi câu trả lời qua LINE</small></span>
            </button>
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
        <p className="footer-date">{wedding.weddingDateDisplay}</p>
      </footer>
    </main>
  );
}
