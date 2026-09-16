// Function toggle menu navigasi hamburger
function toggleMenu(event) {
    event.stopPropagation();
    const dropdown = document.getElementById("dropdownContent");
    if (dropdown) {
        dropdown.classList.toggle("show");
    }
}

// Menutup menu jika mengklik di luar area dropdown
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

// Function mengekstrak data dari teks mentah tiket
function ambilData() {
    const rawText = document.getElementById("raw").value;

    if (!rawText.trim()) {
        alert("Paste data tiket mentah terlebih dahulu.");
        return;
    }

    const extractPattern = (pattern) => {
        const match = rawText.match(pattern);
        return match ? match[1].trim() : "";
    };

    // Pengecekan RegEx spesifik untuk setiap field
    const noTiket = extractPattern(/(?:No Tiket|Tiket|ID Tiket)\s*[:=-]?\s*([^\n]+)/i) || extractPattern(/(Tkt-[A-Za-z0-9]+)/i);
    const noInsiden = extractPattern(/(?:No Insiden|Insiden|INSIDEN NO)\s*[:=-]?\s*([^\n]+)/i) || extractPattern(/(INS-[A-Za-z0-9]+)/i);
    const nama = extractPattern(/(?:Nama Pelanggan|Nama)\s*[:=-]?\s*([^\n]+)/i);
    const sid = extractPattern(/(?:SID|Service ID)\s*[:=-]?\s*([^\n]+)/i);
    const layanan = extractPattern(/(?:Layanan|Bandwidth|Speed)\s*[:=-]?\s*([^\n]+)/i);
    const alamat = extractPattern(/(?:Alamat)\s*[:=-]?\s*([^\n]+)/i);

    if (noTiket) document.getElementById("notiket").value = noTiket;
    if (noInsiden) document.getElementById("insiden").value = noInsiden;
    if (nama) document.getElementById("nama").value = nama;
    if (sid) document.getElementById("sid").value = sid;
    if (layanan) document.getElementById("layanan").value = layanan;
    if (alamat) document.getElementById("alamat").value = alamat;
}

// Function generate format laporan close tiket
function generate() {
    const getVal = (id) => {
        const el = document.getElementById(id);
        return el ? el.value.trim() : "";
    };

    const tim = getVal("tim");
    const rootcause = getVal("rootcause");
    const action = getVal("action");
    const tikoruser = getVal("tikoruser");

    // Validasi field wajib (*)
    if (!tim || !rootcause || !action || !tikoruser) {
        alert("Mohon isi semua field wajib (*): Tim Teknisi, Rootcause, Action, dan Tikor User.");
        return;
    }

    // Format output teks laporan
    const laporan = 
`*FORMAT CLOSE TIKET*
====================================
No Tiket : ${getVal("notiket")}
No Insiden : ${getVal("insiden")}
Tim Teknisi : ${tim}
Nama Pelanggan : ${getVal("nama")}
SID : ${getVal("sid")}
Layanan : ${getVal("layanan")}
Rootcause : ${rootcause}
Action : ${action}
-----------------------------
*MATERIAL TERPAKAI*
SN Kabel : ${getVal("snkabel") || "-"}
SN ONT : ${getVal("snont") || "-"}
Pathcord APC : ${getVal("apc") || "-"}
Pathcord UPC : ${getVal("upc") || "-"}
Sleeve Protektor : ${getVal("sleeve") || "-"}
Pigtail : ${getVal("pigtail") || "-"}`;
====================================
Tikor User : ${tikoruser}
Tikor Titik Putus : ${getVal("tikorputus") || "-"}

    document.getElementById("hasil").value = laporan;
}

// Function menyalin teks hasil ke clipboard
function copyText() {
    const hasilArea = document.getElementById("hasil");

    if (!hasilArea.value.trim()) {
        alert("Belum ada teks laporan untuk disalin. Klik tombol Format Close terlebih dahulu.");
        return;
    }

    navigator.clipboard.writeText(hasilArea.value)
        .then(() => {
            alert("Format Close Tiket berhasil disalin.");
        })
        .catch(() => {
            hasilArea.select();
            document.execCommand("copy");
            alert("Format Close Tiket berhasil disalin.");
        });
}

// Function mengosongkan seluruh form input
function resetForm() {
    const inputs = document.querySelectorAll(".form-container input, .form-container textarea");
    inputs.forEach(input => input.value = "");
    document.getElementById("hasil").value = "";
}
