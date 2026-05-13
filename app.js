// Initialize Supabase
const supabaseUrl = "https://gsxurqserenzqupcpcuh.supabase.co";
const supabaseKey = "sb_publishable_QvcqJZttewQ39BwZq9WLow_JpP0y4Qq";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// State Variables
let allStudents = [];
let filteredStudents = [];
let currentPage = 1;
const itemsPerPage = 5;

// DOM Elements
const form = document.getElementById("studentForm");
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const pageInfo = document.getElementById("pageInfo");
const btnReset = document.getElementById("btnReset");
const btnExport = document.getElementById("btnExport");

// Fetch Data - FIXED: Changed 'supabase' to 'supabaseClient'
async function fetchStudents() {
  const { data, error } = await supabaseClient
    .from("students")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return;
  }

  allStudents = data;
  filterAndRender();
}

// Render Table based on Pagination & Search
function renderTable(data) {
  tableBody.innerHTML = "";
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  paginatedData.forEach((student, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${student.nim}</td>
            <td>${student.nama}</td>
            <td>${student.alamat}</td>
            <td>${student.tanggal_lahir}</td>
            <td>${student.jenis_kelamin}</td>
            <td>
                <button onclick="editStudent('${student.id}')" class="action-icon edit-icon"><i class="fas fa-edit"></i></button>
                <button onclick="deleteStudent('${student.id}')" class="action-icon delete-icon"><i class="fas fa-trash"></i></button>
            </td>
        `;
    tableBody.appendChild(tr);
  });
  updatePagination(data.length);
}

// Pagination Logic
function updatePagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  btnPrev.disabled = currentPage === 1;
  btnNext.disabled = currentPage === totalPages;
}

btnPrev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    filterAndRender();
  }
});
btnNext.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    filterAndRender();
  }
});

searchInput.addEventListener("input", (e) => {
  currentPage = 1;
  filterAndRender();
});

function filterAndRender() {
  const query = searchInput.value.toLowerCase();
  filteredStudents = allStudents.filter(
    (student) =>
      student.nama.toLowerCase().includes(query) ||
      student.nim.toString().includes(query),
  );
  renderTable(filteredStudents);
}

// Submit Form - FIXED: Changed 'supabase' to 'supabaseClient'
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const editId = document.getElementById("editId").value;
  const rawPassword = document.getElementById("password").value;
  const hashedPassword = CryptoJS.SHA256(rawPassword).toString();

  const studentData = {
    nama: document.getElementById("nama").value,
    nim: document.getElementById("nim").value,
    alamat: document.getElementById("alamat").value,
    tanggal_lahir: document.getElementById("tanggal_lahir").value,
    jenis_kelamin: document.querySelector('input[name="jenis_kelamin"]:checked')
      .value,
    password: hashedPassword,
  };

  if (editId) {
    const { error } = await supabaseClient
      .from("students")
      .update(studentData)
      .eq("id", editId);
    if (!error) resetForm();
  } else {
    const { error } = await supabaseClient
      .from("students")
      .insert([studentData]);
    if (!error) resetForm();
  }
  fetchStudents();
});

// Edit Student
window.editStudent = function (id) {
  const student = allStudents.find((s) => s.id === id);
  if (!student) return;
  document.getElementById("editId").value = student.id;
  document.getElementById("nama").value = student.nama;
  document.getElementById("nim").value = student.nim;
  document.getElementById("alamat").value = student.alamat;
  document.getElementById("tanggal_lahir").value = student.tanggal_lahir;
  document.getElementById(
    student.jenis_kelamin === "Pria" ? "jk_pria" : "jk_wanita",
  ).checked = true;
  document.getElementById("password").placeholder = "Masukkan Password Baru";
};

// Delete Student - FIXED: Changed 'supabase' to 'supabaseClient'
window.deleteStudent = async function (id) {
  if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
    const { error } = await supabaseClient
      .from("students")
      .delete()
      .eq("id", id);
    if (!error) fetchStudents();
  }
};

function resetForm() {
  form.reset();
  document.getElementById("editId").value = "";
  document.getElementById("jk_pria").checked = true;
}

btnReset.addEventListener("click", resetForm);

// Export PDF Logic stays same...
// Initial load
fetchStudents();

// Export to PDF
btnExport.addEventListener("click", () => {
  const element = document.getElementById("tableContainer");
  const opt = {
    margin: 1,
    filename: "Data_Mahasiswa.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
  };

  // Temporarily clone table and remove 'Aksi' column for cleaner PDF
  const clone = element.cloneNode(true);
  const rows = clone.querySelectorAll("tr");
  rows.forEach((row) => {
    if (row.children.length > 0) {
      row.removeChild(row.lastElementChild);
    }
  });

  html2pdf().set(opt).from(clone).save();
});

// Initial load
fetchStudents();