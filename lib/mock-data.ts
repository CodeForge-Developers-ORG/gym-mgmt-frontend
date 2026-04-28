import { faker } from '@faker-js/faker';

// Seed to ensure consistent data across reloads during development
faker.seed(123);

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'TRAINER' | 'CUSTOMER';

// --- GENERATORS ---

export const generateGyms = (count = 5) => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    name: `${faker.location.city()} Fitness Hub`,
    location: faker.location.streetAddress(),
    city: faker.location.city(),
    status: faker.helpers.arrayElement(['Active', 'Active', 'Active', 'Maintenance', 'Inactive']),
    membersCount: faker.number.int({ min: 100, max: 2000 }),
    revenue: faker.number.int({ min: 10000, max: 150000 }),
    managerName: faker.person.fullName(),
    contactEmail: faker.internet.email(),
    contactPhone: faker.phone.number(),
    createdAt: faker.date.past({ years: 2 }).toISOString(),
  }));
};

export const generateUsers = (role: Role, count = 10) => {
  return Array.from({ length: count }).map(() => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      id: faker.string.uuid(),
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }),
      avatar: faker.image.avatar(),
      role,
      phone: faker.phone.number(),
      joinDate: faker.date.past({ years: 1 }).toISOString(),
      status: faker.helpers.arrayElement(['Active', 'Active', 'Active', 'Inactive']),
      // Role specific fields
      ...(role === 'CUSTOMER' && {
        membershipPlan: faker.helpers.arrayElement(['Basic', 'Pro', 'Elite', 'Student']),
        attendanceRate: faker.number.int({ min: 20, max: 100 }),
        nextBillingDate: faker.date.future({ years: 0.2 }).toISOString(),
      }),
      ...(role === 'TRAINER' && {
        specialization: faker.helpers.arrayElement(['Weightlifting', 'Yoga', 'CrossFit', 'Cardio', 'HIIT']),
        rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
        clientsCount: faker.number.int({ min: 5, max: 30 }),
      })
    };
  });
};

export const generateClasses = (count = 15) => {
  return Array.from({ length: count }).map(() => {
    const startTime = faker.date.soon({ days: 7 });
    const durationMins = faker.helpers.arrayElement([30, 45, 60, 90]);
    const endTime = new Date(startTime.getTime() + durationMins * 60000);
    
    return {
      id: faker.string.uuid(),
      title: faker.helpers.arrayElement(['Morning Yoga', 'HIIT Blast', 'Spin Class', 'Powerlifting 101', 'Zumba', 'Pilates Core', 'Boxing Bootcamp']),
      trainerId: faker.string.uuid(),
      trainerName: faker.person.fullName(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: durationMins,
      capacity: faker.number.int({ min: 10, max: 30 }),
      enrolled: faker.number.int({ min: 5, max: 30 }),
      location: `Studio ${faker.helpers.arrayElement(['A', 'B', 'C', 'Main Floor'])}`,
      status: faker.helpers.arrayElement(['Scheduled', 'Scheduled', 'In Progress', 'Completed', 'Cancelled']),
    };
  });
};

export const generateRevenueData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    name: month,
    total: faker.number.int({ min: 15000, max: 50000 }),
    subscriptions: faker.number.int({ min: 10000, max: 40000 }),
    merchandise: faker.number.int({ min: 1000, max: 8000 }),
  }));
};

// --- PRE-GENERATED MOCK DATA STORE ---

export const mockData = {
  gyms: [],
  superAdmins: [],
  admins: [],
  trainers: [],
  customers: [],
  classes: [],
  revenueChart: [],
  recentActivity: []
};
