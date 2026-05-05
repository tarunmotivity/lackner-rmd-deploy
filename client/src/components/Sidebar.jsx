const Sidebar = () => {
  return (
    <aside className="fixed w-64 h-screen bg-[var(--glass-bg)] backdrop-blur-xl p-6 border-r border-[var(--border-color)] transition-colors duration-300">
      <h1 className="text-xl font-bold text-[#722CFD] dark:text-[#9e67ff] mb-8">
        RMD Optimizer
      </h1>

      <div className="space-y-3">
        <div className="bg-[#722CFD]/10 dark:bg-[#722CFD]/20 text-[#722CFD] dark:text-[#b48dff] p-3 rounded transition-colors duration-300">
          Dashboard
        </div>
        <div className="text-[var(--text-secondary)] p-3 hover:bg-[var(--hover-bg)] rounded transition-colors duration-300 cursor-pointer">Saved</div>
        <div className="text-[var(--text-secondary)] p-3 hover:bg-[var(--hover-bg)] rounded transition-colors duration-300 cursor-pointer">Clients</div>
      </div>
    </aside>
  );
};

export default Sidebar;