import type { BilingualIndustry } from './types'

export const industries: BilingualIndustry[] = [
  {
    id: 'ind-international',
    slug: 'international-companies',
    nameEn: 'International Companies',
    nameJa: '外資系企業',
    descriptionEn:
      'Global organizations entering or expanding in Japan need a production partner who can translate a regional or global event standard into local execution — venue norms, permitting, language, and vendor practices included.',
    descriptionJa:
      '日本市場への参入・拡大を進めるグローバル企業には、地域・グローバル基準のイベントを現地で確実に実行できるパートナーが必要です。会場慣習、許認可、言語、ベンダー慣行まで含めて対応します。',
    useCasesEn: [
      'Regional headquarters launches and town halls',
      'APAC sales kickoffs and partner conferences',
      'Global brand campaigns adapted for the Japan market',
    ],
    useCasesJa: [
      '地域統括拠点の設立イベント・タウンホール',
      'APAC営業キックオフ・パートナーカンファレンス',
      '日本市場向けにローカライズしたグローバルブランドキャンペーン',
    ],
  },
  {
    id: 'ind-japanese-corporations',
    slug: 'japanese-corporations',
    nameEn: 'Japanese Corporations',
    nameJa: '日本企業',
    descriptionEn:
      'Established Japanese enterprises rely on us for the technical precision and quiet reliability their internal stakeholders expect, from shareholder meetings to nationwide dealer conferences.',
    descriptionJa:
      '株主総会から全国代理店会議まで、社内外の関係者が期待する技術的な精度と静かな信頼性を、老舗の日本企業様にご提供しています。',
    useCasesEn: [
      'Shareholder and general meetings',
      'Internal conferences and dealer/agency events',
      'New product and service announcements',
    ],
    useCasesJa: [
      '株主総会・総会',
      '社内カンファレンス・代理店イベント',
      '新製品・新サービス発表会',
    ],
  },
  {
    id: 'ind-event-agencies',
    slug: 'event-agencies',
    nameEn: 'Event & PR Agencies',
    nameJa: 'イベント・PR代理店',
    descriptionEn:
      'Agencies bring us in as the technical production partner behind their creative and client relationship — we work under your brand, in your run-of-show, without friction.',
    descriptionJa:
      '代理店様のクリエイティブとクライアントリレーションを支える技術制作パートナーとして、貴社のブランドの下、貴社の進行台本に沿って、摩擦なく対応します。',
    useCasesEn: [
      'White-label technical production for agency-led events',
      'Rapid-turnaround activations and press events',
      'Multi-market campaigns requiring a Japan production partner',
    ],
    useCasesJa: [
      '代理店主導イベント向けのホワイトレーベル技術制作',
      '短納期のアクティベーション・プレスイベント',
      '日本での制作パートナーを必要とするマルチマーケットキャンペーン',
    ],
  },
  {
    id: 'ind-exhibition-organizers',
    slug: 'exhibition-organizers',
    nameEn: 'Exhibition Organizers',
    nameJa: '展示会主催者',
    descriptionEn:
      'Trade show and exhibition organizers need a partner who understands hall logistics, exhibitor coordination, and the compressed build/strike windows unique to large-format events.',
    descriptionJa:
      '見本市・展示会の主催者様には、会場ロジスティクス、出展社対応、大規模イベント特有の限られた搬入出時間を理解したパートナーが必要です。',
    useCasesEn: [
      'Convention center-scale trade shows',
      'Multi-hall exhibitions with parallel programming',
      'Exhibitor booth and pavilion technical services',
    ],
    useCasesJa: [
      'コンベンションセンター規模の見本市',
      '複数ホールで並行プログラムを行う展示会',
      '出展ブース・パビリオンの技術サービス',
    ],
  },
  {
    id: 'ind-government',
    slug: 'government-organizations',
    nameEn: 'Government Organizations',
    nameJa: '官公庁',
    descriptionEn:
      'Public-sector events carry procurement, security, and protocol requirements that differ materially from corporate work — we run to that standard as a matter of course.',
    descriptionJa:
      '公共機関のイベントには、企業案件とは大きく異なる調達・警備・プロトコル要件が伴います。私たちはその基準に沿って対応することを前提としています。',
    useCasesEn: [
      'Ministry and municipal conferences and forums',
      'Public consultations and press briefings',
      'International summits and diplomatic events',
    ],
    useCasesJa: [
      '省庁・自治体のカンファレンス・フォーラム',
      'パブリックコンサルテーション・記者会見',
      '国際サミット・外交イベント',
    ],
  },
  {
    id: 'ind-universities',
    slug: 'universities',
    nameEn: 'Universities & Academic Institutions',
    nameJa: '大学・学術機関',
    descriptionEn:
      'From academic symposia to graduation ceremonies, university events combine large audiences, strict scheduling, and often a hybrid or livestreamed component for remote attendees and alumni.',
    descriptionJa:
      '学術シンポジウムから卒業式まで、大学のイベントは多数の参加者、厳格なスケジュール、そして遠隔参加者・卒業生向けのハイブリッド・ライブ配信を伴うことが多いのが特徴です。',
    useCasesEn: [
      'International symposia and research conferences',
      'Graduation and commencement ceremonies',
      'Open campus events and admissions presentations',
    ],
    useCasesJa: [
      '国際シンポジウム・研究カンファレンス',
      '卒業式・学位授与式',
      'オープンキャンパス・入試説明会',
    ],
  },
  {
    id: 'ind-hotels',
    slug: 'hotels',
    nameEn: 'Hotels & MICE Venues',
    nameJa: 'ホテル・MICE施設',
    descriptionEn:
      'We partner with hotel and venue teams as a preferred technical vendor — supplying equipment, engineering, and crew that meet the venue\'s house standards without disrupting their operations.',
    descriptionJa:
      'ホテル・会場チームの優先技術ベンダーとして、施設の運営を妨げることなく、館内基準を満たす機材・エンジニアリング・クルーを提供します。',
    useCasesEn: [
      'Ballroom and banquet AV upgrades for signature events',
      'Preferred-vendor technical partnerships',
      'Convention and conference center production support',
    ],
    useCasesJa: [
      '主要イベント向けの宴会場・バンケットAVアップグレード',
      '優先ベンダーとしての技術パートナーシップ',
      'コンベンション・カンファレンスセンターの制作サポート',
    ],
  },
  {
    id: 'ind-mice',
    slug: 'mice-clients',
    nameEn: 'MICE Clients',
    nameJa: 'MICEクライアント',
    descriptionEn:
      'Meetings, incentives, conferences, and exhibitions each carry a distinct production profile — we scope and staff to the specific format rather than applying one template across all four.',
    descriptionJa:
      'ミーティング、インセンティブ、カンファレンス、展示会はそれぞれ異なる制作要件を持ちます。私たちは4種類すべてに同じテンプレートを適用するのではなく、形式ごとにスコープと人員を設計します。',
    useCasesEn: [
      'Incentive programs with hybrid and satellite audiences',
      'Multi-day congress and convention production',
      'Executive meetings requiring discretion and precision',
    ],
    useCasesJa: [
      'ハイブリッド・サテライト参加者を伴うインセンティブプログラム',
      '複数日にわたるコングレス・コンベンション制作',
      '慎重さと精度が求められるエグゼクティブミーティング',
    ],
  },
  {
    id: 'ind-luxury',
    slug: 'luxury-brands',
    nameEn: 'Luxury Brands',
    nameJa: 'ラグジュアリーブランド',
    descriptionEn:
      'Luxury clients expect production values that match the brand itself — refined lighting and staging, silent, disciplined crews, and zero tolerance for visible technical seams.',
    descriptionJa:
      'ラグジュアリークライアント様は、ブランドそのものにふさわしい制作品質を求めます。洗練された照明とステージ、静かで統率の取れたクルー、そして技術的な粗が一切見えないことが条件です。',
    useCasesEn: [
      'Product launches and press previews',
      'Flagship store openings and brand experiences',
      'VIP and press event hospitality production',
    ],
    useCasesJa: [
      '製品発表会・プレスプレビュー',
      '旗艦店オープニング・ブランド体験イベント',
      'VIP・プレスイベントのホスピタリティ制作',
    ],
  },
]
