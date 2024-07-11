const apiUrl = 'http://localhost:3000/api/users';
const bearerToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY4YmJiMmM2M2QzYzdkYWFmYzBkNWZkIn0sImlhdCI6MTcyMDcwOTIyMiwiZXhwIjoxNzIwNzEyODIyfQ.UKHQeVkHYmlfUJxwh6c0hYufY5uPeIsDMO2PJc5JIsw';

const usersData = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'adminadmin',
    role: 'mentor',
    gender: 'male',
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'adminadmin',
    role: 'mentor',
    gender: 'female',
  },
  {
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@example.com',
    password: 'adminadmin',
    role: 'mentor',
    gender: 'male',
  },
  {
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@example.com',
    password: 'adminadmin',
    role: 'mentor',
    gender: 'female',
  },
  {
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@example.com',
    password: 'adminadmin',
    role: 'mentor',
    gender: 'male',
  },
  {
    firstName: 'Sophia',
    lastName: 'Miller',
    email: 'sophia.miller@example.com',
    password: 'adminadmin',
    role: 'mentor',
    gender: 'female',
  },
  {
    firstName: 'Robert',
    lastName: 'Moore',
    email: 'robert.moore@example.com',
    password: 'adminadmin',
    role: 'mentor',
    gender: 'male',
  },
  {
    firstName: 'Olivia',
    lastName: 'Taylor',
    email: 'olivia.taylor@example.com',
    password: 'adminadmin',
    role: 'mentor',
    gender: 'female',
  },
  {
    firstName: 'William',
    lastName: 'Anderson',
    email: 'william.anderson@example.com',
    password: 'adminadmin',
    role: 'mentor',
    gender: 'male',
  },
  {
    firstName: 'Ava',
    lastName: 'Thomas',
    email: 'ava.thomas@example.com',
    password: 'adminadmin',
    role: 'user',
    gender: 'female',
  },
  {
    firstName: 'James',
    lastName: 'Jackson',
    email: 'james.jackson@example.com',
    password: 'adminadmin',
    role: 'user',
    gender: 'male',
  },
  {
    firstName: 'Charlotte',
    lastName: 'White',
    email: 'charlotte.white@example.com',
    password: 'adminadmin',
    role: 'user',
    gender: 'female',
  },
  {
    firstName: 'Liam',
    lastName: 'Martinez',
    email: 'liam.martinez@example.com',
    password: 'adminadmin',
    role: 'user',
    gender: 'male',
  },
  {
    firstName: 'Isabella',
    lastName: 'Hernandez',
    email: 'isabella.hernandez@example.com',
    password: 'adminadmin',
    role: 'user',
    gender: 'female',
  },
];

const createUser = async (user) => {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    console.log(`Utilisateur ${user.firstName} ${user.lastName} créé avec succès :`, data);
  } catch (error) {
    console.error(`Erreur lors de la création de l'utilisateur ${user.firstName} ${user.lastName} :`, error.message);
  }
};

const createUsers = async () => {
  for (const user of usersData) {
    await createUser(user);
  }
  console.log('Tous les utilisateurs ont été créés.');
};

createUsers();
