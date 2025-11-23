import { SparkStars } from '@components/SparkStars';

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
    <div className="landing-shell spark-landing" data-dev-id="landing-hold">
      <SparkStars variant="classic" starCount={120} message="Translating human to computer." />
      <div className="landing-card landing-card--glass">
        <div className="landing-card__badge landing-card__badge--ghost">En progreso</div>
        <h1 className="landing-card__title landing-card__title--white">Experiencia en evolución</h1>
        <p className="landing-card__description landing-card__description--lead">
          Ajustando navegación y microinteracciones para lanzar la próxima versión del portafolio.
        </p>
        <p className="landing-card__description">
          Puedes explorar la versión estable con proyectos, procesos y entregables vigentes.
        </p>
        <div className="landing-card__actions">
          <a className="landing-card__cta" href={href}>
            Entrar al portafolio
          </a>
        </div>
      </div>
    </div>
  );
}
