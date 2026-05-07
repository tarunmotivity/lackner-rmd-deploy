import {
  LayoutDashboard,
  Bookmark,
  Users,
  Sparkles,
  Activity,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Saved Projections",
    icon: Bookmark,
  },
  {
    label: "Clients",
    icon: Users,
  },
];

const Sidebar = () => {
  return (
    <aside
      className="
        fixed
        top-0
        left-0
        w-72
        h-screen
        z-50

        border-r
        border-[var(--border-color)]

        bg-[var(--glass-bg)]
        backdrop-blur-2xl

        transition-colors
        duration-300

        overflow-hidden
      "
    >
      {/* =========================================
          BACKGROUND GLOW
      ========================================= */}

      <div
        className="
          absolute
          top-[-120px]
          left-[-80px]
          w-[260px]
          h-[260px]
          rounded-full
          bg-cyan-500/10
          blur-3xl
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-[-100px]
          right-[-80px]
          w-[220px]
          h-[220px]
          rounded-full
          bg-purple-500/10
          blur-3xl
          pointer-events-none
        "
      />

      {/* =========================================
          CONTENT
      ========================================= */}

      <div className="relative z-10 flex flex-col h-full p-6">
        {/* =====================================
            LOGO
        ===================================== */}

        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div
              className="
                w-11
                h-11
                rounded-2xl

                bg-gradient-to-br
                from-cyan-400
                to-blue-600

                flex
                items-center
                justify-center

                shadow-[0_0_30px_rgba(0,212,255,0.35)]
              "
            >
              <Sparkles
                size={20}
                className="text-white"
              />
            </div>

            <div>
              <h1
                className="
                  text-xl
                  font-extrabold
                  tracking-tight
                  text-[var(--text-primary)]
                "
              >
                RMD Optimizer
              </h1>

              <p
                className="
                  text-xs
                  text-[var(--text-secondary)]
                  mt-0.5
                "
              >
                Wealth Projection Suite
              </p>
            </div>
          </div>
        </div>

        {/* =====================================
            SECTION LABEL
        ===================================== */}

        <div
          className="
            text-[11px]
            uppercase
            tracking-[0.2em]
            text-[var(--text-secondary)]
            mb-3
            px-2
          "
        >
          Workspace
        </div>

        {/* =====================================
            NAV ITEMS
        ===================================== */}

        <div className="space-y-2">
          {navItems.map(
            (
              item,
              index
            ) => {
              const Icon =
                item.icon;

              return (
                <button
                  key={index}
                  className={`
                    group
                    relative

                    w-full

                    flex
                    items-center
                    gap-3

                    px-4
                    py-3

                    rounded-2xl

                    transition-all
                    duration-300

                    border

                    ${
                      item.active
                        ? `
                          bg-gradient-to-r
                          from-cyan-500/20
                          to-blue-500/10

                          border-cyan-400/20

                          shadow-[0_0_24px_rgba(0,212,255,0.12)]

                          text-white
                        `
                        : `
                          border-transparent

                          text-[var(--text-secondary)]

                          hover:bg-[var(--hover-bg)]
                          hover:border-[var(--border-color)]

                          hover:text-[var(--text-primary)]
                        `
                    }
                  `}
                >
                  {/* ACTIVE GLOW */}

                  {item.active && (
                    <div
                      className="
                        absolute
                        left-0
                        top-2
                        bottom-2
                        w-1

                        rounded-full

                        bg-cyan-400

                        shadow-[0_0_14px_rgba(34,211,238,0.8)]
                      "
                    />
                  )}

                  {/* ICON */}

                  <div
                    className={`
                      transition-transform
                      duration-300

                      group-hover:scale-110

                      ${
                        item.active
                          ? "text-cyan-300"
                          : ""
                      }
                    `}
                  >
                    <Icon size={18} />
                  </div>

                  {/* LABEL */}

                  <span
                    className="
                      text-sm
                      font-medium
                    "
                  >
                    {item.label}
                  </span>
                </button>
              );
            }
          )}
        </div>

        {/* =====================================
            ANALYTICS CARD
        ===================================== */}

        <div className="mt-auto">
          <div
            className="
              relative

              overflow-hidden

              rounded-3xl

              border
              border-cyan-400/10

              bg-gradient-to-br
              from-cyan-500/10
              to-blue-600/10

              p-5

              shadow-[0_10px_40px_rgba(0,0,0,0.25)]
            "
          >
            {/* Glow */}

            <div
              className="
                absolute
                top-[-30px]
                right-[-20px]

                w-[120px]
                h-[120px]

                rounded-full

                bg-cyan-400/10

                blur-3xl
              "
            />

            {/* Header */}

            <div className="flex items-center gap-2 mb-3">
              <Activity
                size={18}
                className="text-cyan-300"
              />

              <h3
                className="
                  text-sm
                  font-semibold
                  text-[var(--text-primary)]
                "
              >
                Projection Engine
              </h3>
            </div>

            {/* Text */}

            <p
              className="
                text-xs
                leading-relaxed
                text-[var(--text-secondary)]
              "
            >
              Backend-driven RMD,
              tax, and wealth flow
              analytics with
              real-time scenario
              projections.
            </p>

            {/* Footer */}

            <div
              className="
                mt-4

                flex
                items-center
                gap-2

                text-cyan-300
                text-xs
                font-medium
              "
            >
              <ShieldCheck size={14} />

              Live Financial Logic
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;