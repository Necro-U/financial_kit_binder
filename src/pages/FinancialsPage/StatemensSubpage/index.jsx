import React, { useEffect, useState } from "react";
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
  IconButton,
  Button,
  ButtonGroup,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getBalancesheet,
  getCashflow,
  getIncomeStatement,
} from "@/actions/financeActions"; // Assuming getIncomeStatement action exists
import TabsLayout1 from "@/pages/FinancialsPage/EquitiesPage";
import FinancialsTabsLayout from "@/pages/EquitiesFinancialsPage";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const StatementsSubpage = () => {
  const dispatch = useDispatch();
  const { symbol } = useParams();
  const [balanceSheetData, setBalanceSheetData] = useState([]);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [incomeStatementData, setIncomeStatementData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [period, setPeriod] = useState("annual");
  const [currentStatement, setCurrentStatement] = useState("balanceSheet");

  const keyMappingBalanceSheet = {
    "Total Assets": "Total Assets",
    "Current Assets": "Current Assets",
    "Total Non Current Assets": "Total Non Current Assets",
    "Cash And Cash Equivalents": "Cash & Equivalents",
    "Accounts Receivable": "Accounts Receivable",
    Inventory: "Inventory",
    "Net PPE": "Property, Plant & Equipment",
    "Goodwill And Other Intangible Assets": "Intangible Assets",
    "Total Liabilities Net Minority Interest": "Liabilities",
    "Current Liabilities": "Current Liabilities",
    "Accounts Payable": "Accounts Payable",
    "Current Debt": "Short-term Debt",
    "Total Non Current Liabilities Net Minority Interest":
      "Long-term Liabilities",
    "Stockholders Equity": "Equity",
  };

  const keyMappingCashFlow = {
    "Operating Cash Flow": "Operating Activities",
    "Net Income From Continuing Operations": "Net Income",
    "Depreciation Amortization Depletion": "Depreciation & Amortization",
    "Change In Working Capital": "Changes in Working Capital",
    "Investing Cash Flow": "Investing Activities",
    "Capital Expenditure": "Capital Expenditures",
    "Net Business Purchase And Sale": "Acquisitions",
    "Financing Cash Flow": "Financing Activities",
    "Net Issuance Payments Of Debt": "Debt Issuance",
    "Cash Dividends Paid": "Dividends Paid",
    "Changes In Cash": "Net Cash Flow",
  };

  const keyMappingIncomeStatement = {
    "Total Revenue": "Total Revenue",
    "Cost Of Revenue": "Cost of Goods Sold",
    "Gross Profit": "Gross Profit",
    "Operating Expense": "Operating Expenses",
    "Research And Development": "Research & Development",
    "Selling General And Administration": "Marketing & Sales",
    "General And Administrative": "General & Administrative",
    "Operating Income": "Operating Income",
    "Interest Expense": "Interest Expense",
    "Tax Provision": "Taxes",
    "Net Income": "Net Income",
  };

  const getBalanceSheet = async () => {
    const data = {
      names: [symbol],
      period: "1mo",
      interval: "1wk",
      range: period === "annual" ? "annual" : "quarter",
    };
    var temp = await dispatch(getBalancesheet(data));
    if (temp.payload[symbol]) {
      const formattedData = formatData(
        temp.payload[symbol],
        keyMappingBalanceSheet,
      );
      setBalanceSheetData(formattedData);
    }
  };

  const getCashFlowData = async () => {
    const data = {
      names: [symbol],
      period: "1mo",
      interval: "1wk",
      range: period === "annual" ? "annual" : "quarter",
    };
    var temp = await dispatch(getCashflow(data));
    if (temp.payload[symbol]) {
      const formattedData = formatData(
        temp.payload[symbol],
        keyMappingCashFlow,
      );
      setCashFlowData(formattedData);
    }
  };

  const getIncomeStatementData = async () => {
    const data = {
      names: [symbol],
      period: "1mo",
      interval: "1wk",
      range: period === "annual" ? "annual" : "quarter",
    };
    var temp = await dispatch(getIncomeStatement(data));
    if (temp.payload[symbol]) {
      const formattedData = formatData(
        temp.payload[symbol],
        keyMappingIncomeStatement,
      );
      setIncomeStatementData(formattedData);
    }
  };

  const formatData = (data, keyMapping) => {
    const dates = Object.keys(data).sort((a, b) => new Date(b) - new Date(a));
    const formattedData = {};

    dates.forEach((date) => {
      const dateData = data[date];
      Object.keys(keyMapping).forEach((key) => {
        if (!formattedData[keyMapping[key]]) {
          formattedData[keyMapping[key]] = { name: keyMapping[key] };
        }
        formattedData[keyMapping[key]][date] =
          dateData[key] !== null && dateData[key] !== undefined
            ? `$${dateData[key].toLocaleString()}`
            : "---";
      });
    });

    return { dates, formattedData };
  };

  useEffect(() => {
    getBalanceSheet();
    getCashFlowData();
    getIncomeStatementData();
  }, [symbol, period]);

  const handleToggleRow = (key) => {
    setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const handleStatementChange = (statement) => {
    setCurrentStatement(statement);
  };

  if (
    !balanceSheetData.dates ||
    !balanceSheetData.formattedData ||
    !cashFlowData.dates ||
    !cashFlowData.formattedData ||
    !incomeStatementData.dates ||
    !incomeStatementData.formattedData
  ) {
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

  const { dates: balanceSheetDates, formattedData: formattedBalanceSheetData } =
    balanceSheetData;
  const { dates: cashFlowDates, formattedData: formattedCashFlowData } =
    cashFlowData;
  const {
    dates: incomeStatementDates,
    formattedData: formattedIncomeStatementData,
  } = incomeStatementData;

  return (
    <TabsLayout1>
      <FinancialsTabsLayout>
        <Box sx={{ textAlign: "center" }}>
          <Box display="flex" justifyContent="space-between" mt={4} mx={8}>
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
                onClick={() => handleStatementChange("balanceSheet")}
                sx={{
                  backgroundColor:
                    currentStatement === "balanceSheet"
                      ? "primary.main"
                      : "grey.300",
                  color:
                    currentStatement === "balanceSheet"
                      ? "common.white"
                      : "text.primary",
                  "&:hover": {
                    backgroundColor:
                      currentStatement === "balanceSheet"
                        ? "primary.dark"
                        : "grey.400",
                  },
                }}
              >
                Balance Sheet
              </Button>
              <Button
                onClick={() => handleStatementChange("cashFlow")}
                sx={{
                  backgroundColor:
                    currentStatement === "cashFlow"
                      ? "primary.main"
                      : "grey.300",
                  color:
                    currentStatement === "cashFlow"
                      ? "common.white"
                      : "text.primary",
                  "&:hover": {
                    backgroundColor:
                      currentStatement === "cashFlow"
                        ? "primary.dark"
                        : "grey.400",
                  },
                }}
              >
                Cash Flow
              </Button>
              <Button
                onClick={() => handleStatementChange("incomeStatement")}
                sx={{
                  backgroundColor:
                    currentStatement === "incomeStatement"
                      ? "primary.main"
                      : "grey.300",
                  color:
                    currentStatement === "incomeStatement"
                      ? "common.white"
                      : "text.primary",
                  "&:hover": {
                    backgroundColor:
                      currentStatement === "incomeStatement"
                        ? "primary.dark"
                        : "grey.400",
                  },
                }}
              >
                Income Statement
              </Button>
            </ButtonGroup>
          </Box>
          <Box display="flex" justifyContent="flex-end" mt={4} mx={8}>
            <ButtonGroup
              variant="contained"
              aria-label="outlined primary button group"
              sx={{
                mb: 2,
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <Button
                onClick={() => handlePeriodChange("annual")}
                sx={{
                  backgroundColor:
                    period === "annual" ? "primary.main" : "grey.300",
                  color: period === "annual" ? "common.white" : "text.primary",
                  "&:hover": {
                    backgroundColor:
                      period === "annual" ? "primary.dark" : "grey.400",
                  },
                }}
                disabled={period === "annual"}
              >
                Annual
              </Button>
              <Button
                onClick={() => handlePeriodChange("quarterly")}
                sx={{
                  backgroundColor:
                    period === "quarterly" ? "primary.main" : "grey.300",
                  color:
                    period === "quarterly" ? "common.white" : "text.primary",
                  "&:hover": {
                    backgroundColor:
                      period === "quarterly" ? "primary.dark" : "grey.400",
                  },
                }}
                disabled={period === "quarterly"}
              >
                Quarterly
              </Button>
            </ButtonGroup>
          </Box>
          <Box display="flex" justifyContent="space-between" mt={4} mx={8}>
            {currentStatement === "balanceSheet" && (
              <Box sx={{ width: "100%" }}>
                <TableContainer
                  component={Paper}
                  sx={{ borderRadius: "10px", boxShadow: 3 }}
                >
                  <Table>
                    <TableHead sx={{ backgroundColor: "#ffffff" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                          Parameter
                        </TableCell>
                        {balanceSheetDates.map((date, index) => (
                          <TableCell
                            key={date}
                            sx={{
                              fontWeight: "bold",
                              color: "#333",
                              backgroundColor:
                                index % 2 === 0 ? "#f5f5f5" : "#ffffff",
                            }}
                          >
                            {date}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(formattedBalanceSheetData).map(
                        (key) =>
                          key !== "Current Assets" &&
                          key !== "Total Non Current Assets" &&
                          key !== "Current Liabilities" &&
                          key !== "Long-term Liabilities" && (
                            <React.Fragment key={key}>
                              <TableRow>
                                <TableCell sx={{ backgroundColor: "#ffffff" }}>
                                  {formattedBalanceSheetData[key].name}
                                  {(key === "Total Assets" ||
                                    key === "Liabilities") && (
                                    <IconButton
                                      onClick={() => handleToggleRow(key)}
                                    >
                                      {expandedRows[key] ? (
                                        <ExpandLessIcon />
                                      ) : (
                                        <ExpandMoreIcon />
                                      )}
                                    </IconButton>
                                  )}
                                </TableCell>
                                {balanceSheetDates.map((date, index) => (
                                  <TableCell
                                    key={date}
                                    sx={{
                                      backgroundColor:
                                        index % 2 === 0 ? "#f5f5f5" : "#ffffff",
                                    }}
                                  >
                                    {formattedBalanceSheetData[key][date] ||
                                      "---"}
                                  </TableCell>
                                ))}
                              </TableRow>
                              {expandedRows[key] && key === "Total Assets" && (
                                <>
                                  <TableRow>
                                    <TableCell
                                      sx={{ pl: 4, backgroundColor: "#ffffff" }}
                                    >
                                      Current Assets
                                    </TableCell>
                                    {balanceSheetDates.map((date, index) => (
                                      <TableCell
                                        key={date}
                                        sx={{
                                          backgroundColor:
                                            index % 2 === 0
                                              ? "#f5f5f5"
                                              : "#ffffff",
                                        }}
                                      >
                                        {formattedBalanceSheetData[
                                          "Current Assets"
                                        ][date] || "---"}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                  <TableRow>
                                    <TableCell
                                      sx={{ pl: 4, backgroundColor: "#ffffff" }}
                                    >
                                      Total Non Current Assets
                                    </TableCell>
                                    {balanceSheetDates.map((date, index) => (
                                      <TableCell
                                        key={date}
                                        sx={{
                                          backgroundColor:
                                            index % 2 === 0
                                              ? "#f5f5f5"
                                              : "#ffffff",
                                        }}
                                      >
                                        {formattedBalanceSheetData[
                                          "Total Non Current Assets"
                                        ][date] || "---"}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                </>
                              )}
                              {expandedRows[key] && key === "Liabilities" && (
                                <>
                                  <TableRow>
                                    <TableCell
                                      sx={{ pl: 4, backgroundColor: "#ffffff" }}
                                    >
                                      Current Liabilities
                                    </TableCell>
                                    {balanceSheetDates.map((date, index) => (
                                      <TableCell
                                        key={date}
                                        sx={{
                                          backgroundColor:
                                            index % 2 === 0
                                              ? "#f5f5f5"
                                              : "#ffffff",
                                        }}
                                      >
                                        {formattedBalanceSheetData[
                                          "Current Liabilities"
                                        ][date] || "---"}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                  <TableRow>
                                    <TableCell
                                      sx={{ pl: 4, backgroundColor: "#ffffff" }}
                                    >
                                      Long-term Liabilities
                                    </TableCell>
                                    {balanceSheetDates.map((date, index) => (
                                      <TableCell
                                        key={date}
                                        sx={{
                                          backgroundColor:
                                            index % 2 === 0
                                              ? "#f5f5f5"
                                              : "#ffffff",
                                        }}
                                      >
                                        {formattedBalanceSheetData[
                                          "Long-term Liabilities"
                                        ][date] || "---"}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                </>
                              )}
                            </React.Fragment>
                          ),
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {currentStatement === "cashFlow" && (
              <Box sx={{ width: "100%" }}>
                <TableContainer
                  component={Paper}
                  sx={{ borderRadius: "10px", boxShadow: 3 }}
                >
                  <Table>
                    <TableHead sx={{ backgroundColor: "#ffffff" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                          Parameter
                        </TableCell>
                        {cashFlowDates.map((date, index) => (
                          <TableCell
                            key={date}
                            sx={{
                              fontWeight: "bold",
                              color: "#333",
                              backgroundColor:
                                index % 2 === 0 ? "#f5f5f5" : "#ffffff",
                            }}
                          >
                            {date}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(formattedCashFlowData).map((key) => (
                        <TableRow key={key}>
                          <TableCell sx={{ backgroundColor: "#ffffff" }}>
                            {formattedCashFlowData[key].name}
                          </TableCell>
                          {cashFlowDates.map((date, index) => (
                            <TableCell
                              key={date}
                              sx={{
                                backgroundColor:
                                  index % 2 === 0 ? "#f5f5f5" : "#ffffff",
                              }}
                            >
                              {formattedCashFlowData[key][date] || "---"}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
            {currentStatement === "incomeStatement" && (
              <Box sx={{ width: "100%" }}>
                <TableContainer
                  component={Paper}
                  sx={{ borderRadius: "10px", boxShadow: 3 }}
                >
                  <Table>
                    <TableHead sx={{ backgroundColor: "#ffffff" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                          Parameter
                        </TableCell>
                        {incomeStatementDates.map((date, index) => (
                          <TableCell
                            key={date}
                            sx={{
                              fontWeight: "bold",
                              color: "#333",
                              backgroundColor:
                                index % 2 === 0 ? "#f5f5f5" : "#ffffff",
                            }}
                          >
                            {date}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(formattedIncomeStatementData).map((key) => (
                        <TableRow key={key}>
                          <TableCell sx={{ backgroundColor: "#ffffff" }}>
                            {formattedIncomeStatementData[key].name}
                          </TableCell>
                          {incomeStatementDates.map((date, index) => (
                            <TableCell
                              key={date}
                              sx={{
                                backgroundColor:
                                  index % 2 === 0 ? "#f5f5f5" : "#ffffff",
                              }}
                            >
                              {formattedIncomeStatementData[key][date] || "---"}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        </Box>
      </FinancialsTabsLayout>
    </TabsLayout1>
  );
};

export default StatementsSubpage;
