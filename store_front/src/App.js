
import './css/App.css';
import { BrowserRouter, Routes, Route, } from "react-router-dom"; //, Link
import ProductAdd from "./pages/ProductAdd";
import ProductList from "./pages/ProductList";
import Footer from "./components/Footer";
function App() {
  return (
    <div className="App">
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
          <Route path="add" element={<ProductAdd />} />
          <Route path="*" element={<ProductList />} />
      </Routes>
      </BrowserRouter>
        <Footer />
    </div>
  );
}

export default App;
