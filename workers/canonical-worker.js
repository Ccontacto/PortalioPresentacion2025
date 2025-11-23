const parseList = value =>
  (value ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const canonicalHost = env.CANONICAL_HOST ?? 'administracion.ai';
    const portfolioPath = env.PORTFOLIO_PATH ?? '/portafolio/JoseCarlos';
    const allowedHosts = new Set([canonicalHost, ...parseList(env.ALLOWED_HOSTS)]);
    const portfolioHosts = new Set(parseList(env.PORTFOLIO_HOSTS));

    if (url.protocol !== 'https:' || url.hostname.startsWith('www.')) {
      url.protocol = 'https:';
      url.hostname = canonicalHost;
      return Response.redirect(url, 301);
    }

    if (!allowedHosts.has(url.hostname) && !portfolioHosts.has(url.hostname)) {
      url.hostname = canonicalHost;
      return Response.redirect(url, 301);
    }

    if (portfolioHosts.has(url.hostname)) {
      url.hostname = canonicalHost;
      if (!url.pathname.startsWith(portfolioPath)) {
        url.pathname = `${portfolioPath}${url.pathname}`;
      }
    }

    return env.ASSETS.fetch(new Request(url, request));
  }
};
