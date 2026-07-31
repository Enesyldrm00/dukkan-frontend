import { useState, useEffect } from "react";
import api from "../services/api";

function Dashboard() {
    const [veriler, setVeriler] = useState(null);
    const [kritikUrunler, setKritikUrunler] = useState([]);
    const [enCokSatan, setEnCokSatan] = useState([]);

    useEffect(() => {
        api.get("/dashboard").then((res) => setVeriler(res.data));
        api.get("/products/low-stock").then((res) => setKritikUrunler(res.data));
        api.get("/dashboard/en-cok-satan").then((res) => setEnCokSatan(res.data));
    }, []);

    if (!veriler) return <p>Yükleniyor...</p>;

    return (
        <div>
            <h1>Dashboard</h1>
            <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
                <div style={{ padding: "20px", background: "#4CAF50", color: "white", borderRadius: "8px", minWidth: "200px", textAlign: "center" }}>
                    <h2>{veriler.toplamUrun}</h2>
                    <p>Toplam Ürün</p>
                </div>
                <div style={{ padding: "20px", background: "#2196F3", color: "white", borderRadius: "8px", minWidth: "200px", textAlign: "center" }}>
                    <h2>{veriler.toplamSatis}</h2>
                    <p>Toplam Satış</p>
                </div>
                <div style={{ padding: "20px", background: veriler.kritikStok > 0 ? "#f44336" : "#4CAF50", color: "white", borderRadius: "8px", minWidth: "200px", textAlign: "center" }}>
                    <h2>{veriler.kritikStok}</h2>
                    <p>Kritik Stok</p>
                </div>
            </div>

            <div style={{ display: "flex", gap: "40px" }}>
                {enCokSatan.length > 0 && (
                    <div>
                        <h2>En Çok Satan Ürünler</h2>
                        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th>Ürün Adı</th>
                                    <th>Toplam Satış Adedi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enCokSatan.map((u, i) => (
                                    <tr key={i}>
                                        <td>{u.urunAdi}</td>
                                        <td>{u.toplamAdet}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {kritikUrunler.length > 0 && (
                    <div>
                        <h2>Kritik Stoktaki Ürünler</h2>
                        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th>Ürün Adı</th>
                                    <th>Stok</th>
                                    <th>Kritik Seviye</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kritikUrunler.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.urunAdi}</td>
                                        <td style={{ color: "red" }}>{u.stokMiktari}</td>
                                        <td>{u.kritikStokSeviyesi}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;