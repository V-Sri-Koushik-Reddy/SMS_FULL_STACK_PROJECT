// =====================================================
// script.js  —  Scholar Dashboard Logic
// All API calls use authFetch() from auth.js so the
// Authorization header is injected automatically.
// =====================================================

"use strict";

/* ── Auth guard: kick to login if no token ─────────── */
requireAuth();

/* ── Populate sidebar user info ────────────────────── */
(function initUserInfo() {
  const user = getUser();
  if (!user) return;
  const initial = (user.name || user.email || "A")[0].toUpperCase();
  document.getElementById("user-avatar").textContent = initial;
  document.getElementById("user-name").textContent   = user.name  || user.email;
  document.getElementById("user-role").textContent   = user.role  || "User";
})();

/* ── DOM refs ────────────────────────────────────────── */
const inpName    = document.getElementById("inp-name");
const inpRoll    = document.getElementById("inp-roll");
const inpMarks   = document.getElementById("inp-marks");
const inpSearch  = document.getElementById("inp-search");
const inpMarksF  = document.getElementById("inp-marks-f");
const btnSubmit  = document.getElementById("btn-submit");
const btnIcon    = document.getElementById("btn-icon");
const btnLbl     = document.getElementById("btn-label");
const btnCancel  = document.getElementById("btn-cancel");
const btnRefresh = document.getElementById("btn-refresh");
const btnClear   = document.getElementById("btn-clear");
const editIdInp  = document.getElementById("edit-id");
const formTitle  = document.getElementById("form-title");
const formBadge  = document.getElementById("form-badge");
const tbody      = document.getElementById("tbody");
const skeleton   = document.getElementById("skeleton");
const tableWrap  = document.getElementById("table-wrap");
const emptyState = document.getElementById("empty-state");
const resCount   = document.getElementById("result-count");
const chips      = document.getElementById("filter-chips");
const toastEl    = document.getElementById("toast");
const modal      = document.getElementById("modal-backdrop");
const modalBody  = document.getElementById("modal-body");
const modalOk    = document.getElementById("modal-confirm");
const modalX     = document.getElementById("modal-cancel");

/* ── State ──────────────────────────────────────────── */
let deleteId     = null;
let searchTerm   = "";
let markFilter   = "";
let searchTimer  = null;
let markTimer    = null;

/* ════════════════════════════════════════════════════
   TOAST
   ════════════════════════════════════════════════════ */
