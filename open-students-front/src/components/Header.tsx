import { IntlShape, useIntl } from "react-intl";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { COLORS } from "../styles/colors";
import SearchBar from "./searchBar/SearchBar";
import { SearchResultsList } from "./searchBar/SearchResultsList";
import { useState } from "react";
import { Menu, MenuItem, Typography } from "@mui/material";
import "../styles/Header.css";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { currentProfessorIdState } from "../atoms/defaultAtoms";
import { AUTH_ROUTE, HOME_ROUTE, PROFILE_ROUTE } from "../utils/consts";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../App";

export default function Header({ session }: { session: Session | null }) {
  const intl = useIntl();
  const navigate = useNavigate();
  const setCurrentProfessorId = useSetRecoilState(currentProfessorIdState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const textConstants = {
    login: intl.formatMessage({ id: "headerLogin" }),
    openStudents: intl.formatMessage({ id: "openStudents" }),
    account: intl.formatMessage({ id: "headerAccount" }),
  };

  // TODO: Lógica de login y usuarios
  const text = session ? textConstants.account : textConstants.login;
  const [results, setResults] = useState<{ name: string; id: string }[]>([]);
  const [showResults, setShowResults] = useState(false);

  return (
    <Box className="header">
      <AppBar position="static" sx={{ backgroundColor: "white" }}>
        <Toolbar className="first-row">
          <LogoOpenStudents
            openStudentsText={textConstants.openStudents}
            navigate={navigate}
          />
          {session && (
            <Box className="search-bar-container">
              <SearchBar
                results={results}
                setResults={setResults}
                setShowResults={setShowResults}
              />
              {showResults && (
                <SearchResultsList
                  results={results}
                  setCurrentProfessorId={setCurrentProfessorId}
                  setShowResults={setShowResults}
                />
              )}
            </Box>
          )}
          <LoginButton
            text={text}
            navigate={navigate}
            session={session}
            anchorEl={anchorEl}
            handleMenu={handleMenu}
            handleClose={handleClose}
            intl={intl}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

const LogoOpenStudents = ({
  openStudentsText,
  navigate,
}: {
  openStudentsText: string;
  navigate: NavigateFunction;
}) => (
  <Toolbar>
    <Typography
      variant="h5"
      style={{ color: COLORS.primary, fontWeight: "bold" }}
      onClick={() => navigate("/")}
    >
      {openStudentsText}
    </Typography>
  </Toolbar>
);

const LoginButton = ({
  text,
  navigate,
  session,
  anchorEl,
  handleMenu,
  handleClose,
  intl,
}: {
  text: string | undefined;
  navigate: NavigateFunction;
  session: Session | null;
  anchorEl: HTMLElement | null;
  handleMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleClose: () => void;
  intl: IntlShape;
}) => (
  <>
    <Button
      style={{
        borderRadius: 20,
        padding: "5px 15px",
        backgroundColor: COLORS.primary,
        fontSize: "15px",
        textTransform: "none",
      }}
      variant="contained"
      onClick={(e) => {
        if (session && session.user) {
          handleMenu(e);
          // Show list of options with logout and profile
        } else {
          navigate(AUTH_ROUTE);
        }
      }}
    >
      {text}
    </Button>
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem
        onClick={() => {
          navigate(PROFILE_ROUTE);
          handleClose();
        }}
      >
        {intl.formatMessage({ id: "headerProfile" })}
      </MenuItem>
      <MenuItem
        onClick={() => {
          supabase.auth.signOut();
          handleClose();
          navigate(HOME_ROUTE);
        }}
      >
        {intl.formatMessage({ id: "headerLogout" })}
      </MenuItem>
    </Menu>
  </>
);
