import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Grid,
  Modal,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  AddCircleOutline as AddIcon,
  DeleteOutline as DeleteIcon,
  BusinessCenter as PortfolioIcon,
} from "@mui/icons-material";
import { Plus as PlusIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import {
  getAllPortfolios,
  createPortfolio,
  deletePortfolio,
  getPortfolio,
} from "@/actions/portfolioActions";
import errorImage from "@/assets/images/portfolio_not_found.png";

const PortfolioPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const portfolios = useSelector((state) => state.portfolio.portfolios);
  const portfolioStatus = useSelector((state) => state.portfolio.status);
  const portfolioError = useSelector((state) => state.portfolio.error);
  const isAuthenticated = useSelector(
    (state) => state.portfolio.isAuthenticated,
  );

  const [loading, setLoading] = useState(true);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [isCreatePortfolioModalOpen, setIsCreatePortfolioModalOpen] =
    useState(false);

  useEffect(() => {
    if (portfolioStatus === "idle") {
      dispatch(getAllPortfolios())
        .then(() => setLoading(false)) // Set loading to false when data is fetched
        .catch(() => setLoading(false)); // Also set loading to false on error
    } else {
      setLoading(false); // Set loading to false if status is not idle
    }
  }, [portfolioStatus, dispatch]);

  const openCreatePortfolioModal = () => {
    setIsCreatePortfolioModalOpen(true);
  };

  const closeCreatePortfolioModal = () => {
    setIsCreatePortfolioModalOpen(false);
  };

  const handleCreatePortfolio = () => {
    if (newPortfolioName.trim() !== "") {
      const newPortfolio = {
        name: newPortfolioName,
        cost_basis: 0,
        market_value: 0,
        day_change: 0,
      };
      dispatch(createPortfolio(newPortfolio));
      setNewPortfolioName("");
      closeCreatePortfolioModal();
    } else {
      alert(
        <FormattedMessage
          id="alert.enter.name"
          defaultMessage="Please enter a name for the portfolio."
        />,
      );
    }
  };

  const handleRemovePortfolio = (id) => {
    dispatch(deletePortfolio(id));
  };

  const handleNavigateToDetail = (id) => {
    dispatch(getPortfolio(id)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        console.log(action.payload.portfolio_items);
        console.log("we are here");
        navigate(`/my-portfolio/detail/${id}`);
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4, padding: 2 }}>
        <div
          className="container"
          style={{ position: "relative", maxWidth: "500px", margin: "auto" }}
        >
          <img
            src={errorImage}
            alt="Unauthorized"
            className="img-fluid"
            style={{
              width: "100%",
              height: "auto",
              maskImage:
                "linear-gradient(to bottom, transparent, black, black, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black, black, transparent)",
            }}
          />
        </div>
        <Typography variant="h5" sx={{ marginTop: 2 }}>
          <FormattedMessage
            id="login.message"
            defaultMessage="Login to see your portfolios"
          />
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          <FormattedMessage
            id="login.explanation"
            defaultMessage="By logging in, you will be able to create and manage your portfolios, track your investments and performance. Don't miss out on the full features of our platform!"
          />
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          onClick={() => navigate("/sign-in")}
        >
          <FormattedMessage id="login.button" defaultMessage="Login Now" />
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Box sx={{ textAlign: "center" }}>
      <Modal
        open={isCreatePortfolioModalOpen}
        onClose={closeCreatePortfolioModal}
        aria-labelledby="create-portfolio-modal-title"
        aria-describedby="create-portfolio-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 10,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="create-portfolio-modal-title"
            variant="h6"
            component="h2"
          >
            <FormattedMessage
              id="create.portfolio.title"
              defaultMessage="Create New Portfolio"
            />
          </Typography>
          <TextField
            label={
              <FormattedMessage
                id="portfolio.name.label"
                defaultMessage="Portfolio Name"
              />
            }
            value={newPortfolioName}
            onChange={(e) => setNewPortfolioName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <Button variant="contained" onClick={handleCreatePortfolio}>
              <FormattedMessage
                id="create.button"
                defaultMessage="Create Portfolio"
              />
            </Button>
          </Box>
        </Box>
      </Modal>

      <Box mt={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography variant="h4">
            <PortfolioIcon
              sx={{ verticalAlign: "bottom", mr: 2, pr: 0.2, fontSize: "3rem" }}
            />
            <FormattedMessage
              id="your.portfolios.title"
              defaultMessage="Your Portfolios"
            />
          </Typography>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            size="small"
            onClick={openCreatePortfolioModal}
          >
            <FormattedMessage
              id="create.new.portfolio.button"
              defaultMessage="Create New Portfolio"
            />
          </Button>
        </Grid>
        <List>
          {portfolios.map((portfolio, index) => (
            <Paper
              key={portfolio.id}
              elevation={3}
              sx={{
                my: 2,
                p: 2,
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: `0 4px 8px ${
                  portfolio.day_change &&
                  portfolio.day_change.toString().includes("-")
                    ? "rgba(255, 0, 0, 0.3)"
                    : "rgba(0, 128, 0, 0.3)"
                }`, // Colored shadow based on day change
                transition: "box-shadow 0.3s ease-in-out",
              }}
            >
              <ListItem key={index}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid
                    item
                    xs={8}
                    onClick={() => handleNavigateToDetail(portfolio.id)}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="h6"
                          style={{ fontSize: "1.25rem", fontWeight: "bold" }}
                        >
                          {portfolio.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          style={{
                            color: "#666",
                            fontStyle: "italic",
                            fontSize: "0.9rem",
                          }}
                        >
                          {portfolio.description || (
                            <FormattedMessage
                              id="no.description"
                              defaultMessage="No description available"
                            />
                          )}
                        </Typography>
                      }
                    />
                  </Grid>
                  <Grid item>
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemovePortfolio(portfolio.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <ListItemText
                      primary={
                        <FormattedMessage
                          id="cost_basis.label"
                          defaultMessage="Cost Basis"
                        />
                      }
                      secondary={
                        portfolio.cost_basis !== null ? (
                          portfolio.cost_basis.toFixed(2)
                        ) : (
                          <FormattedMessage
                            id="not.available"
                            defaultMessage="N/A"
                          />
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ListItemText
                      primary={
                        <FormattedMessage
                          id="market_value.label"
                          defaultMessage="Market Value"
                        />
                      }
                      secondary={
                        portfolio.market_value !== null ? (
                          portfolio.market_value.toFixed(2)
                        ) : (
                          <FormattedMessage
                            id="not.available"
                            defaultMessage="N/A"
                          />
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ListItemText
                      primary={
                        <FormattedMessage
                          id="day_change.label"
                          defaultMessage="Day Change"
                        />
                      }
                      secondary={
                        portfolio.day_change !== null ? (
                          portfolio.day_change.toFixed(2)
                        ) : (
                          <FormattedMessage
                            id="not.available"
                            defaultMessage="N/A"
                          />
                        )
                      }
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />
            </Paper>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default PortfolioPage;
