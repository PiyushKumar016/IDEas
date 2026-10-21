import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BgDecor from "../shared/BgDecor";
import { getAllProjects, postProject } from "../API/userAPI";

const THEME_COLORS = [
  { name: "Violet", hex: "#7c3aed" },
  { name: "Slate", hex: "#64748b" },
  { name: "Sage", hex: "#4d7c5f" },
  { name: "Indigo", hex: "#4f46e5" },
  { name: "Rose", hex: "#9f4255" },
  { name: "Teal", hex: "#0f766e" },
];

const Projects = () => {
  const [id , setId] = useState();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedColor, setSelectedColor] = useState(THEME_COLORS[0]);

  const filteredProjects = projects.filter((p) =>
    p.rootNode.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    async function initProjects() {
      try {
        const response = await getAllProjects();
        if (!response) return;
        setProjects(response.data.projects);
      } catch (err) {
        console.log(err);
      }
    }
    initProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const newId = crypto.randomUUID();
    postProject({
      id: newId,
      name: newProjectName || "IDEas Project",
      type: "folder",
      theme: selectedColor.hex,
      children: [],
    });
    if (!newProjectName.trim()) return;
    console.log("Saving color:", selectedColor.hex);
    const newProject = {
      rootNode: {
        id: newId,
        name: newProjectName,
        language: "Code",
        date: "Just now",
        theme: selectedColor.hex,
      },
    };

    setProjects([newProject, ...projects]);
    setNewProjectName("");
    setSelectedColor(THEME_COLORS[0]);
    setIsModalOpen(false);
  }

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#faf9ff] font-sans text-[#1a1333] p-8 relative">
      <BgDecor />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-[-1px] text-[#1a1333] mb-1">
              My Workspace
            </h1>
            <p className="text-[14px] text-[#6b5f8a]">
              Manage your files, algorithms, and applications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9d8cc4] group-focus-within:text-[#7c3aed] transition-colors"
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-[#ede8ff] rounded-xl text-[14px] text-[#1a1333] placeholder-[#c4b5fd] outline-none focus:border-[#7c3aed] focus:shadow-[0_0_0_3px_#7c3aed15] transition-all w-full md:w-60"
              />
            </div>

            <button className="p-2.5 bg-white border border-[#ede8ff] rounded-xl text-[#9d8cc4] hover:bg-[#ede8ff] hover:text-[#7c3aed] transition-colors">
              <svg
                width="17"
                height="17"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <line x1="21" y1="6" x2="3" y2="6" />
                <line x1="21" y1="10" x2="3" y2="10" />
                <line x1="21" y1="14" x2="3" y2="14" />
                <line x1="21" y1="18" x2="3" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex flex-col items-center justify-center p-5 bg-[#faf9ff] border-2 border-dashed border-[#c4b5fd] rounded-2xl hover:bg-[#ede8ff]/50 hover:border-[#7c3aed] transition-all duration-200 h-[175px] cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#ede8ff] group-hover:bg-[#7c3aed] flex items-center justify-center mb-3 transition-colors duration-200">
              <svg
                className="text-[#7c3aed] group-hover:text-white transition-colors"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span className="text-[13.5px] font-bold text-[#7c3aed]">
              New Project
            </span>
          </button>

          {filteredProjects.map((project) => {
            const rawColor = project.rootNode.theme || project.rootNode.color;
            const themeColor = rawColor?.startsWith("#")
              ? rawColor
              : rawColor?.includes("[")
                ? rawColor.match(/\[(.*?)\]/)?.[1] || "#7c3aed"
                : "#7c3aed";

            return (
              <Link
                to={`/project/${project.rootNode.id}`}
                state={{ name: project?.rootNode.name }}
                key={project.rootNode.id}
                className="group relative flex flex-col p-5 bg-white border border-[#ede8ff] rounded-2xl hover:border-[#c4b5fd] hover:shadow-[0_16px_32px_-8px_rgba(124,58,237,0.13)] transition-all duration-300 ease-out cursor-pointer h-[175px] overflow-hidden no-underline"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] group-hover:h-[4px] transition-all duration-300 rounded-t-2xl"
                  style={{
                    background: `linear-gradient(90deg, ${themeColor}, ${themeColor}88)`,
                  }}
                />

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-[#c4b5fd] opacity-0 group-hover:opacity-100 hover:bg-[#ede8ff] hover:text-[#7c3aed] transition-all duration-150 z-10"
                >
                  <svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                  </svg>
                </button>

                <div className="flex-1 flex justify-center items-center mt-3">
                  <div className="relative flex items-center justify-center w-16 h-16 transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                    <div
                      className="absolute inset-0 rounded-2xl transition-all duration-300"
                      style={{ backgroundColor: themeColor, opacity: 0.07 }}
                    />
                    <div
                      className="absolute inset-0 rounded-2xl border opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ borderColor: themeColor + "30" }}
                    />
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: themeColor }}
                      className="relative z-10"
                    >
                      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                    </svg>
                    <div
                      className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white rounded-lg shadow-sm flex items-center justify-center z-20 border"
                      style={{ borderColor: themeColor + "25" }}
                    >
                      <svg
                        width="11"
                        height="11"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: themeColor }}
                      >
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-3 pb-1">
                  <h3
                    className="text-[13.5px] font-bold text-[#1a1333] truncate w-full leading-tight"
                    title={project.rootNode.name}
                  >
                    {project.rootNode.name}
                  </h3>
                  <p
                    className="text-[10.5px] font-semibold mt-1 uppercase tracking-widest"
                    style={{ color: themeColor + "99" }}
                  >
                    Project
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredProjects.length === 0 && search && (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-[#ede8ff] flex items-center justify-center mx-auto mb-4">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="1.6"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p className="text-[#9d8cc4] text-[14px] font-medium">
              No projects found for "
              <span className="text-[#7c3aed]">{search}</span>"
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1333]/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-[#ede8ff] overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-[#ede8ff] flex items-start justify-between">
              <div>
                <h2 className="text-[18px] font-extrabold text-[#1a1333] tracking-tight">
                  New Project
                </h2>
                <p className="text-[13px] text-[#9d8cc4] mt-0.5">
                  Set up a new coding environment.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#c4b5fd] hover:bg-[#ede8ff] hover:text-[#7c3aed] transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form
              onSubmit={handleCreateProject}
              className="p-6 flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-[#1a1333] uppercase tracking-wider">
                  Project Name
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g., Portfolio Website"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#faf9ff] border border-[#ede8ff] rounded-xl text-[14px] text-[#1a1333] placeholder-[#c4b5fd] outline-none focus:border-[#7c3aed] focus:bg-white focus:shadow-[0_0_0_3px_#7c3aed15] transition-all"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[12px] font-bold text-[#1a1333] uppercase tracking-wider">
                  Folder Theme
                </label>
                <div className="flex items-center gap-2.5">
                  {THEME_COLORS.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      title={color.name}
                      className="w-8 h-8 rounded-full transition-all duration-150 cursor-pointer relative"
                      style={{
                        backgroundColor: color.hex,
                        transform:
                          selectedColor.name === color.name
                            ? "scale(1.2)"
                            : "scale(1)",
                        boxShadow:
                          selectedColor.name === color.name
                            ? `0 0 0 2px white, 0 0 0 4px ${color.hex}`
                            : "none",
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl bg-[#faf9ff] border border-[#ede8ff]">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <span className="text-[12px] text-[#6b5f8a] font-medium">
                    {selectedColor.name} theme selected
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#ede8ff] bg-white text-[14px] font-semibold text-[#6b5f8a] hover:bg-[#faf9ff] hover:text-[#1a1333] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newProjectName.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-[#7c3aed] text-white text-[14px] font-bold hover:bg-[#6d28d9] hover:shadow-[0_4px_14px_#7c3aed30] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
