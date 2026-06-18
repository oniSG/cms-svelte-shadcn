// marketingDashboardData.ts
// -----------------------------------------------------------------------------
// Hard-coded sample/placeholder data for the multi-page "Marketing" dashboard.
// Values are static literals (not generated) but chosen to look realistic and
// stay internally consistent:
//   • funnel: sent = delivered + notDelivered, delivered = opened + notOpened …
//   • bounce: reasons and providers each sum to the total
//   • RFM: segment customer counts sum to `totalActiveFans`; KPIs/pie derive from them
//
// Percentages are decimals (0.0259 = 2.59%); format at render time.
// Dates are ISO strings. Czech labels kept to match the source dashboard.
// -----------------------------------------------------------------------------

/* ============================================================================
 *  Types
 * ========================================================================== */

export type TrendDir = "up" | "down" | "flat";

export interface RelationIndex {
    value: number;
    trend: { dir: TrendDir; label: string; delta: number };
    category: "Slabý" | "Průměrný" | "Dobrý" | "Výborný";
}

export interface MetricCard {
    label: string;
    value: number;
    format?: "number" | "percent";
}

export interface SankeyNode {
    id: string;
    label: string;
}
export interface SankeyLink {
    source: string;
    target: string;
    value: number;
}
export interface Sankey {
    total: number;
    nodes: SankeyNode[];
    links: SankeyLink[];
}

export interface CampaignPoint {
    date: string;
    delivered: number; // Doručeno
    softBounce: number; // Soft Bounce
    uniqueOpens: number; // Unikátní otevření (secondary axis)
}

export interface GdprPoint {
    month: string; // "2025-06"
    label: string; // "červen 2025"
    type1: number;
    type2: number;
    type3: number;
}

export interface BounceReason {
    reason: "delay" | "bounce" | "out_of_band";
    count: number;
    share: number;
}
export interface BounceProvider {
    provider: string;
    count: number;
}
export interface BounceBreakdown {
    total: number;
    byReason: BounceReason[];
    byProvider: BounceProvider[];
}

export interface PushStatRow {
    date: string;
    totalSent: number; // Celkem odesláno
    displayed: number; // Zobrazeno
    notDelivered: number; // Nedoručeno
    deliveryRate: number; // Úspěšnost doručení (decimal)
}

export interface AppActivityPoint {
    date: string;
    dailyActiveUsers: number; // Denní aktivní uživatelé
    totalLogins: number; // Celkový přihlášení
}

export interface EmailFunnelPage {
    relationIndex: RelationIndex;
    clickRate: MetricCard;
    emailTotalsSankey: Sankey;
    campaignChart: CampaignPoint[];
    gdprUnsubscribes: GdprPoint[];
    bounceBreakdown: BounceBreakdown;
    pushStats7d: PushStatRow[];
    appActivityRecent: AppActivityPoint[];
    appActivityYtd: AppActivityPoint[];
}

export interface DataQualityPage {
    visitors: MetricCard;
    hardBounce: { label: string; count: number; percent: number };
    gdprUnsubscribes: {
        label: string;
        marketingCount: number;
        marketingPct: number;
        emailCount: number;
        emailPct: number;
        pushCount: number;
        pushPct: number;
        messagesCount: number;
        messagesPct: number;
    };
    monthlyVisitorsNoEmail90d: MetricCard;
    missingFirstName: MetricCard;
    missingLastName: MetricCard;
    missingPhone: MetricCard;
    missingBirthDate: MetricCard;
    aggregatedDuplicates: MetricCard;
    blockedVisitors: MetricCard;
    lockedVisitors: MetricCard;
    invalidEmails: MetricCard;
    withoutSegments: MetricCard;
    duplicatesByEmail: { label: string; rows: unknown[] };
}

