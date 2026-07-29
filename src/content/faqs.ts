import type { BilingualFaq } from './types'

// `slug` mirrors `id` here — both were the same meaningful string in the
// original static content. The DB migration (0014_faqs_slug.sql) backfills
// `slug` with these exact values against the new generated-UUID `id`.
const rawFaqs: Omit<BilingualFaq, 'slug'>[] = [
  {
    id: 'faq-who-we-work-with',
    category: 'general',
    questionEn: 'What kinds of clients does TOTAL MEDIA work with?',
    questionJa: 'TOTAL MEDIAはどのようなクライアントと取引していますか？',
    answerEn:
      'We work with international corporations, Japanese enterprises, event and PR agencies, exhibition organizers, government bodies, universities, hotels and MICE venues, and luxury brands operating in Japan. Roughly half of our engagements involve at least one non-Japanese stakeholder, so bilingual project management is standard on every account, not an add-on.',
    answerJa:
      '外資系企業、日本企業、イベント・PR代理店、展示会主催者、官公庁、大学、ホテル・MICE施設、そして日本で事業を展開するラグジュアリーブランドなど、幅広いお客様にご利用いただいています。案件の約半数は海外の関係者が関わっており、バイリンガルのプロジェクトマネジメントはオプションではなく、すべての案件で標準対応です。',
  },
  {
    id: 'faq-nationwide-coverage',
    category: 'general',
    questionEn: 'Do you operate outside Tokyo?',
    questionJa: '東京以外でも対応可能ですか？',
    answerEn:
      'Yes. We deliver events across Japan — from major convention centers in Tokyo, Osaka, and Nagoya to regional venues, hotel ballrooms, and outdoor sites nationwide. Our equipment and crew logistics are built around national coverage, not a single-city footprint.',
    answerJa:
      'はい、対応可能です。東京・大阪・名古屋の主要コンベンションセンターから、地方の会場、ホテルの宴会場、全国の屋外会場まで、日本全国でイベントを実施しています。機材・クルーのロジスティクスは、単一都市ではなく全国対応を前提に構築しています。',
  },
  {
    id: 'faq-quote-turnaround',
    category: 'quotes-pricing',
    questionEn: 'How long does it take to receive a quote?',
    questionJa: '見積もりはどのくらいで届きますか？',
    answerEn:
      'Standard requests through our Request a Quote form receive a detailed proposal within one to two business days. Complex, multi-day, or hybrid productions with custom technical designs typically take three to five business days, since we prepare an initial technical plan alongside the quote rather than a rough estimate.',
    answerJa:
      '「見積もりを依頼する」フォームからの標準的なご依頼には、1〜2営業日以内に詳細なご提案をお送りします。複数日にわたる案件やカスタム技術設計を伴うハイブリッド制作など複雑な案件は、概算ではなく初期技術プランもあわせて準備するため、通常3〜5営業日ほどいただいています。',
  },
  {
    id: 'faq-pricing-basis',
    category: 'quotes-pricing',
    questionEn: 'How is pricing structured?',
    questionJa: '料金体系はどのようになっていますか？',
    answerEn:
      'Pricing depends on event format, venue, duration, equipment specification, and staffing needs — there is no flat rate, because a boardroom AV setup and a two-day hybrid conference are fundamentally different jobs. Every proposal itemizes equipment, labor, and production management separately so you can see exactly what you are paying for and adjust scope if needed.',
    answerJa:
      '料金は、イベント形式、会場、期間、機材の仕様、必要な人員によって決まります。会議室のAVセットアップと2日間のハイブリッドカンファレンスでは根本的に異なる案件のため、一律料金はございません。すべての提案書で機材費・人件費・制作管理費を項目ごとに分けて明示していますので、内訳をご確認のうえ必要に応じてスコープを調整いただけます。',
  },
  {
    id: 'faq-deposit-payment',
    category: 'quotes-pricing',
    questionEn: 'What are your payment terms?',
    questionJa: 'お支払い条件を教えてください。',
    answerEn:
      'Most engagements require a signed proposal and a deposit to confirm the date and reserve equipment and crew, with the balance due on a schedule agreed in the contract — typically before or shortly after the event, depending on client type and event size. Government and university clients can be accommodated under standard procurement and invoicing cycles.',
    answerJa:
      '多くの案件では、署名済みの提案書と、日程確定・機材およびクルー確保のための頭金をいただき、残額は契約で合意したスケジュール（通常はイベント前後）でお支払いいただきます。官公庁・大学のお客様は、通常の調達・請求サイクルに合わせて対応可能です。',
  },
  {
    id: 'faq-equipment-only',
    category: 'equipment',
    questionEn: 'Can we rent equipment only, without your production team?',
    questionJa: '制作チームなしで機材のみのレンタルは可能ですか？',
    answerEn:
      'Yes. Equipment rental is available on its own for clients who have in-house technical staff or an existing production partner. That said, most first-time clients find that adding our technicians for setup, operation, and strike is a small cost relative to the risk of running unfamiliar equipment without support on the day.',
    answerJa:
      'はい、可能です。社内に技術スタッフがいらっしゃる場合や、既存の制作パートナーがいらっしゃる場合は、機材のみのレンタルもご利用いただけます。ただし、初めてご利用のお客様の多くは、当日サポートなしで不慣れな機材を操作するリスクに比べ、設営・運用・撤収を担当する弊社技術者を追加する費用は小さいと感じられています。',
  },
  {
    id: 'faq-equipment-brands',
    category: 'equipment',
    questionEn: 'What equipment brands and standards do you work with?',
    questionJa: 'どのようなブランド・基準の機材を使用していますか？',
    answerEn:
      'Our LED, audio, lighting, and rigging inventory is sourced to broadcast and touring-grade specification, maintained on a fixed inspection schedule, and rotated regularly rather than run to end of life. Full specifications for each category are listed on the equipment catalogue, and we\'re glad to confirm exact models for a given proposal.',
    answerJa:
      'LED、音響、照明、リギングの機材は放送・ツアーグレードの仕様で調達し、定期点検スケジュールに沿って維持管理し、寿命まで使い切るのではなく定期的に入れ替えています。各カテゴリーの詳しい仕様は機材カタログに掲載しており、ご提案の際に具体的な機種もご案内いたします。',
  },
  {
    id: 'faq-lead-time',
    category: 'planning',
    questionEn: 'How far in advance should we book?',
    questionJa: 'どのくらい前に予約すればよいですか？',
    answerEn:
      'For standard corporate events and conferences, four to six weeks gives us comfortable room for planning, venue coordination, and equipment allocation. Large exhibitions, award ceremonies, or events requiring custom staging and international logistics benefit from eight to twelve weeks. We do take on shorter-notice requests when our schedule allows — reach out and we\'ll tell you honestly whether the timeline works.',
    answerJa:
      '標準的な企業イベント・カンファレンスの場合、4〜6週間前にご相談いただければ、企画・会場調整・機材手配に十分な余裕を持って対応できます。大規模な展示会、授賞式、カスタムステージや海外ロジスティクスを伴うイベントの場合は、8〜12週間前が理想的です。スケジュールに余裕がある場合は短納期のご依頼にも対応可能ですので、まずはお気軽にご相談ください。対応可否を正直にお伝えします。',
  },
  {
    id: 'faq-venue-site-visit',
    category: 'planning',
    questionEn: 'Do you conduct site visits before an event?',
    questionJa: '事前の現地視察は行いますか？',
    answerEn:
      'For any event involving structural rigging, large-format LED, or a venue we haven\'t worked in before, yes — a technical site visit or a detailed floor plan and load-in review is standard practice, not optional. It\'s how we catch power, access, and rigging constraints before they become event-day problems.',
    answerJa:
      '構造リギング、大型LED、または初めて利用する会場が関わるイベントについては、技術的な現地視察、または詳細なフロアプラン・搬入経路のレビューを標準対応として必ず実施します。これにより、電源・動線・リギングの制約を当日の問題になる前に把握できます。',
  },
  {
    id: 'faq-international-language',
    category: 'planning',
    questionEn: 'Can you support events run partly or entirely in English?',
    questionJa: '一部または全体を英語で進行するイベントにも対応できますか？',
    answerEn:
      'Yes — bilingual (Japanese/English) project management and on-site coordination are standard for our international clients, and we regularly support simultaneous interpretation booths, multilingual signage, and run-of-show documentation in both languages.',
    answerJa:
      'はい、対応可能です。海外のお客様向けに、日本語・英語のバイリンガルプロジェクトマネジメントと現地コーディネーションを標準で提供しており、同時通訳ブース、多言語サイン、両言語での進行台本作成にも日常的に対応しています。',
  },
  {
    id: 'faq-hybrid-virtual-reliability',
    category: 'technical',
    questionEn: 'How do you ensure reliability for live streaming and hybrid events?',
    questionJa: 'ライブ配信・ハイブリッドイベントの信頼性はどのように確保していますか？',
    answerEn:
      'Every hybrid or virtual production runs on redundant internet circuits, backup encoding paths, and a dedicated technical director monitoring the stream separately from the in-room show — so a connectivity issue on one path doesn\'t take the broadcast down. We also run a full technical rehearsal against the live platform before any hybrid event, not just a sound check.',
    answerJa:
      'すべてのハイブリッド・バーチャル制作は、冗長化されたインターネット回線、バックアップエンコードパス、そして会場運営とは別に配信のみを監視する専任テクニカルディレクターの体制で運用しています。そのため、一方の回線に問題が発生しても配信が停止することはありません。また、すべてのハイブリッドイベントで、サウンドチェックだけでなく実際の配信プラットフォームを使った本番同様の技術リハーサルを実施しています。',
  },
  {
    id: 'faq-power-rigging-safety',
    category: 'technical',
    questionEn: 'How do you handle power and rigging safety?',
    questionJa: '電源・リギングの安全性についてはどのように対応していますか？',
    answerEn:
      'All power distribution and structural rigging is designed and signed off by licensed technicians against the venue\'s documented load limits, with redundant circuits for anything broadcast-critical. This is treated as a compliance requirement, not a line item to shortcut on tighter budgets.',
    answerJa:
      'すべての電源分配・構造リギングは、有資格の技術者が会場の規定荷重制限に基づいて設計・承認し、放送に関わる重要な工程には冗長回線を用意しています。これはコンプライアンス上の必須要件として扱っており、予算の都合で省略する項目ではありません。',
  },
  {
    id: 'faq-what-makes-different',
    category: 'general',
    questionEn: 'How is TOTAL MEDIA different from a pure equipment rental company?',
    questionJa: '単なる機材レンタル会社とTOTAL MEDIAの違いは何ですか？',
    answerEn:
      'Equipment rental is one part of what we do, not the business itself. Our team plans the event, designs the technical production, manages the exhibition or conference on-site, and operates the equipment — which means one accountable partner instead of you coordinating separate vendors for planning, staging, AV, and streaming.',
    answerJa:
      '機材レンタルは私たちの事業の一部であり、事業そのものではありません。私たちのチームはイベントの企画、技術制作の設計、展示会・カンファレンスの現地運営、そして機材の操作までを担います。つまり、企画・ステージ・AV・配信をそれぞれ別のベンダーで調整する代わりに、責任を持つ単一のパートナーとしてご利用いただけます。',
  },
  {
    id: 'faq-staffing-scale',
    category: 'planning',
    questionEn: 'Can you staff large, multi-day events?',
    questionJa: '複数日にわたる大規模イベントの人員体制にも対応できますか？',
    answerEn:
      'Yes. Our production and technical staffing scales from a single technician supporting a boardroom meeting to full crews covering multi-day, multi-hall exhibitions with parallel sessions, live streaming, and simultaneous interpretation running at once.',
    answerJa:
      'はい、対応可能です。会議室での1名体制のサポートから、並行セッション・ライブ配信・同時通訳が同時進行する複数日・複数ホールの展示会をカバーするフルクルー体制まで、規模に応じて人員を編成します。',
  },
]

export const faqs: BilingualFaq[] = rawFaqs.map((f) => ({ ...f, slug: f.id }))
