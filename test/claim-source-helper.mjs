// Legacy structural/price/CTA assertions ignore only the newly authorized citation
// wrappers. test/nuchter-bronherstel-v5.test.js checks every wrapper and exact URL.
export const withoutClaimSources = (h) => h.replace(/<a class="claim-source"[^>]*>([\s\S]*?)<\/a>/g, '$1');
