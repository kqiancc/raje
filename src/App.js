import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/home.component";
import Navigation from "./routes/navigation.component";
import SignIn from "./routes/sign-in.component";
import DisplayEpisodes from "./routes/display-episodes.component";
import Recents from "./routes/recents.component";
import Favorites from "./routes/favorites.component";
import DisplaySeasons from "./routes/display-seasons.component";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="recents" element={<Recents />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="display-episodes" element={<DisplayEpisodes />} />
        <Route path="display-seasons" element={<DisplaySeasons />} />
        <Route path="favorites" element={<Favorites />} />
      </Route>
    </Routes>
  );
};

export default App;