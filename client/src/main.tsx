import ReactDOM from "react-dom/client";
import { BrowserRouter as RoutesProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./context/store.ts";

import App from "./App.tsx";
import "./index.css";

import AuthInitializer from "./context/AuthInitializer.tsx";

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <RoutesProvider>
        <Provider store={store}>
            <AuthInitializer />
            <QueryClientProvider client={client}>
                <App />
            </QueryClientProvider>
        </Provider>
    </RoutesProvider>
);