export interface RfmSegment {
    id: string;
    label: string;
    color: string;
    customers: number;
    avgTransactions: number;
    avgValue: number; // Kč per customer
    revenue: number; // Kč
}
export interface RfmPieSlice {
    segment: string;
    customers: number;
    share: number;
    color: string;
}
export interface RfmBar {
    segment: string;
    value: number;
    color: string;
}
export interface RfmScatterPoint {
    segment: string;
    color: string;
    transactions: number;
    revenue: number;
}
export interface RfmPage {
    dateRange: { from: string; to: string };
    kpis: {
        totalRevenueMil: number; // Celkové příjmy v mil. Kč
        avgValuePerFan: number; // Průměrná hodnota na fanouška
        avgTransactions: number; // Průměrný počet transakcí
        atRiskCannotLosePct: number; // Procento At Risk + Cannot Lose
        totalActiveFans: number; // Počet všech aktivních fanoušků
        championsPct: number; // Procento Champions segmentu
    };
    segments: RfmSegment[];
    pie: RfmPieSlice[];
    revenueBars: RfmBar[];
    countBars: RfmBar[];
    scatter: RfmScatterPoint[];
}

export interface MarketingDashboard {
    title: string;
    emailFunnel: EmailFunnelPage;
    relationIndexDetail: RelationIndex; // page 2 (explainer)
    dataQuality: DataQualityPage; // page 3
    rfm: RfmPage; // page 4
}

/* ============================================================================
 *  Data
 * ========================================================================== */

