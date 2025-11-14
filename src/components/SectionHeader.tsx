
type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  id: string;
};

export default function SectionHeader({ eyebrow, title, subtitle, id }: SectionHeaderProps) {
  return (
    <header className="experience-header">
      <span className="experience-header__eyebrow">{eyebrow}</span>
      <h2 id={id} className="experience-header__title">
        {title}
      </h2>
      <p className="experience-header__subtitle">{subtitle}</p>
    </header>
  );
}
