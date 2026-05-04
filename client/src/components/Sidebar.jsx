const Sidebar = () => {
  return (
    <aside className="fixed w-64 h-screen bg-white/70 backdrop-blur-xl p-6 border-r">
      <h1 className="text-xl font-bold text-[#722CFD] mb-8">
        RMD Optimizer
      </h1>

      <div className="space-y-3">
        <div className="bg-[#722CFD]/10 text-[#722CFD] p-3 rounded">
          Dashboard
        </div>
        <div className="text-gray-500 p-3">Saved</div>
        <div className="text-gray-500 p-3">Clients</div>
      </div>
    </aside>
  );
};

export default Sidebar;