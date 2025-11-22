type LandingPlaceholderProps = {
  portfolioPath: string;
};

function ensureHref(path: string) {
  if (!path || path === '/') {
    return '/';
  }
  return path.endsWith('/') ? path : `${path}/`;
}

export default function LandingPlaceholder({ portfolioPath }: LandingPlaceholderProps) {
  const href = ensureHref(portfolioPath);

  return (
    <div className="landing-shell" data-dev-id="landing-hold">
      <div className="landing-card">
        <div className="landing-card__badge">En progreso</div>
        <h1 className="landing-card__title">
          Portafolio 2025 en progreso
        </h1>
        <p className="landing-card__description">
          Estoy actualizando la experiencia completa inspirada en el estilo konami. Mientras termino los últimos detalles,
          puedes explorar la versión activa del portafolio con todo el sistema de diseño, microinteracciones y modo retro.
        </p>
        <div className="landing-card__actions">
          <a className="landing-card__cta" href={href}>
            Ver portafolio
          </a>
          <a className="landing-card__link" href={href}>
            Ir a /portafolio/JoseCarlos
          </a>
        </div>
      </div>
    </div>
  );
}
