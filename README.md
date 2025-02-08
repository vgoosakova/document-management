# Document Management System

## Overview
Document Management System is a web application built with Angular 18+ that provides document management capabilities, including document storage, filtering, sorting, and review processes. The system supports two user roles: **User** and **Reviewer**.

## Features
- User authentication using JWT
- Document listing with pagination, filtering, and sorting
- Role-based access control
- Document review workflow
- Integration with PSPDFKit for document viewing and editing
- State management using NGXS
- Angular Material UI components

## Technologies
- **Frontend**: Angular 18+, TypeScript
- **State Management**: NGXS
- **UI Framework**: Angular Material
- **Document Rendering**: PSPDFKit
- **Testing**: Jasmine & Karma

## Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Recommended: v18+)
- [Yarn](https://yarnpkg.com/) (Recommended: v1.22+)
- Angular CLI (Install globally if needed: `npm install -g @angular/cli`)

### Installation
Clone the repository and install dependencies:
```sh
git clone <repository-url>
cd document-management
yarn install
```

### Running the Application
To start the application with a proxy configuration:
```sh
yarn start
```
The application will be available at `http://localhost:4200/`.

### Building for Production
```sh
yarn build
```

### Running Tests
Run unit tests:
```sh
yarn test
```
Run lint checks:
```sh
yarn lint
```
