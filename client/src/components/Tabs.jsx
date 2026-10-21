import React, { useContext } from "react";
import { X } from "lucide-react";
import useTabs from "../hooks/useTabs";
import { EditorContext } from "../contexts/editorPanelContext";

export default function Tabs() {
  const { tabs, setTabs } = useTabs();
  const { editorInfo, setEditorInfo } = useContext(EditorContext);

  if (!tabs || tabs.length === 0) return null;

  return (
    <div className="flex items-center overflow-x-auto select-none bg-[#1e153b] border-b border-[#433078] text-xs scrollbar-none flex-1 min-w-0">
      {tabs.map((tab, ind) => {
        const isActive = editorInfo?.id === tab.id;
        const name = tab.fileName || tab.name;

        return (
          <div
            key={ind}
            className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer border-r border-[#433078] transition-all shrink-0 relative ${
              isActive
                ? "bg-[#2d1f59] text-white font-semibold border-t-2 border-t-[#a855f7]"
                : "bg-[#181130] text-[#c4b3f0] hover:bg-[#25194d] hover:text-white"
            }`}
            onClick={() => setEditorInfo(tab)}
          >
            <span className="truncate max-w-[140px]">{name}</span>
            <button
              className="p-0.5 rounded hover:bg-[#433078] text-[#a792e8] hover:text-white transition-colors ml-1"
              onClick={(e) => {
                e.stopPropagation(); 
                const newTabs = tabs.filter((t) => t.id !== tab.id);
                setTabs(newTabs);
                if (editorInfo?.id === tab.id) {
                  if (newTabs.length > 0) {
                    setEditorInfo(newTabs[newTabs.length - 1]);
                  } else {
                    setEditorInfo({
                      fileName: "",
                      content: "",
                      language: "",
                      used: false,
                    });
                  }
                }
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
