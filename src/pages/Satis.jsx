import { useState, useEffect } from "react";
import api from "../services/api";

function Satis() {
    const [urunler, setUrunler] = useState([]);
    const [sepet, setSepet] = useState([]);
    const [secilenUrun, setSecilenUrun] = useState("");
    const [adet, setAdet] = useState(1);
    const [mesaj, setMesaj] = useState("");
    const [satislar, setSatislar] = useState([]);

    useEffect(() => {
        verileriGetir();
    }, []);

    function verileriGetir() {
        api.get("/products").then((res) => setUrunler(res.data));
        api.get("/sales").then((res) => setSatislar(res.data));
    }

    function sepeteEkle() {
        const urun = urunler.find((u) => u.id === Number(secilenUrun));
        if (!urun) return;

        const mevcutIndex = sepet.findIndex((s) => s.urunId === urun.id);
        if (mevcutIndex >= 0) {
            const yeniSepet = [...sepet];
            yeniSepet[mevcutIndex].adet += Number(adet);
            setSepet(yeniSepet);
        } else {
            setSepet([...sepet, {
                urunId: urun.id,
                urunAdi: urun.urunAdi,
                birimFiyat: urun.satisFiyati,
                adet: Number(adet)
            }]);
        }
        setSecilenUrun("");
        setAdet(1);
    }

    function sepettenCikar(index) {
        setSepet(sepet.filter((_, i) => i !== index));
    }

    function genelToplam() {
        return sepet.reduce((toplam, item) => toplam + (item.birimFiyat * item.adet), 0);
    }

    function satisiTamamla() {
        const gonderilecek = {
            detaylar: sepet.map((item) => ({
                urun: { id: item.urunId },
                adet: item.adet
            }))
        };

        api.post("/sales", gonderilecek)
            .then(() => {
                setMesaj("Satış başarıyla tamamlandı!");
                setSepet([]);
                verileriGetir();
            })
            .catch((err) => {
                setMesaj(err.response?.data?.message || "Hata oluştu! Stok yetersiz olabilir.");
            });
    }

    return (
        <div>
            <h1>Satış</h1>

            {mesaj && <p style={{ color: mesaj.includes("başarı") ? "green" : "red", fontWeight: "bold" }}>{mesaj}</p>}

            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", alignItems: "center" }}>
                <select value={secilenUrun} onChange={(e) => setSecilenUrun(e.target.value)}>
                    <option value="">Ürün Seçin</option>
                    {urunler.map((u) => (
                        <option key={u.id} value={u.id}>{u.urunAdi} (Stok: {u.stokMiktari})</option>
                    ))}
                </select>
                <input type="number" min="1" value={adet} onChange={(e) => setAdet(e.target.value)} style={{ width: "60px" }} />
                <button onClick={sepeteEkle}>Sepete Ekle</button>
            </div>

            {sepet.length > 0 && (
                <>
                    <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", marginBottom: "10px" }}>
                        <thead>
                            <tr>
                                <th>Ürün</th>
                                <th>Adet</th>
                                <th>Birim Fiyat</th>
                                <th>Satır Toplamı</th>
                                <th>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sepet.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.urunAdi}</td>
                                    <td>{item.adet}</td>
                                    <td>{item.birimFiyat} TL</td>
                                    <td>{item.birimFiyat * item.adet} TL</td>
                                    <td><button onClick={() => sepettenCikar(index)}>Çıkar</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p style={{ fontWeight: "bold", fontSize: "18px" }}>Genel Toplam: {genelToplam()} TL</p>
                    <button onClick={satisiTamamla} style={{ padding: "10px 20px", background: "green", color: "white", border: "none", cursor: "pointer" }}>
                        Satışı Tamamla
                    </button>
                </>
            )}

            <h2 style={{ marginTop: "40px" }}>Satış Geçmişi</h2>
            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tarih</th>
                        <th>Toplam Tutar</th>
                        <th>Ürünler</th>
                    </tr>
                </thead>
                <tbody>
                    {satislar.map((satis) => (
                        <tr key={satis.id}>
                            <td>{satis.id}</td>
                            <td>{new Date(satis.tarih).toLocaleString("tr-TR")}</td>
                            <td>{satis.toplamTutar} TL</td>
                            <td>
                                {satis.detaylar?.map((d, i) => (
                                    <span key={i}>{d.urun?.urunAdi} x{d.adet}{i < satis.detaylar.length - 1 ? ", " : ""}</span>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Satis;