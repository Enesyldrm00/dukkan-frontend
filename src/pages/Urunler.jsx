import { useState, useEffect } from "react";
import api from "../services/api";

function Urunler() {
    const [urunler, setUrunler] = useState([]);

    useEffect(() => {
        api.get("/products").then((res) => {
            setUrunler(res.data);
        });
    }, []);

    return (
        <div>
            <h1>Ürünler</h1>
            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <th>Ürün Adı</th>
                        <th>Barkod</th>
                        <th>Kategori</th>
                        <th>Alış Fiyatı</th>
                        <th>Satış Fiyatı</th>
                        <th>Stok</th>
                        <th>Durum</th>
                    </tr>
                </thead>
                <tbody>
                    {urunler.map((urun) => (
                        <tr key={urun.id}>
                            <td>{urun.urunAdi}</td>
                            <td>{urun.barkod}</td>
                            <td>{urun.kategori ? urun.kategori.name : "-"}</td>
                            <td>{urun.alisFiyati}</td>
                            <td>{urun.satisFiyati}</td>
                            <td>{urun.stokMiktari}</td>
                            <td style={{ color: urun.stokMiktari <= urun.kritikStokSeviyesi ? "red" : "green" }}>
                                {urun.stokMiktari <= urun.kritikStokSeviyesi ? "Kritik Stok!" : "Normal"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Urunler;