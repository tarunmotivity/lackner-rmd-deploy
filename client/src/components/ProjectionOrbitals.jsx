import { useEffect, useRef, useState } from "react";

const COLORS = {
  bg1: "#020617",
  bg2: "#000000",

  grid: "rgba(255,255,255,0.05)",

  balance: "#00d4ff",
  rmd: "#a855f7",
  growth: "#22c55e",
  tax: "#ef4444",

  tooltipBg: "rgba(15,23,42,0.96)",
};

export default function ProjectionOrbitals({
  data = [],
}) {
  const canvasRef = useRef(null);

  const [tooltip, setTooltip] =
    useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !data.length)
      return;

    const ctx =
      canvas.getContext("2d");

    const DPR =
      window.devicePixelRatio || 1;

    // =========================
    // SAFARI ROUNDRECT FIX
    // =========================

    if (!ctx.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect =
        function (
          x,
          y,
          w,
          h,
          r
        ) {
          this.beginPath();

          this.moveTo(x + r, y);

          this.arcTo(
            x + w,
            y,
            x + w,
            y + h,
            r
          );

          this.arcTo(
            x + w,
            y + h,
            x,
            y + h,
            r
          );

          this.arcTo(
            x,
            y + h,
            x,
            y,
            r
          );

          this.arcTo(
            x,
            y,
            x + w,
            y,
            r
          );

          this.closePath();

          return this;
        };
    }

    // =========================
    // RESIZE
    // =========================

    const resize = () => {
      canvas.width =
        canvas.clientWidth * DPR;

      canvas.height =
        canvas.clientHeight * DPR;
    };

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    let animationFrame;

    // =========================
    // SMOOTH LINE
    // =========================

    const drawSmoothLine = (
      points,
      color,
      width,
      glow = false,
      opacity = 1
    ) => {
      if (!points.length) return;

      ctx.beginPath();

      ctx.moveTo(
        points[0].x,
        points[0].y
      );

      for (
        let i = 0;
        i <
        points.length - 1;
        i++
      ) {
        const current =
          points[i];

        const next =
          points[i + 1];

        const xc =
          (current.x + next.x) /
          2;

        const yc =
          (current.y + next.y) /
          2;

        ctx.quadraticCurveTo(
          current.x,
          current.y,
          xc,
          yc
        );
      }

      const last =
        points[
          points.length - 1
        ];

      ctx.lineTo(
        last.x,
        last.y
      );

      ctx.strokeStyle = color;

      ctx.globalAlpha =
        opacity;

      ctx.lineWidth = width;

      ctx.lineCap = "round";

      ctx.lineJoin = "round";

      if (glow) {
        ctx.shadowBlur = 8;

        ctx.shadowColor =
          color;
      }

      ctx.stroke();

      ctx.shadowBlur = 0;

      ctx.globalAlpha = 1;
    };

    // =========================
    // DRAW
    // =========================

    const draw = (time) => {
      const w = canvas.width;

      const h = canvas.height;

      ctx.clearRect(
        0,
        0,
        w,
        h
      );

      // BACKGROUND

      const bg =
        ctx.createLinearGradient(
          0,
          0,
          0,
          h
        );

      bg.addColorStop(
        0,
        COLORS.bg1
      );

      bg.addColorStop(
        1,
        COLORS.bg2
      );

      ctx.fillStyle = bg;

      ctx.fillRect(
        0,
        0,
        w,
        h
      );

      // VIGNETTE

      const vignette =
        ctx.createRadialGradient(
          w / 2,
          h / 2,
          100,
          w / 2,
          h / 2,
          w * 0.75
        );

      vignette.addColorStop(
        0,
        "rgba(0,0,0,0)"
      );

      vignette.addColorStop(
        1,
        "rgba(0,0,0,0.45)"
      );

      ctx.fillStyle =
        vignette;

      ctx.fillRect(
        0,
        0,
        w,
        h
      );

      // GRID

      ctx.strokeStyle =
        COLORS.grid;

      ctx.lineWidth = 1;

      for (
        let i = 0;
        i < 20;
        i++
      ) {
        const y =
          i * (h / 20);

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(w, y);

        ctx.stroke();
      }

      for (
        let i = 0;
        i < 24;
        i++
      ) {
        const x =
          i * (w / 24);

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, h);

        ctx.stroke();
      }

             // =========================
      // ORBIT RINGS
      // =========================

      for (
        let i = 0;
        i < 5;
        i++
      ) {
        ctx.beginPath();

        ctx.arc(
          w / 2,
          h * 0.46,
          55 +
  i * 34 +
            Math.sin(
              time * 0.001 +
                i
            ) *
              2,
          0,
          Math.PI * 2
        );

        ctx.strokeStyle = `rgba(0,212,255,${
          0.05 - i * 0.007
        })`;

        ctx.lineWidth = 1.2;

        ctx.stroke();
      }
      // INFO BOX

      const drawInfoBox = (
        x,
        y,
        line1,
        line2
      ) => {
        ctx.fillStyle =
          "rgba(15,23,42,0.72)";

        ctx.beginPath();

        ctx.roundRect(
          x,
          y,
          240,
          46,
          10
        );

        ctx.fill();

        ctx.strokeStyle =
          "rgba(255,255,255,0.08)";

        ctx.lineWidth = 1;

        ctx.stroke();

        ctx.fillStyle =
          "rgba(255,255,255,0.82)";

        ctx.font = `${
          10 * DPR
        }px Arial`;

        ctx.fillText(
          line1,
          x + 12,
          y + 18
        );

        ctx.fillStyle =
          "rgba(255,255,255,0.6)";

        ctx.fillText(
          line2,
          x + 12,
          y + 34
        );
      };

      drawInfoBox(
        w - 260,
        20,
        "Dashed lines show relative trend comparison.",
        "Balance line represents actual portfolio value."
      );

      drawInfoBox(
        w - 260,
        76,
        "Secondary dashed lines are normalized",
        "for comparative trend visualization."
      );

      // MAX VALUES

      const maxBalance =
        Math.max(
          ...data.map(
            (d) =>
              d.balance ||
              d.endBalance ||
              0
          ),
          1
        );

      const financialMax =
        Math.max(
          ...data.flatMap(
            (d) => [
              d.rmd || 0,
              d.growth || 0,
              d.tax || 0,
            ]
          ),
          1
        ) * 1.15;

     // POINTS