const marketingDashboardData: MarketingDashboard = {
    title: "Marketing",

    // -------------------------------------------------------------------------
    // PAGE 1 — e-mail / funnel / activity
    // -------------------------------------------------------------------------
    emailFunnel: {
        relationIndex: {
            value: 2.84,
            trend: { dir: "down", label: "↓ Zhoršení", delta: -0.18 },
            category: "Dobrý",
        },

        clickRate: { label: "E-mail kampaně - Click Rate", value: 0.0261, format: "percent" },

        // Funnel reconciles end-to-end:
        //   sent 847,392 = delivered 821,540 + notDelivered 25,852
        //   notDelivered 25,852 = soft 19,388 + hard 6,464
        //   delivered 821,540 = opened 238,247 + notOpened 583,293
        //   opened 238,247 = clicked 21,442 + noActivity 216,805
        emailTotalsSankey: {
            total: 847392,
            nodes: [
                { id: "odeslano", label: "Odesláno" },
                { id: "doruceno", label: "Doručeno" },
                { id: "nedoruceno", label: "Nedoručeno" },
                { id: "softBounce", label: "Soft Bounce" },
                { id: "hardBounce", label: "Hard Bounce" },
                { id: "neotevreno", label: "Neotevřeno" },
                { id: "otevreno", label: "Otevřeno" },
                { id: "bezAktivity", label: "Bez aktivity" },
                { id: "proklik", label: "Proklik" },
            ],
            links: [
                { source: "odeslano", target: "doruceno", value: 821540 },
                { source: "odeslano", target: "nedoruceno", value: 25852 },
                { source: "nedoruceno", target: "softBounce", value: 19388 },
                { source: "nedoruceno", target: "hardBounce", value: 6464 },
                { source: "doruceno", target: "neotevreno", value: 583293 },
                { source: "doruceno", target: "otevreno", value: 238247 },
                { source: "otevreno", target: "bezAktivity", value: 216805 },
                { source: "otevreno", target: "proklik", value: 21442 },
            ],
        },

        // 14 weekly points across ~3 months
        campaignChart: [
            { date: "2026-03-09", delivered: 14820, softBounce: 412, uniqueOpens: 4230 },
            { date: "2026-03-16", delivered: 38940, softBounce: 905, uniqueOpens: 11680 },
            { date: "2026-03-23", delivered: 60310, softBounce: 1418, uniqueOpens: 18420 },
            { date: "2026-03-30", delivered: 84770, softBounce: 1992, uniqueOpens: 26140 },
            { date: "2026-04-06", delivered: 71250, softBounce: 1640, uniqueOpens: 21030 },
            { date: "2026-04-13", delivered: 49880, softBounce: 1184, uniqueOpens: 14920 },
            { date: "2026-04-20", delivered: 62401, softBounce: 1502, uniqueOpens: 19260 },
            { date: "2026-04-27", delivered: 41397, softBounce: 968, uniqueOpens: 12110 },
            { date: "2026-05-04", delivered: 94740, softBounce: 2210, uniqueOpens: 29380 },
            { date: "2026-05-11", delivered: 78920, softBounce: 1864, uniqueOpens: 24050 },
            { date: "2026-05-18", delivered: 55180, softBounce: 1322, uniqueOpens: 16640 },
            { date: "2026-05-25", delivered: 33640, softBounce: 802, uniqueOpens: 9870 },
            { date: "2026-06-01", delivered: 47460, softBounce: 1106, uniqueOpens: 14210 },
            { date: "2026-06-08", delivered: 15290, softBounce: 360, uniqueOpens: 4567 },
        ],

        // 13 months, three unsubscribe types, two organic peaks
        gdprUnsubscribes: [
            { month: "2025-06", label: "červen 2025", type1: 38, type2: 24, type3: 12 },
            { month: "2025-07", label: "červenec 2025", type1: 41, type2: 28, type3: 9 },
            { month: "2025-08", label: "srpen 2025", type1: 22, type2: 15, type3: 6 },
            { month: "2025-09", label: "září 2025", type1: 31, type2: 19, type3: 11 },
            { month: "2025-10", label: "říjen 2025", type1: 268, type2: 184, type3: 92 },
            { month: "2025-11", label: "listopad 2025", type1: 372, type2: 241, type3: 118 },
            { month: "2025-12", label: "prosinec 2025", type1: 205, type2: 142, type3: 71 },
            { month: "2026-01", label: "leden 2026", type1: 118, type2: 86, type3: 44 },
            { month: "2026-02", label: "únor 2026", type1: 351, type2: 232, type3: 121 },
            { month: "2026-03", label: "březen 2026", type1: 288, type2: 196, type3: 104 },
            { month: "2026-04", label: "duben 2026", type1: 174, type2: 121, type3: 63 },
            { month: "2026-05", label: "květen 2026", type1: 96, type2: 64, type3: 33 },
            { month: "2026-06", label: "červen 2026", type1: 28, type2: 18, type3: 8 },
        ],

        // reasons sum to 7,588; providers sum to 7,588
        bounceBreakdown: {
            total: 7588,
            byReason: [
                { reason: "delay", count: 6682, share: 0.8806 },
                { reason: "bounce", count: 848, share: 0.1118 },
                { reason: "out_of_band", count: 58, share: 0.0076 },
            ],
            byProvider: [
                { provider: "gmail.com", count: 3102 },
                { provider: "seznam.cz", count: 1894 },
                { provider: "outlook.com", count: 1201 },
                { provider: "centrum.cz", count: 689 },
                { provider: "email.cz", count: 432 },
                { provider: "icloud.com", count: 270 },
            ],
        },

        pushStats7d: [
            { date: "2026-06-06", totalSent: 8, displayed: 1, notDelivered: 4, deliveryRate: 0.0 },
            { date: "2026-06-07", totalSent: 13, displayed: 3, notDelivered: 1, deliveryRate: 0.231 },
            { date: "2026-06-08", totalSent: 14, displayed: 4, notDelivered: 3, deliveryRate: 0.214 },
            { date: "2026-06-09", totalSent: 5, displayed: 1, notDelivered: 0, deliveryRate: 0.2 },
            { date: "2026-06-10", totalSent: 7, displayed: 2, notDelivered: 1, deliveryRate: 0.286 },
            { date: "2026-06-11", totalSent: 16, displayed: 4, notDelivered: 2, deliveryRate: 0.25 },
            { date: "2026-06-12", totalSent: 4, displayed: 1, notDelivered: 0, deliveryRate: 0.25 },
        ],

        // 30 recent daily points (with a couple of spikes + weekend dips)
        appActivityRecent: [
            { date: "2026-05-14", dailyActiveUsers: 312, totalLogins: 498 },
            { date: "2026-05-15", dailyActiveUsers: 286, totalLogins: 441 },
            { date: "2026-05-16", dailyActiveUsers: 198, totalLogins: 305 },
            { date: "2026-05-17", dailyActiveUsers: 176, totalLogins: 268 },
            { date: "2026-05-18", dailyActiveUsers: 1020, totalLogins: 1840 },
            { date: "2026-05-19", dailyActiveUsers: 614, totalLogins: 1102 },
            { date: "2026-05-20", dailyActiveUsers: 408, totalLogins: 702 },
            { date: "2026-05-21", dailyActiveUsers: 362, totalLogins: 611 },
            { date: "2026-05-22", dailyActiveUsers: 339, totalLogins: 548 },
            { date: "2026-05-23", dailyActiveUsers: 221, totalLogins: 351 },
            { date: "2026-05-24", dailyActiveUsers: 205, totalLogins: 318 },
            { date: "2026-05-25", dailyActiveUsers: 374, totalLogins: 629 },
            { date: "2026-05-26", dailyActiveUsers: 401, totalLogins: 688 },
            { date: "2026-05-27", dailyActiveUsers: 358, totalLogins: 602 },
            { date: "2026-05-28", dailyActiveUsers: 333, totalLogins: 551 },
            { date: "2026-05-29", dailyActiveUsers: 318, totalLogins: 522 },
            { date: "2026-05-30", dailyActiveUsers: 214, totalLogins: 338 },
            { date: "2026-05-31", dailyActiveUsers: 197, totalLogins: 309 },
            { date: "2026-06-01", dailyActiveUsers: 388, totalLogins: 660 },
            { date: "2026-06-02", dailyActiveUsers: 412, totalLogins: 724 },
            { date: "2026-06-03", dailyActiveUsers: 369, totalLogins: 618 },
            { date: "2026-06-04", dailyActiveUsers: 341, totalLogins: 567 },
            { date: "2026-06-05", dailyActiveUsers: 328, totalLogins: 539 },
            { date: "2026-06-06", dailyActiveUsers: 226, totalLogins: 352 },
            { date: "2026-06-07", dailyActiveUsers: 209, totalLogins: 321 },
            { date: "2026-06-08", dailyActiveUsers: 1305, totalLogins: 2410 },
            { date: "2026-06-09", dailyActiveUsers: 742, totalLogins: 1344 },
            { date: "2026-06-10", dailyActiveUsers: 451, totalLogins: 781 },
            { date: "2026-06-11", dailyActiveUsers: 397, totalLogins: 668 },
            { date: "2026-06-12", dailyActiveUsers: 372, totalLogins: 615 },
        ],

        // YTD sampled bi-weekly to stay readable — extend to daily if you prefer
        appActivityYtd: [
            { date: "2026-01-06", dailyActiveUsers: 158, totalLogins: 244 },
            { date: "2026-01-20", dailyActiveUsers: 132, totalLogins: 201 },
            { date: "2026-02-03", dailyActiveUsers: 379, totalLogins: 642 },
            { date: "2026-02-17", dailyActiveUsers: 1644, totalLogins: 2980 },
            { date: "2026-03-03", dailyActiveUsers: 588, totalLogins: 1012 },
            { date: "2026-03-17", dailyActiveUsers: 421, totalLogins: 718 },
            { date: "2026-03-31", dailyActiveUsers: 366, totalLogins: 611 },
            { date: "2026-04-14", dailyActiveUsers: 744, totalLogins: 1330 },
            { date: "2026-04-28", dailyActiveUsers: 512, totalLogins: 892 },
            { date: "2026-05-12", dailyActiveUsers: 448, totalLogins: 769 },
            { date: "2026-05-26", dailyActiveUsers: 401, totalLogins: 688 },
            { date: "2026-06-09", dailyActiveUsers: 1897, totalLogins: 3460 },
        ],
    },

    // -------------------------------------------------------------------------
    // PAGE 2 — relation-index explainer (mostly descriptive copy; same scalar)
    // -------------------------------------------------------------------------
    relationIndexDetail: {
        value: 2.84,
        trend: { dir: "down", label: "↓ Zhoršení", delta: -0.18 },
        category: "Dobrý",
    },

    // -------------------------------------------------------------------------
    // PAGE 3 — data-quality KPI grid
    // -------------------------------------------------------------------------
    dataQuality: {
        visitors: { label: "Počet návštěvníků", value: 41208 },
        hardBounce: { label: "Hard bounce", count: 612, percent: 0.0148 },
        gdprUnsubscribes: {
            label: "Odhlášená GDPR",
            marketingCount: 3140,
            marketingPct: 0.0762,
            emailCount: 104,
            emailPct: 0.0025,
            pushCount: 4002,
            pushPct: 0.0971,
            messagesCount: 221,
            messagesPct: 0.0054,
        },
        monthlyVisitorsNoEmail90d: {
            label: "Měsíční návštěvníci (žádný e-mail za posledních 90 dní)",
            value: 3184,
        },
        missingFirstName: { label: "Chybí křestní jméno", value: 0 },
        missingLastName: { label: "Chybí příjmení", value: 0 },
        missingPhone: { label: "Chybí telefon", value: 1389 },
        missingBirthDate: { label: "Chybí datum narození", value: 26910 },
        aggregatedDuplicates: { label: "Agregovaný počet duplicit", value: 0 },
        blockedVisitors: { label: "Zablokovaní návštěvníci", value: 0 },
        lockedVisitors: { label: "Uzamčení návštěvníci", value: 0 },
        invalidEmails: { label: "Neplatné e-maily", value: 0 },
        withoutSegments: { label: "Bez segmentů", value: 524 },
        duplicatesByEmail: { label: "Počet duplicit (podle e-mailu)", rows: [] },
    },

    // -------------------------------------------------------------------------
    // PAGE 4 — RFM analysis
    //   customers sum = 1,927 = totalActiveFans
    //   revenue sum = 3,209,000 Kč → 3.21 mil
    // -------------------------------------------------------------------------
    rfm: {
        dateRange: { from: "2026-06-01", to: "2026-06-30" },

        kpis: {
            totalRevenueMil: 3.21,
            avgValuePerFan: 1665,
            avgTransactions: 2.28,
            atRiskCannotLosePct: 0.0685, // (94 + 38) / 1927
            totalActiveFans: 1927,
            championsPct: 0.0737, // 142 / 1927
        },

        segments: [
            { id: "champions", label: "Champions", color: "#4caf50", customers: 142, avgTransactions: 6.8, avgValue: 7211, revenue: 1024000 },
            { id: "loyal", label: "Loyal", color: "#8bc34a", customers: 98, avgTransactions: 5.2, avgValue: 6245, revenue: 612000 },
            { id: "potentialLoyalists", label: "Potential Loyalists", color: "#7e74c9", customers: 211, avgTransactions: 2.9, avgValue: 2360, revenue: 498000 },
            { id: "newCustomers", label: "New Customer", color: "#4ea3e0", customers: 386, avgTransactions: 1.2, avgValue: 1016, revenue: 392000 },
            { id: "promising", label: "Promising", color: "#26c6da", customers: 153, avgTransactions: 1.8, avgValue: 1222, revenue: 187000 },
            { id: "needAttention", label: "Need Attention", color: "#ffb300", customers: 121, avgTransactions: 2.1, avgValue: 1174, revenue: 142000 },
            { id: "aboutToSleep", label: "About to Sleep", color: "#ff8a65", customers: 167, avgTransactions: 1.6, avgValue: 587, revenue: 98000 },
            { id: "atRisk", label: "At Risk", color: "#ef5350", customers: 94, avgTransactions: 2.4, avgValue: 809, revenue: 76000 },
            { id: "cannotLose", label: "Cannot Lose", color: "#c62828", customers: 38, avgTransactions: 5.5, avgValue: 3184, revenue: 121000 },
            { id: "hibernating", label: "Hibernating", color: "#90a4ae", customers: 205, avgTransactions: 1.3, avgValue: 200, revenue: 41000 },
            { id: "lost", label: "Lost", color: "#607d8b", customers: 312, avgTransactions: 1.1, avgValue: 58, revenue: 18000 },
        ],

        // sorted by customers desc; shares sum to ~1.0
        pie: [
            { segment: "New Customer", customers: 386, share: 0.2003, color: "#4ea3e0" },
            { segment: "Lost", customers: 312, share: 0.1619, color: "#607d8b" },
            { segment: "Potential Loyalists", customers: 211, share: 0.1095, color: "#7e74c9" },
            { segment: "Hibernating", customers: 205, share: 0.1064, color: "#90a4ae" },
            { segment: "About to Sleep", customers: 167, share: 0.0867, color: "#ff8a65" },
            { segment: "Promising", customers: 153, share: 0.0794, color: "#26c6da" },
            { segment: "Champions", customers: 142, share: 0.0737, color: "#4caf50" },
            { segment: "Need Attention", customers: 121, share: 0.0628, color: "#ffb300" },
            { segment: "Loyal", customers: 98, share: 0.0509, color: "#8bc34a" },
            { segment: "At Risk", customers: 94, share: 0.0488, color: "#ef5350" },
            { segment: "Cannot Lose", customers: 38, share: 0.0197, color: "#c62828" },
        ],

        // sorted by revenue desc
        revenueBars: [
            { segment: "Champions", value: 1024000, color: "#4caf50" },
            { segment: "Loyal", value: 612000, color: "#8bc34a" },
            { segment: "Potential Loyalists", value: 498000, color: "#7e74c9" },
            { segment: "New Customer", value: 392000, color: "#4ea3e0" },
            { segment: "Promising", value: 187000, color: "#26c6da" },
            { segment: "Need Attention", value: 142000, color: "#ffb300" },
            { segment: "Cannot Lose", value: 121000, color: "#c62828" },
            { segment: "About to Sleep", value: 98000, color: "#ff8a65" },
            { segment: "At Risk", value: 76000, color: "#ef5350" },
            { segment: "Hibernating", value: 41000, color: "#90a4ae" },
            { segment: "Lost", value: 18000, color: "#607d8b" },
        ],

        // sorted by customers desc
        countBars: [
            { segment: "New Customer", value: 386, color: "#4ea3e0" },
            { segment: "Lost", value: 312, color: "#607d8b" },
            { segment: "Potential Loyalists", value: 211, color: "#7e74c9" },
            { segment: "Hibernating", value: 205, color: "#90a4ae" },
            { segment: "About to Sleep", value: 167, color: "#ff8a65" },
            { segment: "Promising", value: 153, color: "#26c6da" },
            { segment: "Champions", value: 142, color: "#4caf50" },
            { segment: "Need Attention", value: 121, color: "#ffb300" },
            { segment: "Loyal", value: 98, color: "#8bc34a" },
            { segment: "At Risk", value: 94, color: "#ef5350" },
            { segment: "Cannot Lose", value: 38, color: "#c62828" },
        ],

        // representative sample (one cluster of points per segment)
        scatter: [
            { segment: "Champions", color: "#4caf50", transactions: 7, revenue: 7400 },
            { segment: "Champions", color: "#4caf50", transactions: 6, revenue: 6980 },
            { segment: "Loyal", color: "#8bc34a", transactions: 5, revenue: 6100 },
            { segment: "Loyal", color: "#8bc34a", transactions: 6, revenue: 6520 },
            { segment: "Potential Loyalists", color: "#7e74c9", transactions: 3, revenue: 2410 },
            { segment: "Potential Loyalists", color: "#7e74c9", transactions: 2, revenue: 2180 },
            { segment: "New Customer", color: "#4ea3e0", transactions: 1, revenue: 980 },
            { segment: "New Customer", color: "#4ea3e0", transactions: 1, revenue: 1120 },
            { segment: "Promising", color: "#26c6da", transactions: 2, revenue: 1290 },
            { segment: "Need Attention", color: "#ffb300", transactions: 2, revenue: 1150 },
            { segment: "About to Sleep", color: "#ff8a65", transactions: 2, revenue: 610 },
            { segment: "At Risk", color: "#ef5350", transactions: 2, revenue: 840 },
            { segment: "Cannot Lose", color: "#c62828", transactions: 6, revenue: 3290 },
            { segment: "Hibernating", color: "#90a4ae", transactions: 1, revenue: 210 },
            { segment: "Lost", color: "#607d8b", transactions: 1, revenue: 64 },
        ],
    },
};

export default marketingDashboardData;