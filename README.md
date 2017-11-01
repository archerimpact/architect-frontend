# README: Flagship Dashboard

### Setup with Docker

1. Install Docker.
2. Clone this repo.
3. Run `docker-compose up` from the project directory. The frontend (react) should now be visible on localhost:3000, and the backend (node) should now be visible on localhost:8000.

With Docker, all of your containers are basically running on a virtual linux machine. So, you must run migration commands within the container. 

### Adding dependencies to the backend

1. From the project directory run `docker-compose exec backend yarn add <package>`.
2. Make sure your teammates run `docker-compose build` whenever they eventually get your code changes, so that their backend containers rebuild with the new package.

### Adding packages to the frontend

1. Start the servers by running `docker-compose up` from the project directory.
2. Open up a new shell, and again from the project directory run `docker-compose exec frontend yarn add <package>`.
3. Make sure your teammates run `docker-compose build` whenever they eventually get your code changes, so that their frontend containers rebuild with the new package.

### To see timestamps with logs for debugging backend

1. Run `docker-compose up -d` to start the containers in the background.
2. Run `docker-compose logs -ft` to start following the logs with timestamps.
(Note - timestamps displayed in UTC - container's default timezone.)

### Some reference documents

-Schema organization: https://docs.google.com/document/d/1KAHugkCjzoh1-G-FfDljJjswe48g6w6oxeMiKCyLVJo/edit
- Routes API: https://docs.google.com/document/d/1yE-oxyeGPGvXth3nnrQnyXMz6Ly9hl1u-gLx7EeNVFk/edit
