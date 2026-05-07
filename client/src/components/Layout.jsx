import Header from "./Header";

const Layout = ({
  children,
}) => {
  return (
    <div
      className="
        relative

        min-h-screen
        w-full

        bg-[var(--bg-primary)]
        text-[var(--text-primary)]

        transition-colors
        duration-300

        overflow-x-hidden
      "
    >
      {/* =====================================
          BACKGROUND GLOWS
      ===================================== */}

      <div
        className="
          fixed
          top-[-120px]
          right-[-100px]

          w-[260px]
          h-[260px]

          rounded-full

          bg-cyan-500/10

          blur-3xl

          pointer-events-none

          z-0
        "
      />

      <div
        className="
          fixed
          bottom-[-120px]
          left-[20%]

          w-[240px]
          h-[240px]

          rounded-full

          bg-purple-500/10

          blur-3xl

          pointer-events-none

          z-0
        "
      />

      <div
        className="
          fixed
          top-[40%]
          left-[50%]

          w-[180px]
          h-[180px]

          rounded-full

          bg-blue-500/5

          blur-3xl

          pointer-events-none

          z-0
        "
      />

      {/* =====================================
          MAIN
      ===================================== */}

      <div
        className="
          relative
          z-10

          min-h-screen

          flex
          flex-col
        "
      >
        {/* HEADER */}

        <Header />

        {/* CONTENT */}

        <main
          className="
            flex-1

            p-2
            lg:p-3
          "
        >
          <div
            className="
              w-full
              max-w-[1700px]
              mx-auto
            "
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;