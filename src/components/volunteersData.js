export const volunteersData = {
  exampleVolunteer1: {
    name: "exampleVolunteer1",
    shifts: [
      {
        dayOfWeek: "Sunday",
        role: "Front Desk Specialist",
        startTime: "09:30",
        duration: 2,
        repeat: "once",
        specificDate: "2025-03-23", // Specific date for "once" shifts
      },
      {
        dayOfWeek: "Monday",
        role: "Gallery Helper",
        startTime: "14:00",
        duration: 3,
        repeat: "every week",
        startDate: "2025-03-01", // Repeating start date
        endDate: "2025-06-01", // Repeating end date
      },
    ],
  },
  exampleVolunteer2: {
    name: "exampleVolunteer2",
    shifts: [
      {
        dayOfWeek: "Tuesday",
        role: "Front Desk Specialist",
        startTime: "10:00",
        duration: 4,
        repeat: "once",
        specificDate: "2025-03-25", // Specific date for "once" shifts
      },
      {
        dayOfWeek: "Friday",
        role: "Gallery Helper",
        startTime: "12:00",
        duration: 2,
        repeat: "every week",
        startDate: "2025-03-01", // Repeating start date
        endDate: "2025-06-01", // Repeating end date
      },
    ],
  },
  exampleVolunteer3: {
    name: "exampleVolunteer3",
    shifts: [
      {
        dayOfWeek: "Wednesday",
        role: "Gallery Helper",
        startTime: "09:30",
        duration: 2,
        repeat: "once",
        specificDate: "2025-03-26", // Specific date for "once" shifts
      },
      {
        dayOfWeek: "Saturday",
        role: "Front Desk Specialist",
        startTime: "15:00",
        duration: 3,
        repeat: "every week",
        startDate: "2025-03-01", // Repeating start date
        endDate: "2025-06-01", // Repeating end date
      },
    ],
  },
};
