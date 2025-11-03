// main.js
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

const noteForm = document.getElementById("note-form");
const listaNotas = document.getElementById("lista-notas");
const buscar = document.getElementById("buscar");
const contador = document.getElementById("contador");

let notas = [];
let editId = null; // si se está editando una nota

// Agregar o actualizar nota
noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const tituloEl = document.getElementById("titulo");
  const contenidoEl = document.getElementById("contenido");
  const titulo = tituloEl.value.trim();
  const contenido = contenidoEl.value.trim();
  if (!titulo || !contenido) return;

  if (editId) {
    // actualizar
    const ref = doc(db, "notas", editId);
    await updateDoc(ref, {
      titulo,
      contenido,
      fecha: new Date().toISOString()
    });
    editId = null;
    noteForm.reset();
    return;
  }

  // crear nueva
  await addDoc(collection(db, "notas"), {
    titulo,
    contenido,
    fecha: new Date().toISOString()
  });
  noteForm.reset();
});

// Escucha reactiva (ordenadas por fecha descendente)
const q = query(collection(db, "notas"), orderBy("fecha", "desc"));
onSnapshot(q, (snapshot) => {
  notas = [];
  snapshot.forEach((d) => notas.push({ id: d.id, ...d.data() }));
  renderNotas(notas);
  contador.textContent = `Notas: ${notas.length}`;
});

// Render de notas
function renderNotas(list) {
  listaNotas.innerHTML = "";
  if (!list.length) {
    listaNotas.innerHTML = `<p style="padding:12px;color:var(--muted)">No hay notas aún.</p>`;
    lucide.createIcons();
    return;
  }

  list.forEach((n) => {
    const li = document.createElement("li");
    // contenedor de acciones (editar + eliminar)
    li.innerHTML = `
      <strong>${escapeHtml(n.titulo)}</strong>
      <p>${escapeHtml(n.contenido)}</p>
      <div class="note-actions">
        <button class="icon-btn edit-btn" data-id="${n.id}" title="Editar">
          <i data-lucide="edit-2"></i>
        </button>
        <button class="delete-btn" data-id="${n.id}" title="Eliminar">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;
    listaNotas.appendChild(li);
  });
  lucide.createIcons();
}

// Búsqueda en tiempo real
buscar.addEventListener("input", (e) => {
  const qText = e.target.value.trim().toLowerCase();
  if (!qText) {
    renderNotas(notas);
    return;
  }
  const filtradas = notas.filter(n =>
    n.titulo.toLowerCase().includes(qText) ||
    n.contenido.toLowerCase().includes(qText)
  );
  renderNotas(filtradas);
});

// Delegación de eventos para editar/eliminar
listaNotas.addEventListener("click", async (e) => {
  const btnDelete = e.target.closest(".delete-btn");
  const btnEdit = e.target.closest(".edit-btn");

  if (btnDelete) {
    const id = btnDelete.getAttribute("data-id");
    await deleteDoc(doc(db, "notas", id));
    return;
  }

  if (btnEdit) {
    const id = btnEdit.getAttribute("data-id");
    const nota = notas.find(x => x.id === id);
    if (!nota) return;
    // cargar en formulario y marcar modo edición
    document.getElementById("titulo").value = nota.titulo;
    document.getElementById("contenido").value = nota.contenido;
    editId = id;
    // opcional: focusear textarea
    document.getElementById("titulo").focus();
    return;
  }
});

// Escape HTML simple para evitar inyección (render seguro)
function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* Dark mode toggle simple */
const darkToggle = document.getElementById("dark-toggle");
darkToggle.addEventListener("change", (e) => {
  if (e.target.checked) document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
});

// Inicializa icons (por si)
lucide.createIcons();

// Loader: ocultar cuando se cargan los datos por primera vez
const loader = document.getElementById("loader");
let firstSnapshot = true;

onSnapshot(q, (snapshot) => {
  notas = [];
  snapshot.forEach((d) => notas.push({ id: d.id, ...d.data() }));
  renderNotas(notas);
  contador.textContent = `Notas: ${notas.length}`;

  if (firstSnapshot) {
    loader.classList.add("hide");
    firstSnapshot = false;
  }
});
