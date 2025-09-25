import { AppBar, Toolbar, Typography, Badge } from "@mui/material"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import { useCartTotal } from "../context/cartTotal";

const Header = () => {
    const { cartTotal } = useCartTotal()

    return <>
        <AppBar position="fixed">
            <Toolbar>
                <Typography color="white" variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Santé Shopping
                </Typography>
                <IconButton
                    sx={{
                    }}
                >
                    <ShoppingCartIcon sx={{ color: "white" }} />
                    {/* <Badge badgeContent={cart.length} overlap="circular" color="secondary" sx={{ top: -8 }} /> */}

                </IconButton>
            </Toolbar>
        </AppBar>
        {/* Provides the proper spacing for the page content to not overlap with the App bar */}
        <Toolbar />
    </>
}

export default Header