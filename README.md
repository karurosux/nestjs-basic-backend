# NodeJs + NestJs + Prisma + PostgreSql Basic Monolith Backend

This application contains basic backend structure using NestJs framework, Prisma ORM and PostgreSQL database, the template includes:

- Tables for Users, Roles, Branches and Permissions for Roles.
- Endpoints for:
  - Authentication using Jwt and Sessions
  - Logout
  - Create user
  - Delete user
  - Get paginated user list
  - Create Roles
  - Get Roles
  - Create Role Permission
  - Delete Role Permission
  - Update Role Permission
- Custom Annotations:
  - @Public() - All endpoints are protected by default, this annotation makes the endpoint public and unprotected.
  - @Permissions(...) - This annotation allows to add protection at role level, allowing to define if authenticated user's role can access to it.
  - @AuthenticatedUser() - Injects the authenticated user in controllers, user is of type UserWithPermissions.

## Make it Run

### Prerequisites

1. This project needs docker installed.
2. This project use nodejs and npm.

### Steps

1. Run the next command in project folder:
   `docker-compose up -d`.
2. Run `npm run prisma:migrate`.
3. Run `npm run prisma:seed`.
4. Run `npm run start:dev`.
