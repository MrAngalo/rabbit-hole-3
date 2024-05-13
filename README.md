# rabbit-hole-3
An updated version of Rabbit Hole 2 using django and angular

## Prerequisite:

You must have Node.js. The wrapper node project was created using v18.16.0, and other versions may or may not work.
If you prefer to install manually without Node.js, please copy the scripts found in ./package.json into your terminal.

You must have Docker. Docker is the environment in which the project will be built and ran. Make sure you have it running in the
background before you attempt installation

## 1. Installation:

To install the project, use:
```
npm run build
npm run start
```

## 2. Create admin users

User authentication is handled by Django, to create a superuser, use:

```
cd api
python3 manage.py createsuperuser
```

Note that you must have run the installation before creating a superuser




