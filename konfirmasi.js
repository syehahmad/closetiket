document.addEventListener("DOMContentLoaded", function() {
    buatPesan();
});

// Toggle dropdown menu
function toggleMenu(event) {
    event.stopPropagation();
    const dropdown = document.getElementById("dropdownContent");
    if (dropdown) {
        dropdown.classList.toggle("show");
    }
}

// Close dropdown on outside click
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

// Salam otomatis berdasarkan waktu
function getSalamOtomatis() {
    const jam = new Date().getHours();
    if (jam >= 3 && jam < 11) return "Pagi";
    if (jam >= 11 && jam < 15) return "Siang";
    if (jam >= 15 && jam < 18) return "Sore";
    return "Malam";
}

// Ambil data dari tiket mentah
function ambilData() {
    const text = document.getElementById("raw").value;

    if (!text.trim()) {
        alert("Paste isi tiket mentah terlebih dahulu!");
        return;
    }

    const extractPattern = (pattern) => {
        const match = text.match(pattern);
        return match ? match[1].trim() : "";
    };

    const idNomor = extractPattern(/(?:INSIDEN NO|No Insiden|Tiket|No Tiket)\.?\s*[:=-]?\s*([^\n]+)/i) || extractPattern(/((?:INS|Tkt)-[A-Za-z0-9]+)/i);
    const nama = extractPattern(/(?:Nama Pelanggan|Nama)\s*[:=-]?\s*([^\n]+)/i);
    const hp = extractPattern(/(?:No\s*HP|Telepon|HP|Telp|Contact)\s*[:=-]?\s*([0-9+]+)/i);

    if (idNomor) document.getElementById("notiket").value = idNomor;
    if (nama) document.getElementById("nama").value = nama;
    if (hp) document.getElementById("nohp").value = hp;

    buatPesan();
}

// Format draft pesan WhatsApp
function buatPesan() {
    const namaInput = document.getElementById("nama").value.trim();
    const tiketInput = document.getElementById("notiket").value.trim();
    const pilihanSalam = document.getElementById("waktuSalam").value;

    const salam = (pilihanSalam === "Otomatis") ? getSalamOtomatis() : pilihanSalam;
    const nama = namaInput || "(NAMA)";
    const idTiket = tiketInput || "(ID TIKET)";

    const template = 
`Selamat ${salam}
Perkenalkan Kami dari Tim Maintenance Iconnet Area kendal, Mau konfirmasi terkait laporan gangguan yang di alami, atas nama Bapak/Ibu ${nama} dengan nomer aduan ${idTiket}.

mohon maaf atas kendala yang di alami bapak/ibu sehingga layanan internet di rumah mengalami gangguan, saat ini tiket aduan sudah masuk dan akan di kerjakan sesegera mungkin ya bapak/ibu.

Boleh bantu berikan sharelock lokasi serta foto tampak depan rumahnya bapak/ibu, supaya mempermudah tim kami menuju ke lokasi.

mohon maaf sekali lagi apabila harus menunggu.

salam
Tim CM Iconnet`;

    document.getElementById("hasilWA").value = template;
}

// Copy teks hasil WA
function copyWA() {
    const hasil = document.getElementById("hasilWA").value;
    if (!hasil.trim()) {
        alert("Belum ada pesan untuk disalin.");
        return;
    }
    navigator.clipboard.writeText(hasil).then(() => {
        alert("Pesan WA berhasil disalin!");
    });
}

// Buka link WhatsApp Web / App
function bukaWA() {
    let nohp = document.getElementById("nohp").value.replace(/[^0-9]/g, '');
    const pesan = encodeURIComponent(document.getElementById("hasilWA").value);

    if (!nohp) {
        alert("Masukkan No HP terlebih dahulu untuk menggunakan fitur Kirim WA langsung!");
        document.getElementById("nohp").focus();
        return;
    }

    if (nohp.startsWith("0")) {
        nohp = "62" + nohp.slice(1);
    }

    window.open(`https://api.whatsapp.com/send?phone=${nohp}&text=${pesan}`, "_blank");
}

// Reset form
function resetForm() {
    document.querySelectorAll("input").forEach(e => e.value = "");
    document.querySelectorAll("textarea").forEach(e => e.value = "");
    document.getElementById("waktuSalam").selectedIndex = 0;
    buatPesan();
}