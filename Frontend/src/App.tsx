import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Button from "./components/Button";
import Meeting from "./components/Meeting";
import RoomProvider from "./context/RoomContext";

function App() {
  return (
    <BrowserRouter>
      <RoomProvider>
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route
              index
              element={
                <div className="flex justify-center items-center w-screen h-screen">
                  <Button />
                </div>
              }
            />
            <Route path="room/:roomId" element={<Meeting />} />
          </Route>
        </Routes>
      </RoomProvider>
    </BrowserRouter>
  );
}

export default App;
