import { useState, useEffect } from "react";
import api from "../services/api";

function Kategoriler() {
    const [kategoriler, setKategoriler] = useState([]);
    const [yeniKategori, setYeniKategori] = useState("");

    useEffect(() => { verileriGetir(); }, []);

    function verileriGetir() {
        api.get("/categories").then((res) => setKategoriler(res.data));
    }

    function ekle(e) {
        e.preventDefault();
        api.post("/categories", { name: yeniKategori }).then(() => {
            verileriGetir();
            setYeniKategori("");
        });
    }

    function sil(id) {
        if (window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) {
            api.delete("/categories/" + id).then(() => verileriGetir());
        }
    }

    return (
        <div>
            <h1>Kategoriler</h1>
            <form onSubmit={ekle} style={{ marginBottom: "20px", display: "flex", gap: "8px" }}>
                <input placeholder="Kategori Adı" value={yeniKategori} onChange={(e) => setYeniKategori(e.target.value)} required />
                <button type="submit">Ekle</button>
            </form>
            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Kategori Adı</th>
                        <th>İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    {kategoriler.map((k) => (
                        <tr key={k.id}>
                            <td>{k.id}</td>
                            <td>{k.name}</td>
                            <td><button onClick={() => sil(k.id)}>Sil</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Kategoriler;