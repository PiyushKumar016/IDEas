import { File, Folder, FilePlusCorner, FolderPlus } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { LeftClickMenuContext } from "../contexts/leftClickMenuContext";
import { EditorContext } from "../contexts/editorPanelContext.jsx";
import getLanguageConfig from "../utils/languageConfig.js";
import useTabs from "../hooks/useTabs.js";

function FolderStructure({
  fileExplorer,
  handleInsertNode,
  handleRenameNode,
  handleDeleteNode,
}) {
  const [showInput, setShowInput] = useState({
    visible: false,
    isFolder: false,
  });
  const { editorInfo, setEditorInfo } = useContext(EditorContext);
  const [newItemName, setNewItemName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [renameText, setRenameText] = useState("");
  const { contextMenu, setContextMenu } = useContext(LeftClickMenuContext);
  const { tabs, setTabs } = useTabs();

  const handleAddClick = (e, isFolder) => {
    e.stopPropagation();
    setShowInput({ visible: true, isFolder });
  };

  useEffect(() => {
    const closeMenu = () => setContextMenu({ ...contextMenu, visible: false });
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [contextMenu, setContextMenu]);

  const handleRightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      nodeId: fileExplorer.id,
    });
  };

  const handleRenameKeyDown = (e) => {
    if (e.key === "Enter" && renameText.trim()) {
      handleRenameNode(fileExplorer.id, renameText.trim());
      setEditMode(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && newItemName.trim()) {
      const [monacoLang, boilerplate] = getLanguageConfig(
        newItemName.trim().split(".")[1],
      );
      const newItem = {
        id: crypto.randomUUID(),
        name: newItemName.trim(),
        language: showInput.isFolder ? null : monacoLang,
        type: showInput.isFolder ? "folder" : "file",
        ...(showInput.isFolder ? { children: [] } : { content: boilerplate }),
      };
      console.log(newItem);
      handleInsertNode(fileExplorer.id, newItem);
      setShowInput({ visible: false, isFolder: false });
      setNewItemName("");
    }
  };
  function handleClick() {
    if (!isFolder) {
      const newTab = {
        id: fileExplorer.id,
        fileName: fileExplorer.name,
        content: fileExplorer.content,
        language: fileExplorer.language,
        used: true,
      };
      setEditorInfo(newTab);
      const isAlreadyOpen = tabs.find((tab) => tab.id === fileExplorer.id);
      if (!isAlreadyOpen) {
        setTabs([...tabs, newTab]);
      }
    }
  }
  const isFolder = fileExplorer.type === "folder";

  return (
    <div className="ml-3 mt-0.5 select-none">
      {/* ── FOLDER / FILE ROW ── */}
      <div
        className="flex items-center gap-2 group cursor-pointer px-2 py-1.5 rounded-lg hover:bg-[#ede8ff]/60 transition-colors duration-150"
        onContextMenu={handleRightClick}
        onClick={handleClick}
      >
        {/* Icon */}
        <span className={isFolder ? "text-[#7c3aed]" : "text-[#9d8cc4]"}>
          {isFolder ? (
            <Folder size={15} className="fill-[#7c3aed]/10" />
          ) : (
            <File size={15} />
          )}
        </span>

        {/* Text or Rename Input */}
        {editMode ? (
          <input
            type="text"
            className="flex-1 text-[13px] px-1.5 py-0.5 rounded-md border border-[#c4b5fd] bg-white text-[#1a1333] font-medium outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all shadow-sm"
            value={renameText}
            onChange={(e) => setRenameText(e.target.value)}
            onBlur={() => setEditMode(false)}
            autoFocus
            onKeyDown={handleRenameKeyDown}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-[13.5px] text-[#1a1333] flex-1 truncate font-medium tracking-tight">
            {fileExplorer.name}
          </span>
        )}

        {/* Action Buttons (New File / Folder) */}
        {isFolder && (
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => handleAddClick(e, false)}
              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#d8b4fe]/30 text-[#8b5cf6] hover:text-[#6d28d9] transition-colors"
              title="New file"
            >
              <FilePlusCorner size={14} />
            </button>
            <button
              onClick={(e) => handleAddClick(e, true)}
              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#d8b4fe]/30 text-[#8b5cf6] hover:text-[#6d28d9] transition-colors"
              title="New folder"
            >
              <FolderPlus size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ── RIGHT CLICK CONTEXT MENU ── */}
      {contextMenu.visible && contextMenu.nodeId === fileExplorer.id && (
        <div
          className="fixed bg-white/95 backdrop-blur-md border border-[#ede8ff] shadow-[0_8px_24px_#7c3aed20] rounded-xl py-1.5 z-50 min-w-[150px] overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-[13px] font-medium text-[#1a1333] hover:bg-[#ede8ff]/80 hover:text-[#6d28d9] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setContextMenu({ ...contextMenu, visible: false });
              setRenameText(fileExplorer.name);
              setEditMode(true);
            }}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Rename
          </button>
          <div className="mx-3 my-1 border-t border-[#ede8ff]" />
          <button
            className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setContextMenu({ ...contextMenu, visible: false });
              handleDeleteNode(fileExplorer.id);
            }}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
            Delete
          </button>
        </div>
      )}

      {/* ── NEW ITEM INLINE INPUT ── */}
      {showInput.visible && (
        <div className="flex items-center gap-2 ml-4 mt-0.5 px-2 py-1.5">
          <span className="text-[#9d8cc4]">
            {showInput.isFolder ? (
              <Folder size={14} className="fill-[#9d8cc4]/10" />
            ) : (
              <File size={14} />
            )}
          </span>
          <input
            autoFocus
            type="text"
            className="flex-1 text-[13px] px-1.5 py-0.5 rounded-md border border-[#c4b5fd] bg-white text-[#1a1333] font-medium outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all shadow-sm"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setShowInput({ visible: false, isFolder: false })}
          />
        </div>
      )}

      {/* ── RECURSIVE CHILDREN RENDERING ── */}
      {isFolder && fileExplorer.children && (
        <div className="border-l border-[#ede8ff] ml-3.5 pl-1 mt-1">
          {fileExplorer.children.map((item) => (
            <FolderStructure
              key={item.id}
              fileExplorer={item}
              handleInsertNode={handleInsertNode}
              handleRenameNode={handleRenameNode}
              handleDeleteNode={handleDeleteNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FolderStructure;
