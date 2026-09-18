(() => {
  'use strict';

  const config = window.PORTFOLIO_ANALYTICS || {};
  const consentKey = 'portfolio_analytics_consent_v1';
  const consentPanel = document.querySelector('#analytics-consent');
  const validGaId = /^G-[A-Z0-9]+$/i.test(config.ga4MeasurementId || '');
  const validClarityId = /^[a-z0-9]+$/i.test(config.clarityProjectId || '');
  let analyticsReady = false;
  let engagementTrackingReady = false;

  function injectScript(src) {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }

  function startAnalytics() {
    if (analyticsReady) return;
    analyticsReady = true;
    if (validGaId) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', config.ga4MeasurementId, { anonymize_ip: true, allow_google_signals: false, send_page_view: true });
      injectScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.ga4MeasurementId)}`);
    }
    if (validClarityId) {
      window.clarity = window.clarity || function clarity() { (window.clarity.q = window.clarity.q || []).push(arguments); };
      injectScript(`https://www.clarity.ms/tag/${encodeURIComponent(config.clarityProjectId)}`);
      window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
    }
    setupEngagementTracking();
    const query = new URLSearchParams(location.search);
    const source = (query.get('utm_source') || '').toLowerCase();
    const campaign = (query.get('utm_campaign') || '').toLowerCase();
    const referrerHost = document.referrer ? new URL(document.referrer).hostname : 'direct';
    if (/linkedin|recruit|talent|hiring/.test(`${source} ${campaign} ${referrerHost}`)) {
      track('recruiter_visit', { traffic_source: source || referrerHost, campaign: campaign || 'not_set' });
    }
  }

  function track(name, parameters = {}) {
    if (!analyticsReady) return;
    const safeParameters = { ...parameters, page_section: location.hash.slice(1) || 'home' };
    if (validGaId && window.gtag) window.gtag('event', name, safeParameters);
    if (validClarityId && window.clarity) window.clarity('event', name);
  }

  function classifyLink(link) {
    const href = link.getAttribute('href') || '';
    if (link.hasAttribute('download') || /\.pdf(?:$|[?#])/i.test(href)) return ['cv_download', 'cv'];
    if (href.startsWith('mailto:')) return ['contact_click', 'email'];
    if (/linkedin\.com/i.test(href)) return ['contact_click', 'linkedin'];
    if (/gumroad\.com/i.test(href)) return ['project_click', 'cosmos_ui'];
    if (/pos\.encoretradebd\.com/i.test(href)) return ['project_click', 'encoretrade_pos'];
    if (href.startsWith('#')) return ['navigation_click', href.slice(1) || 'home'];
    if (/^https?:/i.test(href)) return ['outbound_click', new URL(href, location.href).hostname];
    return null;
  }

  function setupEngagementTracking() {
    if (engagementTrackingReady) return;
    engagementTrackingReady = true;
    const viewed = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.45 || viewed.has(entry.target.id)) return;
        viewed.add(entry.target.id);
        track('section_view', { section_name: entry.target.id });
      });
    }, { threshold: [0.45] });
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));

    const reached = new Set();
    window.addEventListener('scroll', () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const depth = Math.round((window.scrollY / scrollable) * 100);
      [25, 50, 75, 90].forEach((mark) => {
        if (depth >= mark && !reached.has(mark)) {
          reached.add(mark);
          track('scroll_depth', { percent_scrolled: mark });
        }
      });
    }, { passive: true });
  }

  document.addEventListener('click', (event) => {
    const choice = event.target.closest('[data-analytics-choice]');
    if (choice) {
      const allowed = choice.dataset.analyticsChoice === 'allow';
      localStorage.setItem(consentKey, allowed ? 'granted' : 'denied');
      consentPanel.hidden = true;
      if (allowed) startAnalytics();
      return;
    }
    const link = event.target.closest('a[href]');
    if (link) {
      const classification = classifyLink(link);
      if (classification) track(classification[0], { item_name: classification[1], link_url: link.href });
    }
    const assistant = event.target.closest('.assistant-open, #chat-form button, [data-question]');
    if (assistant) track('ai_assistant_interaction', { action: assistant.className || 'prompt' });
    const playground = event.target.closest('[data-command], #terminal-form button, #quiz-answers button, #quiz-next');
    if (playground) track('playground_interaction', { action: playground.dataset.command || playground.id || 'quiz_answer' });
  });

  const storedConsent = localStorage.getItem(consentKey);
  if (storedConsent === 'granted') startAnalytics();
  else if (storedConsent !== 'denied' && (validGaId || validClarityId)) consentPanel.hidden = false;
  window.portfolioAnalytics = Object.freeze({ track });
})();
