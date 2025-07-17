import React from "react";
import Header from "./components/Header";
import Banner from "./components/Banner";
import IdeaList from "./components/IdeaList";
import bg from "./assets/bg.png";
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Banner
        title="Ideas"
        subtitle="Where all our great things begin"
        backgroundImage={bg}
      />
      <div className="bg-white">
        <IdeaList />
      </div>
    </div>
  );
};

export default App;
