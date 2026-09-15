document.addEventListener("DOMContentLoaded", function() {
    initTheme();
    if (typeof buatPesan === "function") {
        buatPesan();
    }
});

/* TOGGLE & DETEKSI DARK MODE */
function initTheme() {
    const themeToggleBtn = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute("data-theme", "dark");
        if (themeToggleBtn) themeToggleBtn.textContent = "☀️ Light";
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        if (themeToggleBtn) themeToggleBtn.textContent = "🌙 Dark";
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            let newTheme = "light";

            if (currentTheme !== "dark") {
                newTheme = "dark";
                themeToggleBtn.textContent = "☀️ Light";
            } else {
                themeToggleBtn.textContent = "🌙 Dark";
            }

            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }
}

function dapatkanWaktu() {
    const jam = new Date().getHours();
    if (jam >= 3 && jam < 11) return "Pagi";
    if (jam >= 11 && jam < 15) return "Siang";
    if (jam >= 15 && jam < 18) return "Sore";
    return "Malam";
}

function buatPesan() {
    const namaEl = document.getElementById("nama");
    const notiketEl = document.getElementById("notiket");
    const waktuSalamEl = document.getElementById("waktuSalam");
    const hasilWAEl = document.getElementById("hasilWA");

    if (!hasilWAEl) return;

    const nama = (namaEl && namaEl.value) ? namaEl.value : "[Nama Pelanggan]";
    const notiket = (notiketEl && notiketEl.value) ? notiketEl.value : "[No Tiket/Insiden]";
    const pilihanWaktu = waktuSalamEl ? waktuSalamEl.value : "Otomatis";
    
    const waktu = (pilihanWaktu === "Otomatis") ? dapatkanWaktu() : pilihanWaktu;

    const pesan = `Selamat ${waktu} Bapak/Ibu ${nama},\n\nKami dari tim teknisi ICONNET ingin mengonfirmasi terkait laporan gangguan dengan nomor tiket/insiden ${notiket}.\n\nApakah kendala pada layanan internet Bapak/Ibu saat ini sudah normal kembali atau masih mengalami gangguan?\n\nMohon informasinya, terima kasih.`;

    hasilWAEl.value = pesan;
}

function copyWA() {
    const hasilWAEl = document.getElementById("hasilWA");
    if (!hasilWAEl || !hasilWAEl.value.trim()) {
        alert("Pesan WA masih kosong!");
        return;
    }
    navigator.clipboard.writeText(hasilWAEl.value);
    alert("Pesan WA berhasil disalin!");
}

function bukaWA() {
    const nohpEl = document.getElementById("nohp");
    const hasilWAEl = document.getElementById("hasilWA");

    let nohp = nohpEl ? nohpEl.value.trim() : "";
    const pesan = hasilWAEl ? encodeURIComponent(hasilWAEl.value) : "";

    if (!nohp) {
        alert("Masukkan nomor HP/WA pelanggan terlebih dahulu untuk membuka WhatsApp langsung.");
        return;
    }

    if (nohp.startsWith("0")) {
        nohp = "62" + nohp.slice(1);
    }

    window.open(`https://wa.me/${nohp}?text=${pesan}`, '_blank');
}