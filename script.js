const owners = [
  { id: 1, name: 'Julia Berger', email: 'julia@berger.de' },
  { id: 2, name: 'Markus Hahn', email: 'markus@hahn.de' },
  { id: 3, name: 'Leonie Kraft', email: 'leonie@kraft.de' },
];

const dogs = [
  { id: 1, owner_id: 1, name: 'Luna', breed: 'Australian Shepherd', vaccinated: true, next_vaccine_due: '2025-05-10' },
  { id: 2, owner_id: 2, name: 'Milo', breed: 'Labrador', vaccinated: false, next_vaccine_due: '2025-04-05' },
  { id: 3, owner_id: 3, name: 'Nala', breed: 'Mischling', vaccinated: true, next_vaccine_due: '2025-07-21' },
];

const courses = [
  { id: 1, title: 'Welpengruppe', next_session: '2025-04-08' },
  { id: 2, title: 'Grundkurs Gehorsam', next_session: '2025-04-12' },
  { id: 3, title: 'Agility Einsteiger', next_session: '2025-04-15' },
];

const enrollments = [
  { dog_id: 1, course_id: 2 },
  { dog_id: 2, course_id: 1 },
  { dog_id: 3, course_id: 3 },
];

const documents = [
  { id: 1, dog_id: 1, file_name: 'Impfpass_Luna.pdf', file_type: 'pdf' },
  { id: 2, dog_id: 3, file_name: 'Impfpass_Nala.pdf', file_type: 'pdf' },
];

function buildOverviewRows() {
  const findOwner = (id) => owners.find((o) => o.id === id);
  const findCourse = (id) => courses.find((c) => c.id === id);
  const docsByDog = documents.reduce((acc, doc) => {
    acc[doc.dog_id] = acc[doc.dog_id] || [];
    acc[doc.dog_id].push(doc);
    return acc;
  }, {});

  return enrollments.map((enrollment) => {
    const dog = dogs.find((d) => d.id === enrollment.dog_id);
    const owner = findOwner(dog.owner_id);
    const course = findCourse(enrollment.course_id);

    return {
      owner: owner.name,
      contact: owner.email,
      dog: dog.name,
      breed: dog.breed,
      vaccinated: dog.vaccinated,
      nextVaccine: dog.next_vaccine_due,
      course: course.title,
      nextSession: course.next_session,
      docs: docsByDog[dog.id] || [],
    };
  });
}

function createStatusCell(vaccinated, nextDate) {
  const container = document.createElement('div');
  container.className = 'status ' + (vaccinated ? 'status--ok' : 'status--due');
  const dot = document.createElement('span');
  dot.className = 'dot';
  const label = document.createElement('span');
  const formattedDate = new Date(nextDate).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  label.textContent = vaccinated ? `Aktuell (nächste: ${formattedDate})` : `Fällig bis ${formattedDate}`;
  container.append(dot, label);
  return container;
}

function renderTable() {
  const tbody = document.querySelector('#overview-table tbody');
  tbody.innerHTML = '';

  buildOverviewRows().forEach((row) => {
    const tr = document.createElement('tr');

    tr.append(
      createCell(row.owner),
      createCell(row.contact),
      createCell(row.dog),
      createCell(row.breed),
      createCell(createStatusCell(row.vaccinated, row.nextVaccine)),
      createCell(new Date(row.nextVaccine).toLocaleDateString('de-DE')),
      createCell(row.course),
      createCell(new Date(row.nextSession).toLocaleDateString('de-DE')),
      createCell(renderDocs(row.docs))
    );

    tbody.appendChild(tr);
  });
}

function renderDocs(docs) {
  if (!docs.length) return '—';
  const container = document.createElement('div');
  container.className = 'doc-list';
  docs.forEach((doc) => {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = doc.file_name;
    container.appendChild(badge);
  });
  return container;
}

function createCell(content) {
  const td = document.createElement('td');
  if (typeof content === 'string') {
    td.textContent = content;
  } else {
    td.appendChild(content);
  }
  return td;
}

function populateDogSelect() {
  const select = document.getElementById('dog-select');
  dogs.forEach((dog) => {
    const option = document.createElement('option');
    option.value = dog.id;
    option.textContent = `${dog.name} (${dog.breed})`;
    select.appendChild(option);
  });
}

function handleUpload(event) {
  event.preventDefault();
  const dogId = Number(document.getElementById('dog-select').value);
  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0];
  if (!file) return;

  const dog = dogs.find((d) => d.id === dogId);
  const log = document.getElementById('upload-log');
  const nextId = Math.max(0, ...documents.map((d) => d.id)) + 1;

  documents.push({
    id: nextId,
    dog_id: dogId,
    file_name: file.name,
    file_type: file.type || 'unbekannt',
    uploaded_at: new Date().toISOString(),
  });

  renderTable();
  const row = document.createElement('div');
  row.className = 'upload-row';
  row.innerHTML = `<div><strong>${dog.name}</strong><br/><small>${file.name}</small></div><span>${new Date().toLocaleTimeString('de-DE')}</span>`;
  log.prepend(row);

  fileInput.value = '';
}

renderTable();
populateDogSelect();
document.getElementById('upload-form').addEventListener('submit', handleUpload);
