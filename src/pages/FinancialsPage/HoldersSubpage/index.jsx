import React, { useEffect, useState } from "react";
import TabsLayout1 from "@/pages/FinancialsPage/EquitiesPage";
import FinancialsTabsLayout from "@/pages/EquitiesFinancialsPage";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  CircularProgress,
  ButtonGroup,
  Button,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getFinancials } from "@/actions/stockActions";

const HoldersSubpage = () => {
  const dispatch = useDispatch();
  const { symbol } = useParams();
  const [data, setData] = useState(null);
  const [activeTable, setActiveTable] = useState("insiderPurchasesLast6Months"); // Default to insider purchases

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(getFinancials(symbol));
      setData(result.payload.holders);
      console.log(result.payload.holders);
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
    insiderPurchasesLast6Months,
    topMutualFundHolders,
    topInstitutionalHolders,
  } = data;

  const handleTableChange = (table) => {
    setActiveTable(table);
  };

  return (
    <TabsLayout1>
      <FinancialsTabsLayout>
        <Box sx={{ textAlign: "center" }}>
          {/* Buttons for table selection */}
          <Box display="flex" justifyContent="center" mt={4} mx={8}>
            <ButtonGroup
              variant="contained"
              aria-label="outlined primary button group"
              sx={{
                mb: 2,
                backgroundColor: "#f3f3f3",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <Button
                onClick={() => handleTableChange("insiderPurchasesLast6Months")}
                sx={{
                  backgroundColor:
                    activeTable === "insiderPurchasesLast6Months"
                      ? "primary.main"
                      : "grey.300",
                  color:
                    activeTable === "insiderPurchasesLast6Months"
                      ? "common.white"
                      : "text.primary",
                  "&:hover": {
                    backgroundColor:
                      activeTable === "insiderPurchasesLast6Months"
                        ? "primary.dark"
                        : "grey.400",
                  },
                }}
              >
                Insider Purchases Last 6 Months
              </Button>
              <Button
                onClick={() => handleTableChange("topMutualFundHolders")}
                sx={{
                  backgroundColor:
                    activeTable === "topMutualFundHolders"
                      ? "primary.main"
                      : "grey.300",
                  color:
                    activeTable === "topMutualFundHolders"
                      ? "common.white"
                      : "text.primary",
                  "&:hover": {
                    backgroundColor:
                      activeTable === "topMutualFundHolders"
                        ? "primary.dark"
                        : "grey.400",
                  },
                }}
              >
                Top Mutual Fund Holders
              </Button>
              <Button
                onClick={() => handleTableChange("topInstitutionalHolders")}
                sx={{
                  backgroundColor:
                    activeTable === "topInstitutionalHolders"
                      ? "primary.main"
                      : "grey.300",
                  color:
                    activeTable === "topInstitutionalHolders"
                      ? "common.white"
                      : "text.primary",
                  "&:hover": {
                    backgroundColor:
                      activeTable === "topInstitutionalHolders"
                        ? "primary.dark"
                        : "grey.400",
                  },
                }}
              >
                Top Institutional Holders
              </Button>
            </ButtonGroup>
          </Box>

          {/* Render selected table */}
          {activeTable === "insiderPurchasesLast6Months" &&
            insiderPurchasesLast6Months && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}></Typography>
                <Divider sx={{ mb: 2 }} />
                <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: "#f3f3f3" }}>
                      <TableRow>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#333333" }}
                        >
                          Type
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#333333" }}
                        >
                          Shares
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#333333" }}
                        >
                          Transactions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {insiderPurchasesLast6Months.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ color: "#555555" }}>
                            {row["Unnamed: 0"]}
                          </TableCell>
                          <TableCell sx={{ color: "#555555" }}>
                            {row.Shares}
                          </TableCell>
                          <TableCell sx={{ color: "#555555" }}>
                            {row.Transactions}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

          {activeTable === "topMutualFundHolders" && topMutualFundHolders && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}></Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#f3f3f3" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>
                        Holder
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>
                        Shares
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>
                        Date Reported
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>
                        % Out
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>
                        Value
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topMutualFundHolders.map((holder, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ color: "#555555" }}>
                          {holder.Holder}
                        </TableCell>
                        <TableCell sx={{ color: "#555555" }}>
                          {holder.Shares}
                        </TableCell>
                        <TableCell sx={{ color: "#555555" }}>
                          {holder["Date Reported"]}
                        </TableCell>
                        <TableCell sx={{ color: "#555555" }}>
                          {holder["% Out"]}
                        </TableCell>
                        <TableCell sx={{ color: "#555555" }}>
                          {holder.Value.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {activeTable === "topInstitutionalHolders" &&
            topInstitutionalHolders && (
              <Box>
                <Typography variant="h5" sx={{ mb: 2 }}></Typography>
                <Divider sx={{ mb: 2 }} />
                <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: "#f3f3f3" }}>
                      <TableRow>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#333333" }}
                        >
                          Holder
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#333333" }}
                        >
                          Shares
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#333333" }}
                        >
                          Date Reported
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#333333" }}
                        >
                          % Out
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#333333" }}
                        >
                          Value
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topInstitutionalHolders.map((holder, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ color: "#555555" }}>
                            {holder.Holder}
                          </TableCell>
                          <TableCell sx={{ color: "#555555" }}>
                            {holder.Shares}
                          </TableCell>
                          <TableCell sx={{ color: "#555555" }}>
                            {holder["Date Reported"]}
                          </TableCell>
                          <TableCell sx={{ color: "#555555" }}>
                            {holder["% Out"]}
                          </TableCell>
                          <TableCell sx={{ color: "#555555" }}>
                            {holder.Value.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
        </Box>
      </FinancialsTabsLayout>
    </TabsLayout1>
  );
};

export default HoldersSubpage;
