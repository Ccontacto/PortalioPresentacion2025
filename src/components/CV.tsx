import type { PortfolioData } from '../types/portfolio';

interface CVProps {
  data: PortfolioData;
}

export default function CV({ data }: CVProps) {
  return (
    <div className="p-8 bg-white text-gray-900 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{data.name}</h1>
        <p className="text-xl mt-2 text-gray-600">{data.title}</p>
        <p className="text-md text-gray-500">{data.subtitle}</p>
      </header>

      <hr className="my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-4">Perfil</h2>
        <p className="text-gray-700 leading-relaxed">{data.description}</p>
      </section>

      {data.sections?.experience?.jobs?.length && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-4">
            {data.sections.experience.title}
          </h2>
          {data.sections.experience.jobs.map((job) => (
            <div key={job.role} className="mb-6">
              <h3 className="text-xl font-semibold">{job.role}</h3>
              <p className="text-lg text-gray-800">{job.company} — {job.period}</p>
              <p className="mt-2 text-gray-700">{job.description}</p>
            </div>
          ))}
        </section>
      )}

      {data.sections?.skills?.categories?.length && (
        <section>
          <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-4">
            {data.sections.skills.title}
          </h2>
          {data.sections.skills.categories.map((category) => (
            <div key={category.title} className="mb-4">
              <h3 className="text-lg font-semibold">{category.title}</h3>
              <p className="text-gray-700">{category.items.join(' • ')}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
