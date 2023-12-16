import "./styles/index.css";

import {QueryClient, QueryClientProvider} from "react-query";
import {useRef} from "react";
import {withAuth} from "libs/HOC";
import LayoutRoot from "layout";
import Navigation from "routes/Navigation";

const App = () => {
  const queryClientRef = useRef<QueryClient | null>(null);

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {refetchOnWindowFocus: false},
      },
    });
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <LayoutRoot>
        <Navigation />
      </LayoutRoot>
    </QueryClientProvider>
  );
};

export default withAuth(App);
