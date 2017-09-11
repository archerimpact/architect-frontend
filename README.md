# README: Flagship Dashboard

### Setup with Docker

1. Install Docker.
2. Clone this repo.
3. Run `docker-compose up` from the project directory. The frontend (react) should now be visible on localhost:3000, and the backend (django) should now be visible on localhost:8000.

### Adding dependencies to the backend

1. Add a line to `backend/requirements.txt`.
2. Run `docker-compose build` to rebuild with the new requirement.

### Adding packages to the frontend

1. Start the servers by running `docker-compose up` from the project directory.
2. Open up a new shell, and again from the project directory run `docker-compose exec frontend yarn install --save <package>`.
3. Make sure your teammates run `docker-compose build` whenever they eventually get your code changes, so that their frontend containers rebuild with the new package.