let toastTimer = null;
function showToast(msg, type = "info") {
  toastEl.textContent = msg;
  toastEl.className   = `show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.className = "", 3200);
}

/* ════════════════════════════════════════════════════
   MODAL
   ════════════════════════════════════════════════════ */
function openModal(id, name) {
  deleteId = id;
  modalBody.textContent = `"${name}" will be permanently removed.`;
  modal.style.display   = "grid";
}
function closeModal() {
  deleteId = null;
  modal.style.display = "none";
}
modalX.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

/* ════════════════════════════════════════════════════
   LOADING STATES
   ════════════════════════════════════════════════════ */
const showSkeleton = () => { skeleton.style.display = "flex";  tableWrap.style.display = "none"; emptyState.style.display = "none"; };
const showTable    = () => { skeleton.style.display = "none";  tableWrap.style.display = "block";emptyState.style.display = "none"; };
const showEmpty    = () => { skeleton.style.display = "none";  tableWrap.style.display = "none"; emptyState.style.display = "block"; };

/* ════════════════════════════════════════════════════
   GRADE HELPERS
   ════════════════════════════════════════════════════ */
function gradeInfo(m) {
  if (m >= 90) return { letter:"O", cls:"g-o", color:"#f59e0b" };
  if (m >= 75) return { letter:"A", cls:"g-a", color:"#22c55e" };
  if (m >= 60) return { letter:"B", cls:"g-b", color:"#2dd4bf" };
  if (m >= 45) return { letter:"C", cls:"g-c", color:"#a78bfa" };
  return              { letter:"F", cls:"g-f", color:"#ef4444" };
}

/* ════════════════════════════════════════════════════
   STATS
   ════════════════════════════════════════════════════ */
function updateStats(students) {
  const n    = students.length;
  const avg  = n ? students.reduce((s, st) => s + st.marks, 0) / n : 0;
  const top  = n ? Math.max(...students.map(s => s.marks)) : 0;
  const pass = n ? Math.round(students.filter(s => s.marks >= 35).length / n * 100) : 0;

  document.getElementById("stat-total").textContent = n;
  document.getElementById("stat-avg").textContent   = avg.toFixed(1);
  document.getElementById("stat-top").textContent   = top;
  document.getElementById("stat-pass").textContent  = `${pass}%`;

  requestAnimationFrame(() => {
    document.getElementById("bar-avg").style.width  = `${avg}%`;
    document.getElementById("bar-pass").style.width = `${pass}%`;
  });
}

/* ════════════════════════════════════════════════════
   FILTER CHIPS
   ════════════════════════════════════════════════════ */
function renderChips() {
  chips.innerHTML = "";
  if (searchTerm) chips.appendChild(mkChip(`Name: "${searchTerm}"`, () => { inpSearch.value = ""; searchTerm = ""; renderChips(); fetchStudents(); }));
  if (markFilter) chips.appendChild(mkChip(`Marks > ${markFilter}`,  () => { inpMarksF.value = ""; markFilter  = ""; renderChips(); fetchStudents(); }));
}
function mkChip(label, onRemove) {
  const c = document.createElement("span");
  c.className = "chip";
  c.innerHTML = `${escHtml(label)} <span class="chip-x" title="Remove">✕</span>`;
  c.querySelector(".chip-x").addEventListener("click", onRemove);
  return c;
}

/* ════════════════════════════════════════════════════
   TABLE ROW
   ════════════════════════════════════════════════════ */
function buildRow(student, idx) {
  const tr = document.createElement("tr");
  const { id, name, rollNo, marks } = student;
  const { letter, cls, color } = gradeInfo(marks);

  tr.innerHTML = `
    <td class="td-num">${idx}</td>
    <td class="td-name">${escHtml(name)}</td>
    <td class="td-roll">${escHtml(rollNo)}</td>
    <td>
      <div class="marks-wrap">
        <span class="marks-val">${marks}</span>
        <div class="marks-bg">
          <div class="marks-fill" data-w="${marks}" style="width:0%;background:${color}"></div>
        </div>
      </div>
    </td>
    <td><span class="grade-badge ${cls}">${letter}</span></td>
    <td class="td-acts">
      <button class="btn btn-edit" data-id="${id}">✎ Edit</button>
      <button class="btn btn-del"  data-id="${id}" data-name="${escHtml(name)}">✕ Del</button>
    </td>
  `;

  tr.querySelector(".btn-edit").addEventListener("click", () => startEdit(student));
  tr.querySelector(".btn-del").addEventListener("click",  () => openModal(id, name));
  return tr;
}

function animateBars() {
  setTimeout(() => {
    document.querySelectorAll(".marks-fill[data-w]").forEach(b => { b.style.width = `${b.dataset.w}%`; });
  }, 80);
}

function escHtml(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

/* ════════════════════════════════════════════════════
   API — FETCH STUDENTS
   ════════════════════════════════════════════════════ */
async function fetchStudents() {
  showSkeleton();

  const params = new URLSearchParams();
  if (searchTerm) params.append("search",     searchTerm);
  if (markFilter) params.append("marksAbove",  markFilter);
  const qs = params.toString() ? `?${params}` : "";

  try {
    const res  = await authFetch(`/students${qs}`);
    const json = await res.json();

    if (!res.ok) {
      showToast(json.message || "Failed to load students.", "error");
      showEmpty();
      return;
    }

    const students = json.data ?? [];
    updateStats(students);
    tbody.innerHTML = "";

    if (!students.length) {
      showEmpty();
      resCount.textContent = "(0 results)";
      return;
    }

    students.forEach((s, i) => tbody.appendChild(buildRow(s, i + 1)));
    showTable();
    animateBars();
    resCount.textContent = `(${students.length} record${students.length !== 1 ? "s" : ""})`;

  } catch (err) {
    showEmpty();
    showToast("Cannot connect to the server. Is the backend running on port 5000?", "error");
    console.error("fetchStudents:", err);
  }
}

/* ════════════════════════════════════════════════════
   API — ADD / UPDATE / DELETE
   ════════════════════════════════════════════════════ */
async function apiAdd(name, rollNo, marks) {
  const res  = await authFetch("/students", {
    method: "POST",
    body:   JSON.stringify({ name, rollNo, marks }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
}

async function apiUpdate(id, name, rollNo, marks) {
  const res  = await authFetch(`/students/${id}`, {
    method: "PUT",
    body:   JSON.stringify({ name, rollNo, marks }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
}

async function apiDelete(id) {
  const res  = await authFetch(`/students/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
}

