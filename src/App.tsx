import { Box } from "@mui/system";
import Header from "./components/Header";
import Page from "./components/Page";
import StorePage from "./components/StorePage";
import { CartTotalProvider } from "./context/cartTotal";

function App() {
  return <CartTotalProvider>
    <Box>
      <Header />
      <Page>
        <StorePage />
      </Page>
    </Box>
  </CartTotalProvider>
}

export default App;
