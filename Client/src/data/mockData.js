export const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "user",
    profilePicture: "https://i.pravatar.cc/150?img=1",
    appointments: [
      {
        id: 1,
        counselorId: 1,
        date: "2024-03-20",
        time: "10:00",
        status: "upcoming"
      }
    ]
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    role: "user",
    profilePicture: "https://i.pravatar.cc/150?img=2",
    appointments: []
  }
];

export const counselors = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    email: "sarah@example.com",
    password: "password123",
    role: "counselor",
    profilePicture: "https://i.pravatar.cc/150?img=3",
    specialization: "Anxiety and Depression",
    experience: "8 years",
    rating: 4.8,
    availability: [
      { day: "Monday", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { day: "Wednesday", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { day: "Friday", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] }
    ],
    appointments: [
      {
        id: 1,
        userId: 1,
        userName: "John Doe",
        date: "2024-03-20",
        time: "10:00",
        status: "upcoming"
      }
    ]
  },
  {
    id: 2,
    name: "Dr. Michael Brown",
    email: "michael@example.com",
    password: "password123",
    role: "counselor",
    profilePicture: "https://i.pravatar.cc/150?img=4",
    specialization: "Relationship Counseling",
    experience: "12 years",
    rating: 4.9,
    availability: [
      { day: "Tuesday", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { day: "Thursday", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] }
    ],
    appointments: []
  }
]; 