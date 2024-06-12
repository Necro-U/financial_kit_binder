import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getFinancials } from "@/actions/stockActions";
import TabsLayout1 from "@/pages/FinancialsPage/EquitiesPage";
import FinancialsTabsLayout from "@/pages/EquitiesFinancialsPage";
import { Box, Typography, Grid, Paper, CircularProgress } from "@mui/material";

const StatisticSubpage = () => {
  const dispatch = useDispatch();
  const { symbol } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(getFinancials(symbol));
      setData(result.payload);
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

  const {
    statistics: {
      stockPriceHistory: {
        "Beta (5Y Monthly)": beta,
        "52 Week Range 3": week52Change,
        "S&P 500 52-Week Change 3": sp500Change,
        "52 Week High 3": week52High,
        "52 Week Low 3": week52Low,
        "50-Day Moving Average 3": movingAvg50Day,
        "200-Day Moving Average 3": movingAvg200Day,
      },
      shareStatistics: {
        "Forward Annual Dividend Rate 4": forwardDividendRate,
        "Forward Annual Dividend Yield 4": forwardDividendYield,
        "Trailing Annual Dividend Rate 3": trailingDividendRate,
        "Trailing Annual Dividend Yield 3": trailingDividendYield,
        "5 Year Average Dividend Yield 4": avgDividendYield5Year,
        "Payout Ratio 4": payoutRatio,
        "Dividend Date 3": dividendDate,
        "Ex-Dividend Date 4": exDividendDate,
        "Last Split Factor 2": lastSplitFactor,
        "Last Split Date 3": lastSplitDate,
      },
    },
  } = data;

  return (
    <TabsLayout1>
      <FinancialsTabsLayout>
        {/* Stock Price History */}
        <Box mt={4} mb={2}>
          <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: 2, backgroundColor: "#f9f9f9" }}
          >
            <Typography variant="h5" gutterBottom>
              Stock Price History
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  <strong>52 Week High:</strong> ${week52High}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>52 Week Low:</strong> ${week52Low}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>52-Week Change:</strong> {week52Change}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>50-Day Moving Average:</strong> ${movingAvg50Day}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>200-Day Moving Average:</strong> ${movingAvg200Day}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Beta (5Y Monthly):</strong> {beta}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>S&P 500 52-Week Change:</strong> {sp500Change}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Share Statistics */}
        <Box mb={4}>
          <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: 2, backgroundColor: "#f9f9f9" }}
          >
            <Typography variant="h5" gutterBottom>
              Share Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Forward Annual Dividend Rate:</strong> $
                  {forwardDividendRate}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Forward Annual Dividend Yield:</strong>{" "}
                  {forwardDividendYield}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Trailing Annual Dividend Rate:</strong> $
                  {trailingDividendRate}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Trailing Annual Dividend Yield:</strong>{" "}
                  {trailingDividendYield}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>5 Year Average Dividend Yield:</strong>{" "}
                  {avgDividendYield5Year}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Payout Ratio:</strong> {payoutRatio}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Dividend Date:</strong> {dividendDate}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Ex-Dividend Date:</strong> {exDividendDate}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Last Split Factor:</strong> {lastSplitFactor}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Last Split Date:</strong> {lastSplitDate}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </FinancialsTabsLayout>
    </TabsLayout1>
  );
};

export default StatisticSubpage;
