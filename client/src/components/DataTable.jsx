import useRmd from "../hooks/useRmd";
import { formatCurrency } from "../utils/format";

import {
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";

const DataTable = () => {
  const { result } = useRmd();

  if (!result) return null;

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>

        
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2 }}
        >
          Detailed Projection
        </Typography>

        <Box
          sx={{
            overflowX: "auto",
            maxHeight: 400
          }}
        >
          <table
            style={{
              width: "100%",
              fontSize: "13px",
              borderCollapse: "collapse"
            }}
          >
            <thead>
              <tr style={{ textAlign: "left", color: "#6b7280" }}>
                <th style={{ padding: "10px" }}>Year</th>
                <th style={{ padding: "10px" }}>Age</th>
                <th style={{ padding: "10px" }}>RMD</th>
                <th style={{ padding: "10px" }}>Tax</th>
                <th style={{ padding: "10px" }}>Balance</th>
              </tr>
            </thead>

            <tbody>
              {result.rows.map((r, i) => (
                <tr
                  key={i}
                  style={{
                    borderTop: "1px solid #f3f4f6"
                  }}
                >
                  <td style={{ padding: "10px" }}>{r.year}</td>
                  <td style={{ padding: "10px" }}>{r.age}</td>

                  <td
                    style={{
                      padding: "10px",
                      fontVariantNumeric: "tabular-nums"
                    }}
                  >
                    {formatCurrency(r.rmd)}
                  </td>

                  <td
                    style={{
                      padding: "10px",
                      color: "#ef4444",
                      fontVariantNumeric: "tabular-nums"
                    }}
                  >
                    {formatCurrency(r.tax)}
                  </td>

                  <td
                    style={{
                      padding: "10px",
                      fontWeight: 500,
                      fontVariantNumeric: "tabular-nums"
                    }}
                  >
                    {formatCurrency(r.endBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

      </CardContent>
    </Card>
  );
};

export default DataTable;