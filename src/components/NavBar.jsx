import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
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
  const { user, isAdmin, signout } = useAuth();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchClick = function () {
    navigate(`/books?bookTitle=${searchQuery}`);
    setSearchQuery("");
    document.getElementById("navbarSearch").blur();
  };

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuIsOpen = Boolean(anchorEl);

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
        <Drawer
          anchor="right"
          open={drawerIsOpen}
          onClose={() => setDrawerIsOpen(false)}
        >
          <List>
            <CustomListItem
              to="/books?bookType=Paper book"
              icon={<Book />}
              text="Paper books"
              onClick={() => setDrawerIsOpen(false)}
            />
            <CustomListItem
              to="/books?bookType=Ebook"
              icon={<BookOnline />}
              text="Ebooks"
              onClick={() => setDrawerIsOpen(false)}
            />
            <CustomListItem
              to="/books?bookType=Audiobook"
              icon={<Headphones />}
              text="Audiobooks"
              onClick={() => setDrawerIsOpen(false)}
            />
            <CustomListItem
              to="/subscriptions"
              icon={<Subscriptions />}
              text="Subscriptions"
              onClick={() => setDrawerIsOpen(false)}
            />
            <Divider sx={{ borderBottomWidth: 3 }} />
            {user ? (
              <UserListItems
                isAdmin={isAdmin}
                setIsOpen={setDrawerIsOpen}
                signout={signout}
              />
            ) : (
              <GuestListItems setIsOpen={setDrawerIsOpen} />
            )}
          </List>
        </Drawer>

        <div className="flex w-full flex-row items-center justify-between gap-4 text-white">
          <Link to="/" className="text-2xl font-semibold sm:text-3xl">
            Bookstore
          </Link>
          <div className="relative w-2/5 text-black">
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

          <div
            onClick={() => setDrawerIsOpen(true)}
            className="block sm:hidden"
          >
            <MenuIcon fontSize="large" />
          </div>
          <div className="hidden items-center justify-between gap-2 sm:flex">
            <Link to="/profile/cart">
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
              open={menuIsOpen}
              onClick={handleClose}
              onClose={handleClose}
            >
              {user
                ? isAdmin
                  ? [
                      adminMenuItemList,
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
                      ...userMenuItemList,
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
          <Link to="/subscriptions">Subscription</Link>
        </div>
      </div>
    </nav>
  );
}

function CustomListItem({ to, icon, text, onClick }) {
  return (
    <ListItem disablePadding>
      <ListItemButton component={Link} to={to} onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText className="pr-4" primary={text} />
      </ListItemButton>
    </ListItem>
  );
}

const userMenuItemList = [
  <MenuItem component={Link} to="/profile" key="profile">
    Profile
  </MenuItem>,
  <MenuItem component={Link} to="/profile/library" key="library">
    Library
  </MenuItem>,
  <MenuItem component={Link} to={`/profile/orders`} key="orders">
    Order history
  </MenuItem>,
  <Divider key="divider" />,
];
const adminMenuItemList = [
  <MenuItem component={Link} to="/profile" key="profile">
    Profile
  </MenuItem>,
  <MenuItem component={Link} to="/profile/library" key="library">
    Library
  </MenuItem>,
  <MenuItem component={Link} to="/admin/reviews" key="reviews">
    Review history
  </MenuItem>,
  <MenuItem component={Link} to="/admin/orders" key="orders">
    Order history
  </MenuItem>,
  <Divider key="divider" />,
];

function UserListItems({ isAdmin, setIsOpen, signout }) {
  return (
    <>
      <CustomListItem
        to="/profile"
        icon={<PersonIcon />}
        text="Profile"
        onClick={() => setIsOpen(false)}
      />
      <CustomListItem
        to="/profile/cart"
        icon={<ShoppingCartIcon />}
        text="Cart"
        onClick={() => setIsOpen(false)}
      />
      <CustomListItem
        to="/profile/wishlist"
        icon={<FavoriteIcon />}
        text="Wishlist"
        onClick={() => setIsOpen(false)}
      />
      <CustomListItem
        to="/profile/library"
        icon={<MenuBook />}
        text="Library"
        onClick={() => setIsOpen(false)}
      />
      {isAdmin && (
        <CustomListItem
          to="/admin/reviews"
          icon={<WorkspacePremium />}
          text="Review history"
          onClick={() => setIsOpen(false)}
        />
      )}
      <CustomListItem
        to={isAdmin ? "/admin/orders" : "/profile/orders"}
        icon={<ReceiptLong />}
        text="Order history"
        onClick={() => setIsOpen(false)}
      />
      <CustomListItem
        onClick={() => {
          setIsOpen(false);
          signout();
        }}
        icon={<ExitToApp />}
        text="Sign out"
      />
    </>
  );
}

function GuestListItems({ setIsOpen }) {
  return (
    <>
      <CustomListItem
        to="/signin"
        icon={<Login />}
        text="Sign in"
        onClick={() => setIsOpen(false)}
      />
      <CustomListItem
        to="/signup"
        icon={<Create />}
        text="Sign up"
        onClick={() => setIsOpen(false)}
      />
    </>
  );
}

export default NavBar;
