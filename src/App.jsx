import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Urunler from "./pages/Urunler";
import Kategoriler from "./pages/Kategoriler";
import Satis from "./pages/Satis";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <nav style={{ padding: "10px", background: "#333", display: "flex", gap: "15px" }}>
                <Link to="/" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
                <Link to="/urunler" style={{ color: "white", textDecoration: "none" }}>Ürünler</Link>
                <Link to="/kategoriler" style={{ color: "white", textDecoration: "none" }}>Kategoriler</Link>
                <Link to="/satis" style={{ color: "white", textDecoration: "none" }}>Satış</Link>
            </nav>
           <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/urunler" element={<Urunler />} />
                    <Route path="/kategoriler" element={<Kategoriler />} />
                    <Route path="/satis" element={<Satis />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;