import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import BgDecor from "../shared/BgDecor";
import { getAllProjects } from "../API/userAPI";

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [recentProjects , setRecentProjects] = useState([]);
  useEffect(() => {
    const getProjects = async () => {
      try {
        const response = await getAllProjects();
        console.log(response.data)
        if(response?.data.success){
            setProjects(response.data.projects);
            setRecentProjects(response.data.projects.slice(0,6) );
        }
        else{
            setProjects([]);
            setRecentProjects([]);
        }
        
      }
      catch (err) {
        console.log(err);
      }
    };
    getProjects();
  }, []);

  

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#faf9ff] font-sans text-[#1a1333] p-8 relative">
      <BgDecor />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col gap-8">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-[#9d8cc4] uppercase tracking-widest mb-1">
              Welcome back
            </p>
            <h1 className="text-3xl font-extrabold tracking-[-1px] text-[#1a1333]">
              {user?.username} 👋
            </h1>
            <p className="text-[14px] text-[#6b5f8a] mt-1">
              Here's what's happening in your workspace.
            </p>
          </div>

          <Link
            to="/Projects"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#7c3aed] text-white
              text-[13.5px] font-bold rounded-xl no-underline
              hover:opacity-90 transition-opacity"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Project
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Total Projects",
              value: projects.length,
              icon: (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                </svg>
              ),
            },
            {
              label: "Recent Activity",
              value: recentProjects.length,
              icon: (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              ),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-[#ede8ff] rounded-2xl p-5
                hover:border-[#c4b5fd] hover:shadow-[0_4px_20px_-4px_rgba(124,58,237,0.10)]
                transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ede8ff] text-[#7c3aed] flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <p className="text-3xl font-extrabold text-[#1a1333] tracking-tight">{stat.value}</p>
              <p className="text-[13px] text-[#9d8cc4] font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-bold text-[#1a1333] tracking-tight">Recent Projects</h2>
            <Link
              to="/Projects"
              className="text-[13px] font-semibold text-[#7c3aed] no-underline hover:underline"
            >
              View all →
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white
              border border-dashed border-[#c4b5fd] rounded-2xl gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#ede8ff] flex items-center justify-center">
                <svg width="24" height="24" fill="none" stroke="#7c3aed" strokeWidth="1.6" viewBox="0 0 24 24">
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                </svg>
              </div>
              <p className="text-[14px] font-semibold text-[#1a1333]">No projects yet</p>
              <p className="text-[13px] text-[#9d8cc4]">Create your first project to get started</p>
              <Link
                to="/Projects"
                className="mt-1 px-5 py-2 bg-[#7c3aed] text-white text-[13px] font-bold
                  rounded-xl no-underline hover:opacity-90 transition-opacity"
              >
                Create Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recentProjects.map((project) => {
                const rawColor = project.rootNode?.theme || project.rootNode?.color;
                const themeColor = rawColor?.startsWith('#')
                  ? rawColor
                  : rawColor?.includes('[')
                    ? rawColor.match(/\[(.*?)\]/)?.[1] || "#7c3aed"
                    : "#7c3aed";

                return (
                  <Link
                    key={project.rootNode.id}
                    to={`/project/${project.rootNode.id}`}
                    state={{ name: project?.rootNode.name }}
                    className="group relative flex flex-col p-4 bg-white border border-[#ede8ff] rounded-2xl
                      hover:border-[#c4b5fd] hover:shadow-[0_16px_32px_-8px_rgba(124,58,237,0.13)]
                      transition-all duration-300 cursor-pointer h-[160px] overflow-hidden no-underline"
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-[3px] group-hover:h-[4px] transition-all duration-300 rounded-t-2xl"
                      style={{ background: `linear-gradient(90deg, ${themeColor}, ${themeColor}88)` }}
                    />

                    <div className="flex-1 flex justify-center items-center mt-2">
                      <div className="relative flex items-center justify-center w-14 h-14
                        transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                        <div className="absolute inset-0 rounded-2xl"
                          style={{ backgroundColor: themeColor, opacity: 0.07 }} />
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="1.6"
                          strokeLinecap="round" strokeLinejoin="round"
                          style={{ color: themeColor }} className="relative z-10">
                          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                        </svg>
                        <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-white rounded-md
                          shadow-sm flex items-center justify-center z-20 border"
                          style={{ borderColor: themeColor + "25" }}>
                          <svg width="9" height="9" fill="none" stroke="currentColor"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            style={{ color: themeColor }}>
                            <polyline points="16 18 22 12 16 6" />
                            <polyline points="8 6 2 12 8 18" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-2 pb-0.5">
                      <h3 className="text-[12.5px] font-bold text-[#1a1333] truncate w-full leading-tight"
                        title={project.rootNode.name}>
                        {project.rootNode.name}
                      </h3>
                      <p className="text-[10px] font-semibold mt-0.5 uppercase tracking-widest"
                        style={{ color: themeColor + "99" }}>
                        Project
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] rounded-2xl p-6
          flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-[16px] font-extrabold text-white mb-1">
              Try the Compiler
            </h3>
            <p className="text-[13px] text-[#ddd6fe]">
              Run code in 20+ languages directly in your browser.
            </p>
          </div>
          <Link
            to="/Compiler"
            className="px-5 py-2.5 bg-white text-[#7c3aed] text-[13.5px] font-bold
              rounded-xl no-underline hover:opacity-90 transition-opacity flex-shrink-0"
          >
            Open Compiler →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;