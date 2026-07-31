export type LanguageMode = "ja" | "vi";

export const wedding = {
  groomName: "Thái Ngọc",
  brideName: "Ngọc Linh",
  weddingDate: "2026-10-12",
  weddingDateDisplay: { ja: "2026年10月12日", vi: "12.10.2026" },
  weekday: { ja: "月曜日", vi: "Thứ Hai" },
  receptionTime: "14:30",
  ceremonyTime: "15:00",
  venueName: { ja: "新婦宅", vi: "Tại nhà cô dâu" },
  venueAddress: {
    ja: "住所：ベトナム・フートー省・ノンチャン坊・カムドイ・第9組",
    vi: "Địa chỉ: Đội 9, Cẩm Đội, phường Nông Trang, tỉnh Phú Thọ",
  },
  venuePhone: "",
  googleMapsUrl:
    "https://www.google.com/maps?q=21.33199519890027,105.35638231689768",
  replyDeadline: "2026-09-15",
  replyDeadlineDisplay: { ja: "2026年9月15日", vi: "15.09.2026" },
  coverImage: "/wedding-cover-mobile.jpg",
  ogImage: "/og-wedding.png",
  publicUrl:
    "https://wedding-invitation-jp-vn.vothaingoc1991.chatgpt.site",
  rsvpEndpoint:
    "https://docs.google.com/forms/d/e/1FAIpQLSfeipE5jx_QjrvkRQfK-W8YrsRmFv1r42Km21t7SBDrHZPReQ/formResponse",
  rsvpEntryId: "entry.1680294984",
  showTimeline: false,
  languages: ["ja", "vi"] as LanguageMode[],
  timeline: [
    { time: "10:30", label: { ja: "受付", vi: "Đón khách" } },
    { time: "11:00", label: { ja: "挙式", vi: "Lễ thành hôn" } },
    { time: "12:00", label: { ja: "披露宴", vi: "Tiệc cưới" } },
    { time: "14:30", label: { ja: "お開き", vi: "Kết thúc" } },
  ],
  heroMessage: {
    ja: "皆様にお会いできることを\n心より楽しみにしております。",
    vi: "Chúng tôi rất mong được gặp mọi người\ntrong ngày đặc biệt này.",
  },
  greeting: {
    ja: [
      "このたび 私たちは結婚式を挙げることとなりました。",
      "日頃お世話になっている皆様へ\n感謝の気持ちをお伝えしたく\nささやかな披露宴を開催いたします。",
      "皆様にお越しいただけることが\n私たち家族にとって何よりの喜びであり\nこの上ない光栄でございます。",
      "ご多用のところ恐縮ではございますが\nぜひご出席いただけますと幸いです。",
    ],
    vi: [
      "Chúng tôi trân trọng thông báo rằng lễ thành hôn của chúng tôi sẽ được tổ chức trong thời gian tới.",
      "Với mong muốn gửi lời cảm ơn đến những người đã luôn yêu thương và đồng hành cùng chúng tôi, gia đình xin tổ chức một buổi tiệc thân mật.",
      "Sự hiện diện của quý vị là niềm vui và niềm vinh hạnh lớn lao đối với gia đình chúng tôi.",
      "Gia đình rất mong được đón tiếp quý vị trong ngày đặc biệt này.",
    ],
  },
  noGiftMessage: {
    title: { ja: "私たちからのお願い", vi: "Lời nhắn từ gia đình" },
    ja: [
      "皆様にお越しいただき\n大切な時間を共に過ごしていただけることが\n私たち家族にとって何よりの贈り物です。",
      "誠に恐縮ではございますが\nご祝儀やお祝いのお品物などのお心遣いは\n謹んで辞退申し上げます。",
      "また ご都合によりご出席がかなわない場合も\nお祝いのお気持ちや温かいお言葉だけ\n頂戴できましたら幸いです。",
      "どうかお気遣いなく\nお気軽にご参加ください。",
    ],
    vi: [
      "Đối với gia đình chúng tôi, sự hiện diện của quý vị và khoảng thời gian được cùng nhau chia sẻ trong ngày đặc biệt này chính là món quà quý giá nhất.",
      "Vì vậy, gia đình xin phép không nhận tiền mừng hoặc quà mừng dưới bất kỳ hình thức nào.",
      "Trong trường hợp quý vị không thể tham dự, gia đình cũng chỉ xin nhận lời chúc và tình cảm quý báu, xin quý vị đừng gửi tiền mừng hoặc quà tặng.",
      "Kính mong quý vị không bận tâm và vui lòng đến chung vui cùng gia đình một cách thật thoải mái.",
    ],
  },
  footerMessage: {
    ja: "皆様にお会いできますことを\n家族一同 心より楽しみにしております。",
    vi: "Ngày đặc biệt sẽ trở nên trọn vẹn hơn khi có sự hiện diện của quý vị.",
  },
} as const;
