// dashboardData.js
// Sample / placeholder data for the "Statistika Akce" (Campaign Statistics) dashboard.
// Shape mirrors the Metabase layout: KPI cards, metrics table, two time-series
// charts, a links table, and a Sankey flow. Swap these values for your real query
// results — the keys are what the UI binds to.

// ---------------------------------------------------------------------------
// Active filters shown in the dashboard header (Datum / Perioda / hostname)
// ---------------------------------------------------------------------------
export const filters = {
    dateRange: "Předchozích 30 dní nebo dnes", // "Previous 30 days or today"
    period: "day",
    hostname: "client_url",
};

// ---------------------------------------------------------------------------
// Top KPI cards
// ---------------------------------------------------------------------------
export const kpiCards = [
    { id: "delivered", label: "Doručeno", value: 2912, format: "number" },
    { id: "openRate", label: "Míra otevření", value: 0.3091, format: "percent" },
    { id: "clickRate", label: "Míra prokliků", value: 0.01, format: "percent" },
    { id: "conversion", label: "Konverze", value: 0, format: "percent" },
];

// ---------------------------------------------------------------------------
// "Detailní přehled metrik" — detailed metrics table
// rating: one of "good" | "normal" | "low" | "watch" | "base"
// ---------------------------------------------------------------------------
export const metricsTable = [
    { metric: "Odesláno", count: 2930, pctOfSent: 1.0, pctOfDelivered: null, rating: "base", ratingLabel: "Základ" },
    { metric: "Doručeno", count: 2912, pctOfSent: 0.9939, pctOfDelivered: null, rating: "good", ratingLabel: "Výborné" },
    { metric: "Otevřeno", count: 900, pctOfSent: 0.3072, pctOfDelivered: 0.3091, rating: "normal", ratingLabel: "V normě" },
    { metric: "Prokliky (CTR)", count: 29, pctOfSent: 0.0099, pctOfDelivered: 0.01, rating: "low", ratingLabel: "Nízké" },
    { metric: "Konverze", count: 0, pctOfSent: 0, pctOfDelivered: 0, rating: "watch", ratingLabel: "Sledovat" },
    { metric: "Odhlášeno", count: 1, pctOfSent: 0.0003, pctOfDelivered: 0.0003, rating: "good", ratingLabel: "Výborné" },
    { metric: "Hard bounce", count: 3, pctOfSent: 0.001, pctOfDelivered: null, rating: "good", ratingLabel: "Výborné" },
    { metric: "Soft bounce", count: 15, pctOfSent: 0.0051, pctOfDelivered: null, rating: "good", ratingLabel: "Výborné" },
    { metric: "Spam", count: 0, pctOfSent: 0, pctOfDelivered: null, rating: "good", ratingLabel: "Výborné" },
];

// ---------------------------------------------------------------------------
// "Úspěšnost" — success line/area chart over the period
// Each point is one day; series = Doručeno / Otevřeno / Kliknuto
// ---------------------------------------------------------------------------
export const successOverTime = [
    { date: "2026-05-19", delivered: 2911, opened: 706, clicked: 24 },
    { date: "2026-05-20", delivered: 98, opened: 98, clicked: 0 },
    { date: "2026-05-21", delivered: 1, opened: 1, clicked: 1 },
    { date: "2026-05-22", delivered: 0, opened: 0, clicked: 0 },
    { date: "2026-05-23", delivered: 0, opened: 0, clicked: 0 },
    { date: "2026-05-24", delivered: 0, opened: 0, clicked: 0 },
    { date: "2026-05-25", delivered: 0, opened: 0, clicked: 0 },
    { date: "2026-05-26", delivered: 0, opened: 0, clicked: 0 },
];

// ---------------------------------------------------------------------------
// "Doručeno" — stacked delivery bar chart over the period
// series = Doručeno / Nedoručeno / Hard bounce / Soft bounce / Spam
// ---------------------------------------------------------------------------
export const deliveryOverTime = [
    { date: "2026-05-19", delivered: 2930, notDelivered: 0, hardBounce: 0, softBounce: 0, spam: 0 },
    { date: "2026-05-20", delivered: 14, notDelivered: 0, hardBounce: 1, softBounce: 5, spam: 0 },
    { date: "2026-05-21", delivered: 14, notDelivered: 0, hardBounce: 1, softBounce: 4, spam: 0 },
    { date: "2026-05-22", delivered: 13, notDelivered: 0, hardBounce: 1, softBounce: 6, spam: 0 },
];

// ---------------------------------------------------------------------------
// "Odkazy" — links table
// uniqueClicks = Unikátní proklik, uniqueness = Unikátnost,
// total = Celkem, template = Šablona
// ---------------------------------------------------------------------------
export const linksTable = [
    {
        rank: 1,
        link: "https://www.example-festival.cz/?utm_source=relatoo&utm_medium=email&utm_campaign=da0c",
        uniqueClicks: 19,
        uniqueness: 0.7917,
        total: 24,
        template: "https://client_url/template/editor/0000-sample-template",
    },
    {
        rank: 2,
        link: "https://tickets.example.com/event/young-republic/example-2026?promoCode=sample25",
        uniqueClicks: 7,
        uniqueness: 0.875,
        total: 8,
        template: "https://client_url/template/editor/0000-sample-template",
    },
    {
        rank: 3,
        link: "Odhlášeno",
        uniqueClicks: 2,
        uniqueness: 1.0,
        total: 2,
        template: "https://client_url/template/editor/0000-sample-template",
    },
    {
        rank: 4,
        link: "Assets",
        uniqueClicks: 2,
        uniqueness: 1.0,
        total: 2,
        template: "https://client_url/template/editor/0000-sample-template",
    },
    {
        rank: 5,
        link: "https://www.example-sport.cz/?utm_source=relatoo&utm_medium=email&utm_campaign=",
        uniqueClicks: 2,
        uniqueness: 1.0,
        total: 2,
        template: "https://client_url/template/editor/0000-sample-template",
    },
    {
        rank: 6,
        link: "https://x.com/example-sport?utm_source=relatoo&utm_medium=email&utm_campaign=da0c",
        uniqueClicks: 1,
        uniqueness: 1.0,
        total: 1,
        template: "https://client_url/template/editor/0000-sample-template",
    },
];

// ---------------------------------------------------------------------------
// "Vyhodnocení" — Sankey flow (nodes + weighted links)
// ---------------------------------------------------------------------------
export const sankey = {
    nodes: [
        { id: "odeslano", label: "Odesláno" },
        { id: "doruceno", label: "Doručeno" },
        { id: "softBounce", label: "Soft Bounce" },
        { id: "otevreno", label: "Otevřeno" },
        { id: "kliknuto", label: "Kliknuto" },
        { id: "dalsiOdkazy", label: "Další odkazy" },
    ],
    links: [
        { source: "odeslano", target: "doruceno", value: 2912 },
        { source: "odeslano", target: "softBounce", value: 3 },
        { source: "doruceno", target: "otevreno", value: 900 },
        { source: "otevreno", target: "kliknuto", value: 29 },
        { source: "kliknuto", target: "dalsiOdkazy", value: 29 },
    ],
};

// ---------------------------------------------------------------------------
// Convenience: everything bundled under one default export
// ---------------------------------------------------------------------------
const data = {
    title: "Statistika Akce",
    filters,
    kpiCards,
    metricsTable,
    successOverTime,
    deliveryOverTime,
    linksTable,
    sankey,
};

export default data;