const balancePoints = [];

const rmdPoints = [];

const growthPoints = [];

const taxPoints = [];

data.forEach((d, i) => {
  const x =
    (i /
      Math.max(
        data.length - 1,
        1
      )) *
      (w * 0.82) +
    w * 0.07;

  const animatedOffset =
    Math.sin(
      time * 0.0012 +
        i * 0.22
    ) * 2;

  const balanceValue =
    d.balance ||
    d.endBalance ||
    0;

  // MOVED UPWARD
  const balanceY =
    h * 0.72 -
    (balanceValue /
      maxBalance) *
      (h * 0.42) +
    animatedOffset;

  balancePoints.push({
    x,
    y: balanceY,
    data: d,
  });

  // RMD
  const rmdY =
    h * 0.78 -
    (d.rmd /
      financialMax) *
      (h * 0.13);

  rmdPoints.push({
    x,
    y: rmdY,
  });

  // GROWTH
  const growthY =
    h * 0.78 -
    (d.growth /
      financialMax) *
      (h * 0.13);

  growthPoints.push({
    x,
    y: growthY,
  });

  // TAX
  const taxY =
    h * 0.78 -
    (d.tax /
      financialMax) *
      (h * 0.13);

  taxPoints.push({
    x,
    y: taxY,
  });
});

      // AREA GLOW

      ctx.beginPath();

      ctx.moveTo(
        balancePoints[0].x,
        h * 0.9
      );

      balancePoints.forEach(
        (p, i) => {
          if (i === 0) {
            ctx.lineTo(
              p.x,
              p.y
            );
          } else {
            const prev =
              balancePoints[
                i - 1
              ];

            const cx =
              (prev.x + p.x) /
              2;

            ctx.quadraticCurveTo(
              prev.x,
              prev.y,
              cx,
              (prev.y + p.y) /
                2
            );
          }
        }
      );

      const last =
        balancePoints[
          balancePoints.length -
            1
        ];

      ctx.lineTo(
        last.x,
        h * 0.9
      );

      ctx.closePath();

      const areaGradient =
        ctx.createLinearGradient(
          0,
          h * 0.25,
          0,
          h
        );

      areaGradient.addColorStop(
        0,
        "rgba(0,212,255,0.18)"
      );

      areaGradient.addColorStop(
        0.5,
        "rgba(0,212,255,0.06)"
      );

      areaGradient.addColorStop(
        1,
        "rgba(0,212,255,0)"
      );

      ctx.fillStyle =
        areaGradient;

      ctx.fill();

      // RELATIVE LINES

      ctx.setLineDash([
        8,
        8,
      ]);

      drawSmoothLine(
        growthPoints,
        COLORS.growth,
        1.2,
        false,
        0.18
      );

      drawSmoothLine(
        taxPoints,
        COLORS.tax,
        1.2,
        false,
        0.14
      );

      drawSmoothLine(
        rmdPoints,
        COLORS.rmd,
        1.6,
        false,
        0.4
      );

      ctx.setLineDash([]);

      // MAIN BALANCE

      drawSmoothLine(
        balancePoints,
        COLORS.balance,
        3,
        true,
        1
      );

      // NODES

      balancePoints.forEach(
        (p, i) => {
          const insideInfoZone =
            p.x >
              w - 280 &&
            p.y < 140;

          if (insideInfoZone)
            return;

          const isHovered =
            tooltip &&
            tooltip.data.year ===
              p.data.year;

          const pulse =
            3 +
            Math.sin(
              time * 0.004 +
                i * 0.3
            );

          const size =
            isHovered
              ? pulse + 2
              : pulse;

          if (isHovered) {
            ctx.beginPath();

            ctx.moveTo(
              p.x,
              0
            );

            ctx.lineTo(
              p.x,
              h
            );

            ctx.strokeStyle =
              "rgba(255,255,255,0.1)";

            ctx.lineWidth = 1;

            ctx.stroke();
          }

          ctx.beginPath();

          ctx.arc(
            p.x,
            p.y,
            (size + 1.5) * DPR,
            0,
            Math.PI * 2
          );

          ctx.fillStyle =
            "rgba(0,212,255,0.18)";

          ctx.fill();

          ctx.beginPath();

          ctx.arc(
            p.x,
            p.y,
            size * DPR,
            0,
            Math.PI * 2
          );

          ctx.fillStyle =
            COLORS.balance;

          ctx.shadowBlur =
            isHovered
              ? 16
              : 8;

          ctx.shadowColor =
            COLORS.balance;

          ctx.fill();

          ctx.shadowBlur = 0;
        }
      );

          // LEGEND

      const legends = [
        {
          color: COLORS.balance,
          label: "Balance",
        },
        {
          color: COLORS.rmd,
          label: "RMD (relative)",
        },
        {
          color: COLORS.growth,
          label: "Growth (relative)",
        },
        {
          color: COLORS.tax,
          label: "Tax (relative)",
        },
      ];

      legends.forEach((l, i) => {
        const lx = 28 + i * 145;

        // MOVED UP
        const ly = h - 58;

        ctx.beginPath();

        ctx.moveTo(lx, ly);

        ctx.lineTo(lx + 22, ly);

        ctx.strokeStyle = l.color;

        if (
          l.label.includes(
            "relative"
          )
        ) {
          ctx.setLineDash([
            6,
            6,
          ]);
        } else {
          ctx.setLineDash([]);
        }

        ctx.lineWidth = 2.2;

        ctx.stroke();

        ctx.setLineDash([]);

        ctx.fillStyle =
          "rgba(255,255,255,0.78)";

        ctx.font = `${
          10 * DPR
        }px Arial`;

        ctx.fillText(
          l.label,
          lx + 30,
          ly + 4
        );
      });

      // PARTICLES

      for (
        let i = 0;
        i < 14;
        i++
      ) {
        const px =
          ((time * 0.02 +
            i * 80) %
            w);

        const py =
          h * 0.25 +
          Math.sin(
            time * 0.001 +
              i
          ) *
            90 +
          i * 6;

        ctx.beginPath();

        ctx.arc(
          px,
          py,
          1 * DPR,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          "rgba(255,255,255,0.14)";

        ctx.fill();
      }

      animationFrame =
        requestAnimationFrame(
          draw
        );
    };

    animationFrame =
      requestAnimationFrame(
        draw
      );

    // HOVER

    const handleMove = (
      e
    ) => {
      const rect =
        canvas.getBoundingClientRect();

      const mouseX =
        e.clientX -
        rect.left;

      const mouseY =
        e.clientY -
        rect.top;

      const maxBalance =
        Math.max(
          ...data.map(
            (d) =>
              d.balance ||
              d.endBalance ||
              0
          ),
          1
        );

      let closestPoint =
        null;

      let closestDistance =
        Infinity;

      data.forEach((d, i) => {
        const x =
          (i /
            Math.max(
              data.length - 1,
              1
            )) *
            (rect.width *
              0.82) +
          rect.width * 0.07;

        const balanceValue =
          d.balance ||
          d.endBalance ||
          0;

        const animatedOffset =
          Math.sin(
            performance.now() *
              0.0012 +
              i * 0.22
          ) * 2.5;

        const y =
          rect.height *
            0.84 -
          (balanceValue /
            maxBalance) *
            (rect.height *
              0.48) +
          animatedOffset;

        const distance =
          Math.sqrt(
            (mouseX - x) **
              2 +
              (mouseY - y) **
                2
          );

        if (
          distance <
          closestDistance
        ) {
          closestDistance =
            distance;

          closestPoint = {
            x,
            y,
            data: d,
          };
        }
      });

      if (
        closestDistance < 26
      ) {
        setTooltip(
          closestPoint
        );
      } else {
        setTooltip(null);
      }
    };

    const handleLeave = () => {
      setTooltip(null);
    };

    canvas.addEventListener(
      "mousemove",
      handleMove
    );

    canvas.addEventListener(
      "mouseleave",
      handleLeave
    );

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      canvas.removeEventListener(
        "mousemove",
        handleMove
      );

      canvas.removeEventListener(
        "mouseleave",
        handleLeave
      );

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, [data, tooltip]);

  return (
    <div
      style={{
        width: "100%",

        height: "100%",

        minHeight: "380px",

        position:
          "relative",

        overflow:
          "visible",

        background: "#000",

        borderRadius:
          "18px",
      }}
    >
      <div
        style={{
          width: "100%",

          height: "440px",

          overflow: "hidden",

          borderRadius:
            "18px",

          position:
            "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",

            height: "440px",

            display: "block",

            borderRadius:
              "18px",
          }}
        />
      </div>

      {tooltip && (
        <div
          style={{
            position:
              "absolute",

            left:
              tooltip.x > 700
                ? tooltip.x -
                  180
                : tooltip.x +
                  18,

            top:
              tooltip.y > 140
                ? tooltip.y -
                  20
                : tooltip.y +
                  20,

            background:
              COLORS.tooltipBg,

            border:
              "1px solid rgba(255,255,255,0.12)",

            padding:
              "10px 12px",

            borderRadius:
              "12px",

            color: "white",

            fontSize:
              "10px",

            lineHeight:
              "1.5",

            pointerEvents:
              "none",

            boxShadow:
              "0 10px 30px rgba(0,0,0,0.45)",

            backdropFilter:
              "blur(12px)",

            minWidth:
              "160px",

            maxWidth:
              "180px",

            zIndex: 9999,
          }}
        >
          <div
            style={{
              fontWeight:
                "700",

              marginBottom:
                "8px",

              color:
                "#38bdf8",

              fontSize:
                "11px",
            }}
          >
            Age {
              tooltip.data.age
            }{" "}
            • Year{" "}
            {
              tooltip.data.year
            }
          </div>

          <div>
            Balance: $
            {Number(
              tooltip.data
                .balance ||
                tooltip.data
                  .endBalance ||
                0
            ).toLocaleString()}
          </div>

          <div
            style={{
              color:
                COLORS.growth,
            }}
          >
            Growth: $
            {Number(
              tooltip.data
                .growth || 0
            ).toLocaleString()}
          </div>

          <div
            style={{
              color:
                COLORS.rmd,
            }}
          >
            RMD: $
            {Number(
              tooltip.data
                .rmd || 0
            ).toLocaleString()}
          </div>

          <div
            style={{
              color:
                COLORS.tax,
            }}
          >
            Tax: $
            {Number(
              tooltip.data
                .tax || 0
            ).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}