import 'reflect-metadata';
import { Container } from 'inversify';
import { UserService, IUserService } from '@services/user.service';
import { UserRepository, IUserRepository } from '@repositories/user.repository';

// Define service identifiers
export const TYPES = {
  UserService: Symbol.for('UserService'),
  UserRepository: Symbol.for('UserRepository'),
  // Add more service identifiers as needed
  // AuthService: Symbol.for('AuthService'),
  // EmailService: Symbol.for('EmailService'),
  // FileService: Symbol.for('FileService'),
};

// Create and configure the container
const container = new Container();

// Bind services
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

// Bind repositories
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);

// Export the configured container
export { container };

// Helper function to get a service from the container
export function getService<T> (serviceIdentifier: symbol): T {
  return container.get<T>(serviceIdentifier);
}

// Helper function to get a repository from the container
export function getRepository<T> (repositoryIdentifier: symbol): T {
  return container.get<T>(repositoryIdentifier);
}
