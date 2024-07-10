import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Modal,
  TextField,
  IconButton,
  Collapse,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Plus as PlusIcon } from "@phosphor-icons/react";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { FormattedMessage } from "react-intl";
import {
  getPortfolio,
  createPortfolioItem,
  deletePortfolioItem,
  getPortfolioItemTransaction,
  createTransaction,
  deleteTransaction,
  putTransaction,
} from "@/actions/portfolioActions";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 10,
  boxShadow: 24,
  p: 4,
};

const PortfolioDetailPage = () => {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const portfolioItems = useSelector((state) =>
    state.portfolio.portfolioItems
      ? state.portfolio.portfolioItems[portfolioId]
      : [],
  );
  const portfolioTransactions = useSelector((state) =>
    state.portfolio.portfolioTransactions
      ? state.portfolio.portfolioTransactions
      : {},
  );

  const [openModal, setOpenModal] = useState(false);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newAsset, setNewAsset] = useState({
    symbol: "",
    quantity_owned: 0,
    last_price: 0,
    avg_buy_price: 0,
    ur_gain: 0,
    r_gain: 0,
    portfolio: portfolioId,
  });
  const [isCustomSymbol, setIsCustomSymbol] = useState(false);

  const [newTransaction, setNewTransaction] = useState({
    portfolio_item: 0,
    type: "",
    trade_date: "",
    shares: 0,
    cost: 0,
    notes: "",
  });

  const [editTransaction, setEditTransaction] = useState(null);

  useEffect(() => {
    dispatch(getPortfolio(portfolioId));
  }, [dispatch, portfolioId]);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const handleTransactionOpen = (itemId) => {
    setNewTransaction((prev) => ({ ...prev, portfolio_item: itemId }));
    setOpenTransactionModal(true);
    dispatch(getPortfolioItemTransaction(itemId));
  };
  const handleTransactionClose = () => setOpenTransactionModal(false);

  const handleExpandClick = (itemId) => {
    setExpandedRow(expandedRow === itemId ? null : itemId);
    if (expandedRow !== itemId) {
      dispatch(getPortfolioItemTransaction(itemId));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewAsset((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransactionChange = (event) => {
    const { name, value } = event.target;
    setNewTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSymbolChange = (event) => {
    const value = event.target.value;
    if (value === "custom") {
      setIsCustomSymbol(true);
      setNewAsset((prev) => ({ ...prev, symbol: "" }));
    } else {
      setIsCustomSymbol(false);
      setNewAsset((prev) => ({ ...prev, symbol: value }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newAsset.symbol) {
      dispatch(createPortfolioItem(newAsset)).then((action) => {
        if (action.meta.requestStatus === "fulfilled") {
          handleClose();
          dispatch(getPortfolio(portfolioId));
        } else {
          alert(
            <FormattedMessage
              id="alert.add.asset"
              defaultMessage="Failed to add the asset. Please try again."
            />,
          );
        }
      });
    } else {
      alert(
        <FormattedMessage
          id="alert.valid.symbol"
          defaultMessage="Please provide a valid symbol for the asset."
        />,
      );
    }
  };

  const handleTransactionSubmit = (event) => {
    event.preventDefault();
    const actionToDispatch = editTransaction
      ? putTransaction({ id: editTransaction.id, ...newTransaction })
      : createTransaction(newTransaction);

    dispatch(actionToDispatch).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        handleTransactionClose();
        dispatch(getPortfolioItemTransaction(newTransaction.portfolio_item));
        setEditTransaction(null);
      } else {
        alert(
          <FormattedMessage
            id="alert.transaction.error"
            defaultMessage="An error occurred while adding the transaction. Please try again."
          />,
        );
      }
    });
  };

  const handleDelete = (itemId) => {
    setIsLoading(true);
    dispatch(deletePortfolioItem(itemId))
      .then((action) => {
        if (action.meta.requestStatus === "fulfilled") {
          dispatch(getPortfolio(portfolioId)).then(() => {
            setIsLoading(false);
          });
        } else if (action.meta.requestStatus === "rejected") {
          alert(
            action.error.message || (
              <FormattedMessage
                id="alert.delete.item"
                defaultMessage="Failed to delete the item. Please try again."
              />
            ),
          );
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Deletion error:", error);
        alert(
          <FormattedMessage
            id="alert.delete.error"
            defaultMessage="An error occurred. Please try again."
          />,
        );
        setIsLoading(false);
      });
  };

  const handleDeleteTransaction = (itemId, transactionId) => {
    dispatch(deleteTransaction({ itemId, transactionId }))
      .then((action) => {
        if (action.meta.requestStatus === "fulfilled") {
          dispatch(getPortfolioItemTransaction(itemId));
        } else {
          alert(
            <FormattedMessage
              id="alert.delete.transaction"
              defaultMessage="Failed to delete the transaction. Please try again."
            />,
          );
        }
      })
      .catch((error) => {
        console.error("Transaction deletion error:", error);
        alert(
          <FormattedMessage
            id="alert.transaction.delete.error"
            defaultMessage="An error occurred while deleting the transaction. Please try again."
          />,
        );
      });
  };

  const handleEditTransaction = (transaction) => {
    setEditTransaction(transaction);
    setNewTransaction({
      portfolio_item: transaction.portfolio_item,
      type: transaction.type,
      trade_date: transaction.trade_date,
      shares: transaction.shares,
      cost: transaction.cost,
      notes: transaction.notes,
    });
    setOpenTransactionModal(true);
  };

  const getStatusChip = (transactions) => {
    return transactions && transactions.length > 0 ? (
      <Chip
        label={<FormattedMessage id="status.open" defaultMessage="Open" />}
        color="success"
        variant="outlined"
      />
    ) : (
      <Chip
        label={<FormattedMessage id="status.closed" defaultMessage="Closed" />}
        color="error"
        variant="outlined"
      />
    );
  };

  return (
    <Paper sx={{ p: 2, margin: "auto", flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        <FormattedMessage
          id="portfolio.details"
          defaultMessage="Portfolio Details"
        />
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="table.ticker" defaultMessage="Ticker" />
              </TableCell>
              <TableCell align="right">
                <FormattedMessage
                  id="table.quantity"
                  defaultMessage="Quantity Owned"
                />
              </TableCell>
              <TableCell align="right">
                <FormattedMessage
                  id="table.last.price"
                  defaultMessage="Last Price"
                />
              </TableCell>
              <TableCell align="right">
                <FormattedMessage
                  id="table.avg.buy.price"
                  defaultMessage="Avg Buy Price"
                />
              </TableCell>
              <TableCell align="right">
                <FormattedMessage
                  id="table.unrealized.gain"
                  defaultMessage="Unrealized Gain"
                />
              </TableCell>
              <TableCell align="right">
                <FormattedMessage
                  id="table.realized.gain"
                  defaultMessage="Realized Gain"
                />
              </TableCell>
              <TableCell align="right">
                <FormattedMessage id="table.status" defaultMessage="Status" />
              </TableCell>
              <TableCell align="right">
                <FormattedMessage id="table.actions" defaultMessage="Actions" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {portfolioItems && portfolioItems.length > 0 ? (
              portfolioItems.map((asset) => (
                <React.Fragment key={asset.id}>
                  <TableRow key={asset.id}>
                    <TableCell component="th" scope="row">
                      {asset.symbol}
                    </TableCell>
                    <TableCell align="right">
                      {(asset.quantity_owned || 0).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {(asset.last_price || 0).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {(asset.avg_buy_price || 0).toFixed(2)}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        fontWeight: "bold",
                        color: asset.ur_gain >= 0 ? "green" : "red",
                      }}
                    >
                      {(asset.ur_gain || 0).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {(asset.r_gain || 0).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {getStatusChip(portfolioTransactions[asset.id])}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleExpandClick(asset.id)}
                      >
                        {expandedRow === asset.id ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(asset.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={8}
                    >
                      <Collapse
                        in={expandedRow === asset.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          <Typography variant="h6" gutterBottom component="div">
                            <FormattedMessage
                              id="transactions"
                              defaultMessage="Transactions"
                            />
                          </Typography>
                          <Table size="small" aria-label="transactions">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <FormattedMessage
                                    id="transaction.type"
                                    defaultMessage="Type"
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormattedMessage
                                    id="transaction.date"
                                    defaultMessage="Trade Date"
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormattedMessage
                                    id="transaction.shares"
                                    defaultMessage="Shares"
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormattedMessage
                                    id="transaction.cost"
                                    defaultMessage="Cost"
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormattedMessage
                                    id="transaction.notes"
                                    defaultMessage="Notes"
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormattedMessage
                                    id="transaction.actions"
                                    defaultMessage="Actions"
                                  />
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {portfolioTransactions &&
                              portfolioTransactions[asset.id] &&
                              portfolioTransactions[asset.id].length > 0 ? (
                                portfolioTransactions[asset.id].map(
                                  (transaction) => (
                                    <TableRow key={transaction.id}>
                                      <TableCell>{transaction.type}</TableCell>
                                      <TableCell>
                                        {transaction.trade_date}
                                      </TableCell>
                                      <TableCell>
                                        {transaction.shares}
                                      </TableCell>
                                      <TableCell>{transaction.cost}</TableCell>
                                      <TableCell>{transaction.notes}</TableCell>
                                      <TableCell>
                                        <IconButton
                                          aria-label="edit"
                                          onClick={() =>
                                            handleEditTransaction(transaction)
                                          }
                                        >
                                          <EditIcon />
                                        </IconButton>
                                        <IconButton
                                          aria-label="delete"
                                          onClick={() =>
                                            handleDeleteTransaction(
                                              asset.id,
                                              transaction.id,
                                            )
                                          }
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  ),
                                )
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={6} align="center">
                                    <FormattedMessage
                                      id="no.transactions"
                                      defaultMessage="No transactions available."
                                    />
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                          <Button
                            startIcon={
                              <PlusIcon fontSize="var(--icon-fontSize-md)" />
                            }
                            variant="contained"
                            size="small"
                            sx={{
                              bgcolor: "black",
                              color: "white",
                              margin: "12px",
                            }}
                            onClick={() => handleTransactionOpen(asset.id)}
                          >
                            <FormattedMessage
                              id="add.transaction"
                              defaultMessage="Add Transaction"
                            />
                          </Button>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <FormattedMessage
                    id="no.data"
                    defaultMessage="No data available - Start adding assets to your portfolio!"
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
        variant="contained"
        size="small"
        sx={{ bgcolor: "black", color: "white", margin: "12px" }}
        onClick={handleOpen}
      >
        <FormattedMessage id="add.asset" defaultMessage="Add Asset" />
      </Button>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <FormattedMessage
              id="add.new.asset"
              defaultMessage="Add New Asset"
            />
          </Typography>
          <Box
            component="form"
            sx={{ mt: 2 }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="symbol-label">
                <FormattedMessage id="symbol" defaultMessage="Symbol" />
              </InputLabel>
              <Select
                labelId="symbol-label"
                name="symbol"
                value={isCustomSymbol ? "custom" : newAsset.symbol}
                onChange={handleSymbolChange}
                label={<FormattedMessage id="symbol" defaultMessage="Symbol" />}
              >
                <MenuItem value="AAPL">AAPL</MenuItem>
                <MenuItem value="GOOGL">GOOGL</MenuItem>
                <MenuItem value="MSFT">MSFT</MenuItem>
                <MenuItem value="custom">
                  <FormattedMessage id="symbol.custom" defaultMessage="Other" />
                </MenuItem>
              </Select>
            </FormControl>
            {isCustomSymbol && (
              <TextField
                fullWidth
                label={
                  <FormattedMessage
                    id="custom.symbol"
                    defaultMessage="Custom Symbol"
                  />
                }
                name="symbol"
                value={newAsset.symbol}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            )}
            <TextField
              fullWidth
              label={
                <FormattedMessage
                  id="quantity.owned"
                  defaultMessage="Quantity Owned"
                />
              }
              type="number"
              name="quantity_owned"
              value={newAsset.quantity_owned}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={
                <FormattedMessage id="last.price" defaultMessage="Last Price" />
              }
              type="number"
              name="last_price"
              value={newAsset.last_price}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={
                <FormattedMessage
                  id="avg.buy.price"
                  defaultMessage="Avg Buy Price"
                />
              }
              type="number"
              name="avg_buy_price"
              value={newAsset.avg_buy_price}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained">
              <FormattedMessage id="add" defaultMessage="Add" />
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openTransactionModal}
        onClose={handleTransactionClose}
        aria-labelledby="transaction-modal-title"
        aria-describedby="transaction-modal-description"
      >
        <Box sx={style}>
          <Typography id="transaction-modal-title" variant="h6" component="h2">
            <FormattedMessage
              id="add.new.transaction"
              defaultMessage="Add New Transaction"
            />
          </Typography>
          <Box
            component="form"
            sx={{ mt: 2 }}
            noValidate
            autoComplete="off"
            onSubmit={handleTransactionSubmit}
          >
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="type-label">
                <FormattedMessage id="transaction.type" defaultMessage="Type" />
              </InputLabel>
              <Select
                labelId="type-label"
                name="type"
                value={newTransaction.type}
                onChange={handleTransactionChange}
                label={
                  <FormattedMessage
                    id="transaction.type"
                    defaultMessage="Type"
                  />
                }
              >
                <MenuItem value="buy">
                  <FormattedMessage
                    id="transaction.type.buy"
                    defaultMessage="Buy"
                  />
                </MenuItem>
                <MenuItem value="sell">
                  <FormattedMessage
                    id="transaction.type.sell"
                    defaultMessage="Sell"
                  />
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label={
                <FormattedMessage
                  id="transaction.date"
                  defaultMessage="Trade Date"
                />
              }
              type="date"
              name="trade_date"
              value={newTransaction.trade_date}
              onChange={handleTransactionChange}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={
                <FormattedMessage
                  id="transaction.shares"
                  defaultMessage="Shares"
                />
              }
              type="number"
              name="shares"
              value={newTransaction.shares}
              onChange={handleTransactionChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={
                <FormattedMessage id="transaction.cost" defaultMessage="Cost" />
              }
              type="number"
              name="cost"
              value={newTransaction.cost}
              onChange={handleTransactionChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={
                <FormattedMessage
                  id="transaction.notes"
                  defaultMessage="Notes"
                />
              }
              name="notes"
              value={newTransaction.notes}
              onChange={handleTransactionChange}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained">
              <FormattedMessage id="add" defaultMessage="Add" />
            </Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
};

export default PortfolioDetailPage;
