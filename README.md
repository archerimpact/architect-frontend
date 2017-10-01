# README: Flagship Dashboard

### Setup with Docker

1. Install Docker.
2. Clone this repo.
3. Run `docker-compose up` from the project directory. The frontend (react) should now be visible on localhost:3000, and the backend (django) should now be visible on localhost:8000.

### Adding dependencies to the backend

1. Add a line to `backend/requirements.txt`.
2. Run `docker-compose build` to rebuild with the new requirement.

### Migrations in PostrgreSQL

With Docker, all of your containers are basically running on a virtual linux machine. So, you must run migration commands within the container. 

While `docker-compose up` is running, 

1. to makemigrations: `docker-compose exec backend python3 manage.py makemigrations`
2. to migrate: `docker-compose exec backend python3 manage.py migrate`

### Adding packages to the frontend

1. Start the servers by running `docker-compose up` from the project directory.
2. Open up a new shell, and again from the project directory run `docker-compose exec frontend yarn add <package>`.
3. Make sure your teammates run `docker-compose build` whenever they eventually get your code changes, so that their frontend containers rebuild with the new package.

