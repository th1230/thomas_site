const HomepageProjects = () => {
  const projects = [
    {
      title: "才藝連連",
      description:
        "才藝連連 Talent Match 是一個多才藝線上學習平台，讓教師自由設計課程，涵蓋音樂、藝術、編程、健身等領域。學生可依興趣選課，享受靈活的學習體驗。平台致力於打造多元互動的學習成長環境。",
      link: "https://talent-match-frontend.onrender.com/",
      image: "/img/projects/talent_match.png",
      tags: ["Angular", "Tailwind CSS", "NodeJs", "Express", "MongoDB"],
    },
  ];

  return (
    <div className="flex w-full flex-col items-center bg-gray-900 py-20 text-center text-white">
      <h2 className="mb-12 text-4xl font-extrabold text-yellow-400 drop-shadow-lg md:text-5xl">
        🚀 My Projects
      </h2>
      <div className="grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <div
            key={index}
            className="transform-gpu rounded-xl bg-white/10 p-6 shadow-lg backdrop-blur-lg transition-transform hover:translate-y-2 hover:shadow-yellow-500"
          >
            <div className="overflow-hidden rounded-lg">
              <img
                src={project.image}
                alt={project.title}
                className="h-48 w-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
              />
            </div>
            <h3 className="mb-3 mt-4 text-2xl font-bold text-yellow-300">
              {project.title}
            </h3>
            <p className="mb-4 text-gray-300">{project.description}</p>

            {/* 技術標籤區塊 */}
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-gray-900 shadow-md"
                >
                  {tag}
                </span>
              ))}
            </div>

            <a
              href={project.link}
              target="_blank"
              className="font-semibold text-yellow-500 hover:underline"
            >
              View Project →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomepageProjects;
