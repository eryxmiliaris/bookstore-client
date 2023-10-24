import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import MenuBook from "@mui/icons-material/MenuBook";
import {
  Book,
  BookOnline,
  Create,
  ExitToApp,
  Headphones,
  Login,
  ReceiptLong,
  Subscriptions,
  WorkspacePremium,
} from "@mui/icons-material";

function NavBar() {
  const { user, signout } = useAuth();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchClick = function () {
    navigate(`/books?bookTitle=${searchQuery}`);
    setSearchQuery("");
    document.getElementById("navbarSearch").blur();
  };

  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleProfileIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSearchClear = () => {
    setSearchQuery("");
  };

  return (
    <nav className="bg-violet-500 px-4 py-4">
      <div className="container mx-auto flex flex-col items-center justify-between space-y-4 md:px-8 lg:max-w-5xl lg:px-4">
        <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/books?bookType=Paper book"
                onClick={() => setIsOpen(false)}
              >
                <ListItemIcon>
                  <Book />
                </ListItemIcon>
                <ListItemText className="pr-4" primary="Paper books" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/books?bookType=Ebook"
                onClick={() => setIsOpen(false)}
              >
                <ListItemIcon>
                  <BookOnline />
                </ListItemIcon>
                <ListItemText className="pr-4" primary="Ebooks" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/books?bookType=Audiobook"
                onClick={() => setIsOpen(false)}
              >
                <ListItemIcon>
                  <Headphones />
                </ListItemIcon>
                <ListItemText className="pr-4" primary="Audiobooks" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/"
                onClick={() => setIsOpen(false)}
              >
                <ListItemIcon>
                  <Subscriptions />
                </ListItemIcon>
                <ListItemText className="pr-4" primary="Subscriptions" />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ borderBottomWidth: 3 }} />
            {user ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                  >
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText className="pr-4" primary="Profile" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/"
                    onClick={() => setIsOpen(false)}
                  >
                    <ListItemIcon>
                      <ShoppingCartIcon />
                    </ListItemIcon>
                    <ListItemText className="pr-4" primary="Cart" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/profile/wishlist"
                    onClick={() => setIsOpen(false)}
                  >
                    <ListItemIcon>
                      <FavoriteIcon />
                    </ListItemIcon>
                    <ListItemText className="pr-4" primary="Wishlist" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/"
                    onClick={() => setIsOpen(false)}
                  >
                    <ListItemIcon>
                      <MenuBook />
                    </ListItemIcon>
                    <ListItemText className="pr-4" primary="Library" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/"
                    onClick={() => setIsOpen(false)}
                  >
                    <ListItemIcon>
                      <WorkspacePremium />
                    </ListItemIcon>
                    <ListItemText className="pr-4" primary="My subscriptions" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/"
                    onClick={() => setIsOpen(false)}
                  >
                    <ListItemIcon>
                      <ReceiptLong />
                    </ListItemIcon>
                    <ListItemText className="pr-4" primary="Order history" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setIsOpen(false);
                      signout();
                    }}
                  >
                    <ListItemIcon>
                      <ExitToApp />
                    </ListItemIcon>
                    <ListItemText className="pr-4" primary="Sign out" />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/signin"
                    onClick={() => setIsOpen(false)}
                  >
                    <ListItemIcon>
                      <Login />
                    </ListItemIcon>
                    <ListItemText className="pr-4" primary="Sign in" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                  >
                    <ListItemIcon>
                      <Create />
                    </ListItemIcon>
                    <ListItemText className="pr-4" primary="Sign up" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Drawer>
        <div className="flex w-full flex-row items-center justify-between gap-4 text-white">
          <Link to="/" className="text-2xl font-semibold sm:text-3xl">
            Bookstore
          </Link>
          <div className="relative w-2/5 text-black sm:block">
            <input
              type="text"
              id="navbarSearch"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchClick();
              }}
              placeholder="Search..."
              className="w-full rounded border p-2 focus:border-blue-300 focus:outline-none focus:ring"
            />
            {searchQuery && (
              <span
                className="absolute inset-y-0 right-10 flex cursor-pointer items-center pr-3"
                onClick={() => handleSearchClear()}
              >
                <ClearIcon />
              </span>
            )}
            <span
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
              onClick={handleSearchClick}
            >
              <SearchIcon />
            </span>
          </div>

          <div onClick={() => setIsOpen(true)} className="block sm:hidden">
            <MenuIcon fontSize="large" />
          </div>
          <div className="hidden items-center justify-between gap-2 sm:flex">
            <Link to="/">
              <ShoppingCartIcon fontSize="large" />
            </Link>
            <Link to="/profile/wishlist">
              <FavoriteIcon fontSize="large" />
            </Link>
            <button onClick={handleProfileIconClick}>
              <PersonIcon fontSize="large" />
            </button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              {user
                ? [
                    <MenuItem component={Link} to="/profile" key="profile">
                      Profile
                    </MenuItem>,
                    <MenuItem component={Link} to="/" key="library">
                      Library
                    </MenuItem>,
                    <MenuItem component={Link} to="/" key="subscription">
                      My subscriptions
                    </MenuItem>,
                    <MenuItem component={Link} to="/" key="orders">
                      Order history
                    </MenuItem>,
                    <Divider key="divider" />,
                    <MenuItem
                      key="signout"
                      onClick={() => {
                        handleClose();
                        signout();
                      }}
                    >
                      Sign out
                    </MenuItem>,
                  ]
                : [
                    <MenuItem
                      key="signin"
                      component={Link}
                      to="/signin"
                      onClick={handleClose}
                    >
                      Sign in
                    </MenuItem>,
                    <MenuItem
                      key="signup"
                      component={Link}
                      to="/signup"
                      onClick={handleClose}
                    >
                      Sign up
                    </MenuItem>,
                  ]}
            </Menu>
          </div>
        </div>
        <div className="hidden w-full items-center justify-evenly text-xl text-white sm:flex">
          <Link to="/books?bookType=Paper book">Paper books</Link>
          <Link to="/books?bookType=Ebook">Ebooks</Link>
          <Link to="/books?bookType=Audiobook">Audiobooks</Link>
          <p>Subscription</p>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

{
  /* <div>
<button onClick={() => setIsOpen((old) => !old)}>ok</button>
<Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
  <div className="w-20">
    <p>ok</p>
    <p>ok</p>
    <p>ok</p>
  </div>
</Drawer>
</div> */
}
