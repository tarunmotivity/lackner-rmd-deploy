import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Customized
} from "recharts";

import useRmd from "../hooks/useRmd";
import { formatCurrency } from "../utils/format";


import {
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";


const RowBackground = (props) => {
  const { yAxisMap, offset, data } = props;

  if (!yAxisMap || !offset || !data) return null;

  const yAxis = Object.values(yAxisMap)[0];
  if (!yAxis || !yAxis.scale) return null;

  const bandSize = yAxis.scale.bandwidth?.();
  if (!bandSize) return null;

  return (
    <g>
      {data.map((entry, index) => {
        const y = yAxis.scale(entry.label);
        if (y === undefined) return null;

        return (
          <rect
            key={index}
            x={offset.left}
            y={y}
            width={offset.width}
            height={bandSize}
            fill={index % 2 === 0 ? "#f9fafb" : "#f3f4f6"}
          />
        );
      })}
    </g>
  );
};

const WaterfallProjection = () => {
  const { result, loading } = useRmd();

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography align="center">Loading...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!result || result.rows.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography align="center">No Data</Typography>
        </CardContent>
      </Card>
    );
  }

  const rows = result.rows.slice(0, 25);

  const data = rows.map((r, i, arr) => {
    const prev = arr[i - 1] || {};
    const remaining = r.beginBalance - r.rmd - r.tax;

    return {
      label: `${r.year} - ${r.age}`,

      principal: remaining,

      rmdCurrent: r.rmd,
      rmdPrior: prev.rmd || 0,

      taxCurrent: r.tax,
      taxPrior: prev.tax || 0,

      growthCurrent: r.growth,
      growthPrior: prev.growth || 0,

      full: r
    };
  });

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>

     
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2 }}
        >
          Waterfall Projection
        </Typography>

        
        <Box sx={{ width: "100%", height: "520px" }}>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              barCategoryGap="6%"
              barGap={0}
            >

            
              <Customized component={(props) => (
                <RowBackground {...props} data={data} />
              )} />

              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />

              <XAxis
                type="number"
                tickFormatter={(v) =>
                  `$${(v / 1000).toFixed(0)}k`
                }
              />

              <YAxis
                type="category"
                dataKey="label"
                width={110}
                interval={0}
                tick={{ fontSize: 12 }}
              />

           
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;

                  const d = payload[0].payload.full;

                  return (
                    <Box
                      sx={{
                        bgcolor: "#111827",
                        color: "#fff",
                        p: 2,
                        borderRadius: 2,
                        fontSize: 12,
                        boxShadow: 3
                      }}
                    >
                      <Typography fontWeight={600}>
                        Year {d.year}, Age {d.age}
                      </Typography>

                      <Typography>
                        Begin: {formatCurrency(d.beginBalance)}
                      </Typography>

                      <Typography>
                        RMD: {formatCurrency(d.rmd)}
                      </Typography>

                      <Typography>
                        Tax: {formatCurrency(d.tax)}
                      </Typography>

                      <Typography>
                        Growth: {formatCurrency(d.growth)}
                      </Typography>

                      <Typography fontWeight={600}>
                        End: {formatCurrency(d.endBalance)}
                      </Typography>
                    </Box>
                  );
                }}
              />

              <Legend />

              
              <Bar dataKey="principal" stackId="a" fill="#4d7c0f" name="Principal" />

              <Bar dataKey="rmdCurrent" stackId="a" fill="#6d28d9" name="RMD Current" />
              <Bar dataKey="rmdPrior" stackId="a" fill="#c4b5fd" name="RMD Prior" />

              <Bar dataKey="taxCurrent" stackId="a" fill="#e11d48" name="Tax Current" />
              <Bar dataKey="taxPrior" stackId="a" fill="#f9a8d4" name="Tax Prior" />

              <Bar dataKey="growthCurrent" stackId="a" fill="#22c55e" name="Growth Current" />
              <Bar dataKey="growthPrior" stackId="a" fill="#bbf7d0" name="Growth Prior" />

            </BarChart>
          </ResponsiveContainer>

        </Box>

      </CardContent>
    </Card>
  );
};

export default WaterfallProjection;