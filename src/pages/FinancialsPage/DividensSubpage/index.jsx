import React, { useEffect, useState } from "react";
import TabsLayout1 from "@/pages/FinancialsPage/EquitiesPage";
import { getFinancials } from "@/actions/stockActions";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FinancialsTabsLayout from "@/pages/EquitiesFinancialsPage";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";

const DividendsSubpage = () => {
  const dispatch = useDispatch();
  const { symbol } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(getFinancials(symbol));
      const risks = result.payload.dividends;
      setData(risks);
      console.log(risks);
    };

    fetchData();
  }, [dispatch, symbol]);

  if (!data) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Example dividend data
  const dividendData = [
    {
      name: "Forward Annual Dividend Rate",
      value: data["forward_annual_dividend_rate"],
    },
    {
      name: "Forward Annual Dividend Yield",
      value: data["forward_annual_dividend_yield"],
    },
    { name: "Ex-Dividend Date", value: data["ex_dividend_date"] },
    { name: "Last Split Factor", value: data["last_split_factor"] },
    { name: "Dividend Payout Ratio", value: data["dividend_payout_ratio"] },
    { name: "Dividend date", value: data["divident_date"] },
    { name: "Ex-Dividend Date 2", value: data["ex_dividend_date"] },
    { name: "Last Split Factor 2", value: data["last_split_factor"] },
    { name: "Last Split Date", value: data["last_split_date"] },
  ];

  return (
    <TabsLayout1>
      <FinancialsTabsLayout>
        <Box sx={{ pt: 2, pl: 2 }}>
          {" "}
          {/* Reduced padding */}
          <Divider sx={{ mb: 1 }} />
          <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
            <Table sx={{ minWidth: 400 }}>
              <TableHead sx={{ backgroundColor: "#f3f3f3" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1rem", // Reduced font size
                      color: "#333",
                    }}
                  >
                    Parameter
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1rem", // Reduced font size
                      color: "#333",
                    }}
                  >
                    Value
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dividendData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontSize: "0.9rem", color: "#555" }} // Reduced font size
                    >
                      {row.name}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.9rem", color: "#555" }}>
                      {row.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </FinancialsTabsLayout>
    </TabsLayout1>
  );
};

export default DividendsSubpage;
