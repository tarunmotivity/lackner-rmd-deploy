import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  // eslint-disable-next-line no-unused-vars
  PieChart,
  // eslint-disable-next-line no-unused-vars
  Pie,
  // eslint-disable-next-line no-unused-vars
  Cell,
} from "recharts";
 
import { useState } from "react";
import useRmd from "../hooks/useRmd";
import { formatCurrency } from "../utils/format";
import PieChart3D from "./PieChart3D";
import ThreeDBarChart from "./ThreeDBarChart";
 
 
 
import {
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Box,
} from "@mui/material";
 
const AdvancedChart = () => {
  const { result, inputs } = useRmd();
 
  const [view, setView] = useState("projection");
  const [activeIndex, setActiveIndex] = useState(0);
 
  const handleChange = (_, newView) => {
    if (newView !== null) setView(newView);
  };
 
  const isDeceased = inputs?.scenario?.includes("DECEASED");
 
  if (isDeceased && !inputs.date_Death_Owner) {
    return (
      <Card>
        <CardContent>
          <Typography align="center">Enter Date of Death</Typography>
        </CardContent>
      </Card>
    );
  }
 
  if (!result || result.rows.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography align="center">No Projection Available</Typography>
        </CardContent>
      </Card>
    );
  }
 
 
  const data = result.rows.slice(0, 30).map((r) => ({
    label: `${r.age} (${r.year})`,
    rmd: r.rmd,
    tax: r.tax,
    growth: r.growth,
    balance: r.endBalance,
  }));
 
  const pieData = [
    { label: "Withdrawals", value: result.totalRmd },
    { label: "Taxes", value: result.totalTax },
    { label: "Growth", value: result.totalGrowth },
  ];
 
  const total = result.totalRmd + result.totalTax + result.totalGrowth;
 
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
       
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Projection</Typography>
 
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleChange}
            size="small"
          >
            <ToggleButton value="projection">Projection</ToggleButton>
            <ToggleButton value="bar">Bar</ToggleButton>
            <ToggleButton value="pie">Pie</ToggleButton>
          </ToggleButtonGroup>
        </Box>
 
        <Box sx={{ width: "100%", height: 350, display: "flex", flexDirection: "column" }}>
         
          {view === "projection" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
 
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
 
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
 
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
 
                <Bar dataKey="rmd" fill="#7c3aed" />
                <Bar dataKey="tax" fill="#ef4444" />
                <Bar dataKey="growth" fill="#22c55e" />
 
                <Line
                  dataKey="balance"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
 
       
         {view === "bar" && (
            <>
              <Box sx={{ width: "100%", flexGrow: 1, position: "relative", minHeight: 0 }}>
                <ThreeDBarChart data={data} formatCurrency={formatCurrency} />
              </Box>
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', pt: 1, pb: 1 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 14, height: 14, backgroundColor: '#7c3aed', borderRadius: '2px' }} />
                  <Typography variant="body2" color="textPrimary" fontWeight="500">RMD</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 14, height: 14, backgroundColor: '#ef4444', borderRadius: '2px' }} />
                  <Typography variant="body2" color="textPrimary" fontWeight="500">Tax</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 14, height: 14, backgroundColor: '#22c55e', borderRadius: '2px' }} />
                  <Typography variant="body2" color="textPrimary" fontWeight="500">Growth</Typography>
                </Box>
              </Box>
            </>
          )}

 
         
         
 
          {view === "pie" && (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1,
              }}
            >
              {/* Left side: 3D Pie Chart */}
              <Box
                sx={{
                  flex: 1.5,
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                  minHeight: 350
                }}
              >
                <PieChart3D data={pieData} />
              </Box>
 
 
             
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  pl: 2,
                }}
              >
                {pieData.map((item, i) => {
                  const percent = ((item.value / total) * 100).toFixed(1);
 
                  return (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1,
                        borderRadius: 2,
                        backgroundColor:
                          i === activeIndex ? "#f3f4f6" : "transparent",
                        cursor: "pointer",
                      }}
                      onMouseEnter={() => setActiveIndex(i)}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={1}
                      >
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            backgroundColor:
                              i === 0
                                ? "#7c3aed"
                                : i === 1
                                  ? "#ef4444"
                                  : "#22c55e",
                          }}
                        />
 
                        <Typography fontSize={13}>{item.label}</Typography>
                      </Box>
 
                      <Box textAlign="right">
                        <Typography
                          sx={{
                            minWidth: 140,
                            textAlign: "right",
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {formatCurrency(item.value)}
                        </Typography>
                        <Typography variant="caption">{percent}%</Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
 
export default AdvancedChart;
 
 