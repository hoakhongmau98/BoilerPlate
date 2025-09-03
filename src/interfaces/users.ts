 interface UserInterface {
  id: number;
  employeeCode: string;
  departmentId: number;
  positionId: number;
  address: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  email: string;
  dateIn: Date;
  dateOut: Date;
  dateOfBirth: Date;
  gender: string;
  status: string;
  role: string;
  description: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export default UserInterface;
