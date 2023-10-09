# House Renting API

This is a Node.js-based API for house renting and listing. Users can post their houses for rent and list houses for sale. It is built using Express.js, MongoDB, Jest for testing, Docker for containerization, and other technologies. Below is a breakdown of the tech stack and a directory explanation.

## Tech Stack

- **Server**: Express.js
- **Database**: MongoDB
- **Tests Framework**: Jest
- **Code Versioning**: Git
- **Code Repository**: GitHub
- **Container System**: Docker, docker-compose
- **Continuous Integration**: GitHub Actions
- **IDE**: Visual Studio Code (VSCode)

## Directory Structure

### `routes`

- Contains the routes for both admin and user services.
- Services are defined here with a v1 versioning structure.

### `services`

- Contains the business logic for processing endpoint requests.

### `models`

- Contains the model files used in the application.

### `handlers`

- Defines HTTP verbs (GET, PUT, POST, etc.) for each resource.
- Each verb for a route has a separate service file containing the business logic for that endpoint.

### `middlewares`

- Contains middleware functions used in the application, such as `authGate.js`.

### `utils`

- Contains utility feature-related files used app-wide.
- Examples include `emailer.js`, `multer.js`, `cloudinary.js`, and `emailtemplate generator`.

### `validation`

- Contains middleware for request validations, such as Joi validation and ID validators.

### `config`

- Contains custom-made messages and configuration files.

### `client`

- Contains HTML templates sent to users as part of the application.

## Getting Started

1. Clone the repository from GitHub.
2. Install Node.js and npm if not already installed.
3. Run `npm install` to install project dependencies.
4. Set up a MongoDB instance and configure the database connection.
5. Run the application using `npm start`.

## Testing

- Use Jest for running tests. Run `npm test` to execute the test suite.

## Dockerization

- Docker and docker-compose files are provided for containerization. Use `docker-compose up` to run the application in a Docker container.

## Continuous Integration

- GitHub Actions have been set up for continuous integration to automate testing and deployment processes.

## Contributing

Feel free to contribute to this project by opening issues or pull requests on the GitHub repository.

## License

This project is licensed under the [MIT License](LICENSE).
Work still in progress
