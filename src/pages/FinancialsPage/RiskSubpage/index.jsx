import TabsLayout1 from "@/pages/FinancialsPage/EquitiesPage";
import FinancialsTabsLayout from "@/pages/EquitiesFinancialsPage";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getFinancials } from "@/actions/stockActions";

const RiskSubpage = () => {
  const dispatch = useDispatch();
  const { symbol } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(getFinancials(symbol));
      const risks = result.payload.risks;
      const lastRisk = risks[risks.length - 1];
      setData(lastRisk);
      console.log(lastRisk);
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

  return (
    <TabsLayout1>
      <FinancialsTabsLayout>
        <Box sx={{ textAlign: "center", pt: 4 }}>
          {/*<Typography variant="h2">Risk Page</Typography>*/}
          <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  ESG Risk Ratings
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ mr: 4 }}>
                    <Typography variant="body1">
                      <strong>Total ESG Risk Score:</strong>
                    </Typography>
                    <Typography variant="body1">{data["esgScore"]}</Typography>
                  </Box>
                  <Box sx={{ mr: 4 }}>
                    <Typography variant="body1">
                      <strong>Environment Risk Score:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {data["environmentScore"]}
                    </Typography>
                  </Box>
                  <Box sx={{ mr: 4 }}>
                    <Typography variant="body1">
                      <strong>Social Risk Score:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {data["socialScore"]}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1">
                      <strong>Governance Risk Score:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {data["governanceScore"]}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 4, textAlign: "left" }}>
                  <Typography variant="body2" color="textSecondary">
                    Last Update: {data["date"]}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </FinancialsTabsLayout>
    </TabsLayout1>
  );
};

export default RiskSubpage;
