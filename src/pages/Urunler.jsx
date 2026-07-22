import { useState, useEffect } from "react";
import api from "../services/api";

function Urunler() {
    const [urunler, setUrunler] = useState([]);
    const [kategoriler, setKategoriler] = useState([]);
    const [formAcik, setFormAcik] = useState(false);
    const [yeniUrun, setYeniUrun] = useState({
        urunAdi: "",
        barkod: "",
        kategori: null,
        alisFiyati: "",
        satisFiyati: "",
        stokMiktari: "",
        kritikStokSeviyesi: ""
    });

    useEffect(() => {
        verileriGetir();
    }, []);

    function verileriGetir() {
        api.get("/products").then((res) => setUrunler(res.data));
        api.get("/categories").then((res) => setKategoriler(res.data));
    }

    function handleChange(e) {
        setYeniUrun({ ...yeniUrun, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        const gonderilecek = {
            ...yeniUrun,
            kategori: yeniUrun.kategori ? { id: Number(yeniUrun.kategori) } : null
        };
        api.post("/products", gonderilecek).then(() => {
            verileriGetir();
            setFormAcik(false);
            setYeniUrun({ urunAdi: "", barkod: "", kategori: null, alisFiyati: "", satisFiyati: "", stokMiktari: "", kritikStokSeviyesi: "" });
        });
    }

    return (
        <div>
            <h1>Ürünler</h1>
            <button onClick={() => setFormAcik(!formAcik)} style={{ marginBottom: "10px", padding: "8px 16px" }}>
                {formAcik ? "Formu Kapat" : "Yeni Ürün Ekle"}
            </button>

            {formAcik && (
                <form onSubmit={handleSubmit} style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px", maxWidth: "400px" }}>
                    <input name="urunAdi" placeholder="Ürün Adı" value={yeniUrun.urunAdi} onChange={handleChange} required />
                    <input name="barkod" placeholder="Barkod" value={yeniUrun.barkod} onChange={handleChange} required />
                    <select name="kategori" value={yeniUrun.kategori || ""} onChange={handleChange}>
                        <option value="">Kategori Seçin</option>
                        {kategoriler.map((k) => (
                            <option key={k.id} value={k.id}>{k.name}</option>
                        ))}
                    </select>
                    <input name="alisFiyati" placeholder="Alış Fiyatı" type="number" value={yeniUrun.alisFiyati} onChange={handleChange} required />
                    <input name="satisFiyati" placeholder="Satış Fiyatı" type="number" value={yeniUrun.satisFiyati} onChange={handleChange} required />
                    <input name="stokMiktari" placeholder="Stok Miktarı" type="number" value={yeniUrun.stokMiktari} onChange={handleChange} required />
                    <input name="kritikStokSeviyesi" placeholder="Kritik Stok Seviyesi" type="number" value={yeniUrun.kritikStokSeviyesi} onChange={handleChange} required />
                    <button type="submit" style={{ padding: "8px" }}>Kaydet</button>
                </form>
            )}

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