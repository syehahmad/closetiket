function toggleMenu(event) {
    event.stopPropagation();
    document.getElementById("dropdownContent").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.btn-hamburger')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

function ambilData() {
    const rawText = document.getElementById("raw").value;
    const text = rawText.replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000]/g, " ");

    if (text.trim() === "") {
        alert("Paste isi data tiket terlebih dahulu!");
        return;
    }

    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l !== "");

    // 1. No Tiket
    let noTiket = "";
    const matchTiket = text.match(/(?:Tiket|INSIDEN NO\.?)\s*[:=-]?\s*([A-Za-z0-9]+)/i);
    if (matchTiket) {
        noTiket = matchTiket[1].trim();
    } else if (lines.length > 0 && /^[A-Za-z0-9]{5,15}$/.test(lines[0])) {
        noTiket = lines[0];
    }
    document.getElementById("notiket").value = noTiket;

    // 2. Nama
    let nama = "";
    const matchNama = text.match(/(?:Nama User|Nama Pelanggan|Nama)\r?\n([^\r\n]+)/i);
    if (matchNama) {
        nama = matchNama[1].trim();
    } else {
        const matchNamaInline = text.match(/(?:Nama User|Nama Pelanggan|Nama)\s*[:=-]\s*([^\r\n]+)/i);
        if (matchNamaInline) nama = matchNamaInline[1].trim();
    }
    document.getElementById("nama").value = nama;

    // 3. SID
    let sid = "";
    const matchSID = text.match(/(?:Service Id|SID)\r?\n([0-9]+)/i);
    if (matchSID) {
        sid = matchSID[1].trim();
    } else {
        const matchSIDInline = text.match(/(?:Service Id|SID)\s*[:=-]?\s*([0-9]+)/i);
        if (matchSIDInline) sid = matchSIDInline[1].trim();
    }
    document.getElementById("sid").value = sid;

    // 4. Layanan
    let layanan = "";
    const matchLayananBlock = text.match(/(?:Layanan Produk|Layanan)\r?\n([^\r\n]+)/i);
    if (matchLayananBlock) {
        const matchAngka = matchLayananBlock[1].match(/(\d+)\s*(?:MBPS|Mbps|mbs|MB)/i);
        if (matchAngka) layanan = matchAngka[1];
    }
    if (!layanan) {
        const matchAngkaDirect = text.match(/(\d+)\s*(?:MBPS|Mbps|mbs)/i);
        if (matchAngkaDirect) layanan = matchAngkaDirect[1];
    }
    document.getElementById("layanan").value = layanan;

    // 5. SN ONT Lama
    let snLama = "";
    const matchSNBlock = text.match(/SN\r?\n([^\r\n]+)/i);
    if (matchSNBlock) {
        snLama = matchSNBlock[1].trim();
    } else {
        const matchSNInline = text.match(/SN\s*[:=-]?\s*([A-Za-z0-9]+)/i);
        if (matchSNInline) snLama = matchSNInline[1].trim();
    }
    if (!snLama) {
        const matchSNFromFTTH = text.match(/OLT\-[0-9]+\s+([A-Za-z0-9]{8,16})/i);
        if (matchSNFromFTTH) snLama = matchSNFromFTTH[1].trim();
    }
    document.getElementById("snlama").value = snLama;

    // 6. MAC Lama
    let macLama = "";
    const matchMacBlock = text.match(/Mac\r?\n([^\r\n]+)/i);
    if (matchMacBlock) {
        macLama = matchMacBlock[1].trim();
    } else {
        const matchMacInline = text.match(/Mac\s*[:=-]?\s*([^\r\n]+)/i);
        if (matchMacInline) macLama = matchMacInline[1].trim();
    }
    document.getElementById("maclama").value = macLama;

    // 7. Rootcause
    let rootcause = "";
    const matchRoot = text.match(/(?:Rootcause|Jenis Komplain)\r?\n([^\r\n]+)/i);
    if (matchRoot) {
        rootcause = matchRoot[1].trim();
    }
    document.getElementById("rootcause").value = rootcause;

    // 8. Tim
    let tim = "";
    const matchTimBlock = text.match(/(?:Tim|Petugas Lapangan)\r?\n([^\r\n]+)/i);
    if (matchTimBlock) {
        tim = matchTimBlock[1].trim();
    } else {
        const matchTimInline = text.match(/(?:Tim|Petugas Lapangan)\s*[:=-]\s*([^\r\n]+)/i);
        if (matchTimInline) tim = matchTimInline[1].trim();
    }
    document.getElementById("tim").value = tim;
}

function generate() {
    const notiket = document.getElementById("notiket").value;
    const tim = document.getElementById("tim").value;
    const nama = document.getElementById("nama").value;
    const sid = document.getElementById("sid").value;
    const layanan = document.getElementById("layanan").value;
    const olt = document.getElementById("olt").value || "(Diisi oleh NOC SBU)";
    const snlama = document.getElementById("snlama").value;
    const maclama = document.getElementById("maclama").value;
    const snbaru = document.getElementById("snbaru").value;
    const macbaru = document.getElementById("macbaru").value;
    const rootcause = document.getElementById("rootcause").value;

    if (!notiket || !tim || !nama || !sid || !layanan || !snlama || !maclama || !snbaru || !macbaru || !rootcause) {
        alert("Harap lengkapi semua data wajib yang bertanda bintang red (*)");
        return;
    }

    const hasil = 
`REPLACE ONT 
====================================
Tiket : ${notiket}
Tim : ${tim}
Nama User : ${nama}
SID : ${sid}
Layanan : ${layanan} Mbps
---------------------------
OLT : ${olt}

ONT Lama
SN : ${snlama}
Mac : ${maclama}

ONT Baru
SN : ${snbaru}
Mac : ${macbaru}
====================================
Rootcause : ${rootcause}`;

    document.getElementById("hasil").value = hasil;
}

function copyText() {
    const hasil = document.getElementById("hasil").value;

    if (hasil.trim() === "") {
        alert("Belum ada hasil format replace ONT untuk disalin.");
        return;
    }

    navigator.clipboard.writeText(hasil);
    alert("Hasil format Replace ONT berhasil disalin!");
}

function resetForm() {
    document.querySelectorAll("input").forEach(e => {
        if (e.id === "olt") {
            e.value = "(Diisi oleh NOC SBU)";
        } else {
            e.value = "";
        }
    });
    document.querySelectorAll("textarea").forEach(e => e.value = "");
}