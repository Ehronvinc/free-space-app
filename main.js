const noteContainer = document.getElementById("notes-cont");
const addNoteBtn = document.getElementById("new-note");
const noteContainerFooter = document.getElementById("note-footer");
const emptyContainer = document.getElementById("empty");
const notes = getNotes();
const colors = [
  "#fff9e9",
  "#f9eaff",
  "#eaf5ed",
  "#fff0e7",
  "#eef4ff",
  "#fff0f1",
];

function renderNotes() {
  notes.forEach((note) => {
    const noteCard = createNoteElement(note.text, note.dateCreated, note.id);

    noteContainer.insertBefore(noteCard, noteContainerFooter);
  });

  emptyContainer.hidden = notes.length !== 0;
  updateThoughtCounter();
}

function addNotes() {
  const note = {
    id: crypto.randomUUID(),
    text: "",
    dateCreated: formatDate(),
  };
  notes.push(note);
  saveNotes();
  updateThoughtCounter();

  emptyContainer.hidden = true;

  const noteCard = createNoteElement(note.text, note.dateCreated, note.id);
  noteContainer.insertBefore(noteCard, noteContainerFooter);
}

function saveNotes() {
  if (notes.length === 0) {
    localStorage.removeItem("notes");
    return;
  }
  localStorage.setItem("notes", JSON.stringify(notes));
}

function getNotes() {
  const updatedNotes = localStorage.getItem("notes");
  const parsedNotes = JSON.parse(updatedNotes);

  return Array.isArray(parsedNotes) ? parsedNotes : [];
}

function updateNotes(id, text) {
  const targetArea = notes.find((note) => note.id === id);

  targetArea.text = text;

  saveNotes();
}

function updateThoughtCounter() {
  const thoughtsCounterElement = document.querySelector(".thoughts-counter");
  if (notes.length === 1 || notes.length === 0) {
    thoughtsCounterElement.textContent = `${notes.length} thought`;
  } else {
    thoughtsCounterElement.textContent = `${notes.length} thoughts`;
  }
}

function createNoteElement(text, dateCreated, id) {
  const noteCard = document.createElement("div");
  const cardHeader = createCardHeader(dateCreated, id);
  const cardTextArea = createTextAreaElement(text, id);
  const cardFooter = createCardFooter(cardTextArea);

  const randomColor = colors[Math.floor(Math.random() * colors.length + 1)];
  noteCard.style.backgroundColor = randomColor;

  noteCard.classList.add("note-card");

  noteCard.append(cardHeader, cardTextArea, cardFooter);

  return noteCard;
}

function createCardHeader(dateCreated, id) {
  const cardHeaderCont = document.createElement("div");
  const dateCreatedElement = createDate(dateCreated);
  const deleteBtn = createDeleteBtn(id);

  cardHeaderCont.classList.add("card-header-container");

  cardHeaderCont.append(dateCreatedElement, deleteBtn);

  return cardHeaderCont;
}

function createDate(dateCreated) {
  const dateCreatedElement = document.createElement("span");

  dateCreatedElement.classList.add("date-created");

  dateCreatedElement.textContent = dateCreated;

  return dateCreatedElement;
}

function formatDate() {
  const date = Date.now();

  return Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

function createDeleteBtn(id) {
  const deleteBtnElement = document.createElement("button");

  deleteBtnElement.classList.add("delete-btn");
  deleteBtnElement.textContent = "×";
  deleteBtnElement.title = "Delete note";

  deleteBtnElement.addEventListener("click", (e) => {
    deleteNote(e, id);
    if (notes.length === 0) {
      emptyContainer.hidden = false;
    }
  });

  return deleteBtnElement;
}

function deleteNote(e, deleteId) {
  const deleteIndex = notes.findIndex((note) => note.id === deleteId);
  e.currentTarget.closest(".note-card").remove();
  notes.splice(deleteIndex, 1);
  saveNotes();
  updateThoughtCounter();
}

function createTextAreaElement(text, id) {
  const textArea = document.createElement("textarea");

  textArea.classList.add("note-text");
  textArea.placeholder = "What's on your mind? Anything goes...";
  textArea.dataset.id = id;
  textArea.value = text;
  textArea.maxLength = 600;
  textArea.spellcheck = false;

  textArea.addEventListener("input", () => {
    updateNotes(id, textArea.value);
  });

  return textArea;
}

function createCardFooter(textArea) {
  const cardFooterCont = document.createElement("div");
  const footerSubtitle = createFootSubtitle();
  const charCounter = createCharCounter();

  function updateCharCount() {
    const textAreaLength = textArea.value.length;
    charCounter.textContent = `${textAreaLength}/${textArea.maxLength}`;
  }

  textArea.addEventListener("input", updateCharCount);
  updateCharCount();

  cardFooterCont.classList.add("card-footer-container");

  cardFooterCont.append(footerSubtitle, charCounter);

  return cardFooterCont;
}

function createFootSubtitle() {
  const footerSubtitle = document.createElement("p");

  footerSubtitle.classList.add("card-footer-text");

  footerSubtitle.textContent = "a thought from you.";

  return footerSubtitle;
}

function createCharCounter() {
  const charCounter = document.createElement("span");

  charCounter.classList.add("char-counter");

  charCounter.textContent = "0/600";

  return charCounter;
}

addNoteBtn.addEventListener("click", addNotes);
renderNotes();
