import { AppBar, Toolbar, Typography } from "@mui/material"
import IconButton from '@mui/material/IconButton';

const Header = () => {

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
                    {/* <ShoppingCartIcon sx={{ color: "white" }} /> */}
                    {/* <Badge badgeContent={cart.length} overlap="circular" color="secondary" sx={{ top: -8 }} /> */}

                </IconButton>
            </Toolbar>
        </AppBar>
        {/* Provides the proper spacing for the page content to not overlap with the App bar */}
        <Toolbar />
    </>
}

export default Header