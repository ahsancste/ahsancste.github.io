# ahsancste.github.io

Personal portfolio for https://ahsanhabib.me.

## Analytics setup

The site includes consent-aware GA4 and Microsoft Clarity loading plus event tracking for CV downloads, contact links, project links, navigation, AI assistant and playground interactions.

Set the public IDs in `analytics-config.js`:

- `ga4MeasurementId`: GA4 web stream ID (`G-...`)
- `clarityProjectId`: Microsoft Clarity project ID

Google Search Console support is prepared through `robots.txt`, `sitemap.xml`, canonical metadata and indexable page metadata. Verify the domain using a Search Console DNS TXT record, then submit `https://ahsanhabib.me/sitemap.xml`.
