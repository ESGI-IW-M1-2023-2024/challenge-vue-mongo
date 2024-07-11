const apiUrl = 'http://localhost:3000/api/technologies';
const bearerToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY4YmJiMmM2M2QzYzdkYWFmYzBkNWZkIn0sImlhdCI6MTcyMDcwOTIyMiwiZXhwIjoxNzIwNzEyODIyfQ.UKHQeVkHYmlfUJxwh6c0hYufY5uPeIsDMO2PJc5JIsw';

const technologiesData = [
  { label: 'Python' },
  { label: 'Ruby' },
  { label: 'C#' },
  { label: 'Swift' },
  { label: 'Kotlin' },
  { label: 'Rust' },
  { label: 'Scala' },
  { label: 'Perl' },
  { label: 'Haskell' },
  { label: 'Lua' },
  { label: 'Matlab' },
  { label: 'Shell Scripting' },
  { label: 'Dart' },
  { label: 'Assembly' },
  { label: 'Objective-C' },
];

const createTechnology = async (technology) => {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(technology),
    });
    const data = await response.json();
    console.log(`Technologie ${technology.label} créée avec succès :`, data);
  } catch (error) {
    console.error(`Erreur lors de la création de la technologie ${technology.label} :`, error.message);
  }
};

const createTechnologies = async () => {
  for (const technology of technologiesData) {
    await createTechnology(technology);
  }
  console.log('Toutes les technologies ont été créées.');
};

createTechnologies();
