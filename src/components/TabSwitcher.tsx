
interface TabSwitcherProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

const TabSwitcher = ({ activeTab, onTabChange, tabs }: TabSwitcherProps) => {
  return (
    <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-2 text-center rounded-md transition-all ${
            activeTab === tab.id
              ? "bg-white shadow-sm font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher;