/* ════════════════════════════════════════════════════
   FORM — Add / Edit / Reset
   ════════════════════════════════════════════════════ */
function resetForm() {
  inpName.value = inpRoll.value = inpMarks.value = editIdInp.value = "";
  formTitle.textContent  = "Add Student";
  formBadge.textContent  = "NEW";
  btnLbl.textContent     = "Add Student";
  btnIcon.textContent    = "＋";
  btnCancel.style.display = "none";
  inpName.focus();
}

function startEdit(student) {
  editIdInp.value = student.id;
  inpName.value   = student.name;
  inpRoll.value   = student.rollNo;
  inpMarks.value  = student.marks;
  formTitle.textContent  = "Edit Student";
  formBadge.textContent  = "EDIT";
  btnLbl.textContent     = "Save Changes";
  btnIcon.textContent    = "✓";
  btnCancel.style.display = "inline-flex";
  document.querySelector(".card").scrollIntoView({ behavior: "smooth", block: "nearest" });
  inpName.focus();
}

btnCancel.addEventListener("click", resetForm);

/* ── Form submit ─────────────────────────────────────── */
btnSubmit.addEventListener("click", async () => {
  const name   = inpName.value.trim();
  const rollNo = inpRoll.value.trim();
  const marks  = parseFloat(inpMarks.value);
  const editId = editIdInp.value;

  // Client validation
  if (!name)                                    { showToast("Name is required.", "error"); inpName.focus(); return; }
  if (!rollNo)                                  { showToast("Roll number is required.", "error"); inpRoll.focus(); return; }
  if (isNaN(marks) || marks < 0 || marks > 100) { showToast("Marks must be 0–100.", "error"); inpMarks.focus(); return; }

  btnSubmit.disabled = true;
  btnSubmit.style.opacity = "0.65";

  try {
    if (editId) {
      await apiUpdate(Number(editId), name, rollNo, marks);
      showToast(`${name} updated successfully!`, "success");
    } else {
      await apiAdd(name, rollNo, marks);
      showToast(`${name} added successfully!`, "success");
    }
    resetForm();
    fetchStudents();
  } catch (err) {
    showToast(err.message || "Operation failed.", "error");
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.style.opacity = "";
  }
});

/* Enter key in form */
[inpName, inpRoll, inpMarks].forEach(inp =>
  inp.addEventListener("keydown", (e) => { if (e.key === "Enter") btnSubmit.click(); })
);

/* ── Delete confirm ──────────────────────────────────── */
modalOk.addEventListener("click", async () => {
  if (!deleteId) return;
  modalOk.disabled = true;
  modalOk.textContent = "Deleting…";
  try {
    await apiDelete(deleteId);
    showToast("Student deleted.", "success");
    closeModal();
    fetchStudents();
  } catch (err) {
    showToast(err.message, "error");
  } finally {
    modalOk.disabled = false;
    modalOk.textContent = "Delete";
  }
});

/* ════════════════════════════════════════════════════
   SEARCH & FILTER
   ════════════════════════════════════════════════════ */
inpSearch.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    searchTerm = inpSearch.value.trim();
    renderChips();
    fetchStudents();
  }, 350);
});

inpMarksF.addEventListener("input", () => {
  clearTimeout(markTimer);
  markTimer = setTimeout(() => {
    markFilter = inpMarksF.value.trim();
    renderChips();
    fetchStudents();
  }, 400);
});

inpMarksF.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    clearTimeout(markTimer);
    markFilter = inpMarksF.value.trim();
    renderChips();
    fetchStudents();
  }
});

btnClear.addEventListener("click", () => {
  inpSearch.value = inpMarksF.value = "";
  searchTerm = markFilter = "";
  renderChips();
  fetchStudents();
  showToast("Filters cleared.", "info");
});

/* ── Refresh ─────────────────────────────────────────── */
btnRefresh.addEventListener("click", () => {
  btnRefresh.style.transition = "transform 0.5s ease";
  btnRefresh.style.transform  = "rotate(360deg)";
  setTimeout(() => { btnRefresh.style.transform = ""; }, 600);
  fetchStudents();
});

/* ── Logout ──────────────────────────────────────────── */
document.getElementById("btn-logout").addEventListener("click", () => {
  if (confirm("Are you sure you want to log out?")) logout();
});

/* ════════════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", fetchStudents);

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    document.getElementById("submit-btn").click();
  }
});