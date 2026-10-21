import { File, Folder } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { data, useLocation, useParams } from "react-router-dom";
import FolderStructure from "../components/FolderStructure.jsx";
import { LeftClickMenuProvider } from "../contexts/leftClickMenuContext.jsx";
import EditorPanel from "../components/EditorPanel.jsx";
import { EditorContext } from "../contexts/editorPanelContext.jsx";
// import Tabs from "../components/tabs.jsx";
import useTabs from "../hooks/useTabs.js";
import BgDecor from "../shared/BgDecor.jsx";
import { getProjectById, postProject } from "../API/userAPI.js";

const initialData = {
  id: "root",
  name: "IDEas Project",
  type: "folder",
  theme: "yellow",
  children: [
    {
      id: "1",
      name: "src",
      type: "folder",
      children: [
        {
          id: "2",
          name: "App.jsx",
          type: "file",
          language: "javascript",
          content: "function App() {}",
        },
        {
          id: "3",
          name: "main.jsx",
          type: "file",
          language: "javascript",
          content: "ReactDOM.createRoot()",
        },
        {
          id: "4",
          name: "components",
          type: "folder",
          children: [
            {
              id: "5",
              name: "Navbar.jsx",
              type: "file",
              language: "javascript",
              content: "",
            },
            {
              id: "6",
              name: "Sidebar.jsx",
              type: "file",
              language: "javascript",
              content: "",
            },
          ],
        },
      ],
    },
    {
      id: "7",
      name: "public",
      type: "folder",
      children: [
        { id: "8", name: "logo.png", type: "file", language: "image" },
        { id: "9", name: "favicon.ico", type: "file", language: "image" },
      ],
    },
    {
      id: "10",
      name: "package.json",
      type: "file",
      language: "json",
      content: "{}",
    },
    {
      id: "11",
      name: "README.md",
      type: "file",
      language: "markdown",
      content: "# IDEas",
    },
  ],
};

function Project() {
  const { id } = useParams();
  const { tabs, setTabs } = useTabs();
  const location = useLocation();
  const fileName = location.state?.name;
  const { editorInfo, setEditorInfo } = useContext(EditorContext);
  const [fileExplorer, setFileExplorer] = useState({});
  const handleSave = async () => {
    try{
      console.log("ctrl + s clicked");
      const response = await postProject(fileExplorer);
      if(!response.data.success){
        console.log(response.data.message);
      }
      console.log(response)
    }
    catch(err){
      console.log(err);
    }
  }
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProjectById(id);
        console.log(response)
        if(response?.data?.success && response?.data?.project) {
          setFileExplorer(response.data.project.rootNode);
        }
        else {
          setFileExplorer({
            id: id ,
            name: fileName || "IDEas Project",
            type: "folder",
            theme: "yellow",
            children: [],
          });
        }
      }
      catch(err){
        console.log("Error fetching project:", err);
        setFileExplorer({
          id: id,
          name: fileName || "IDEas Project",
          type: "folder",
          theme: "yellow",
          children: [],
        });
      }
    };
    if(id){
      fetchProject();
    }
  }, [id, fileName]);
  useEffect(() => {
    try{
      const handleKeyDown = (e) => {
        if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's'){
          e.preventDefault();
          handleSave();
        }
      }
      window.addEventListener("keydown" , handleKeyDown);
      return () =>{
        window.removeEventListener("keydown" , handleKeyDown);
      }

    }
    catch(err){
      console.log(err)
    }
  } , [fileExplorer])

  const insertNode = (tree, folderId, newFolder) => {
    if (tree.id === folderId && tree.type === "folder") {
      return { ...tree, children: [newFolder, ...tree.children] };
    }
    if (tree.type === "folder" && tree.children) {
      const latestNodes = tree.children.map((subtree) =>
        insertNode(subtree, folderId, newFolder),
      );
      return { ...tree, children: latestNodes };
    }
    return tree;
  };

  const handleInsertNode = (folderId, newFolder) => {
    const updatedTree = insertNode(fileExplorer, folderId, newFolder);
    setFileExplorer(updatedTree);
  };

  const renameNode = (tree, folderId, newName) => {
    if (tree.id === folderId) return { ...tree, name: newName };
    if (tree.children) {
      const latestNodes = tree.children.map((subtree) =>
        renameNode(subtree, folderId, newName),
      );
      return { ...tree, children: latestNodes };
    }
    return tree;
  };

  const handleRenameNode = (folderId, newName) => {
    const updatedTree = renameNode(fileExplorer, folderId, newName);
    setFileExplorer(updatedTree);
  };

  const deleteNode = (tree, folderId) => {
    if (!tree || tree.id === folderId) return null;
    if (tree.children && Array.isArray(tree.children)) {
      const updatedChildren = tree.children
        .filter((child) => child.id !== folderId)
        .map((child) => deleteNode(child, folderId))
        .filter((child) => child !== null);
      return { ...tree, children: updatedChildren };
    }
    return tree;
  };

  const handleDeleteNode = (folderId) => {
    const updatedTree = deleteNode(fileExplorer, folderId);
    setFileExplorer(updatedTree);
  };
  return (
    // Height adjusted to calc(100vh - 65px) to match your global navbar height
    <div className="flex h-[calc(100vh-65px)] w-full bg-[#faf9ff] font-sans text-[#1a1333] overflow-hidden">
      <BgDecor />
      {/* ── SIDEBAR (Explorer) ── */}
      <div className="w-64 flex-shrink-0 flex flex-col border-r border-[#ede8ff] bg-white shadow-[4px_0_24px_#7c3aed05] z-10">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#ede8ff] bg-white/50 backdrop-blur-sm">
          <span className="text-[11px] font-bold text-[#9d8cc4] uppercase tracking-[1.5px]">
            Explorer
          </span>
          <div className="flex items-center gap-0.5">
            <button
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#ede8ff] transition-colors text-[#9d8cc4] hover:text-[#7c3aed]"
              title="New File"
            >
              <svg
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="13" x2="12" y2="19" />
                <line x1="9" y1="16" x2="15" y2="16" />
              </svg>
            </button>
            <button
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#ede8ff] transition-colors text-[#9d8cc4] hover:text-[#7c3aed]"
              title="New Folder"
            >
              <svg
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </button>
          </div>
        </div>

        {/* Root Project Name */}
        <div className="flex items-center gap-2.5 px-5 py-3 border-b border-[#ede8ff] bg-[#faf9ff]">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg
              width="12"
              height="12"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <span className="text-[13.5px] font-bold text-[#1a1333] truncate tracking-tight">
            {fileExplorer.name}
          </span>
        </div>

        {/* Folder Tree Area */}
        <div className="flex-1 overflow-y-auto py-3 px-2">
          <LeftClickMenuProvider>
            <FolderStructure
              fileExplorer={fileExplorer}
              handleInsertNode={handleInsertNode}
              handleRenameNode={handleRenameNode}
              handleDeleteNode={handleDeleteNode}
            />
          </LeftClickMenuProvider>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 p-4">
        {editorInfo?.used ? (
          <EditorPanel
            fileName={editorInfo.fileName}
            content={editorInfo.content}
            language={editorInfo.language}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-[#ede8ff] shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-[#faf9ff] border border-[#ede8ff] flex items-center justify-center mb-5 shadow-[0_8px_24px_#7c3aed12]">
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3 className="text-[18px] font-extrabold text-[#1a1333] tracking-tight mb-1.5">
              Your workspace is ready
            </h3>
            <p className="text-[14px] text-[#6b5f8a] max-w-xs">
              Select a file from the explorer on the left to start writing code.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Project;
