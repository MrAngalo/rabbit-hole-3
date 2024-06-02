# Rabbit Hole 3

An updated version of Rabbit Hole 2 using Django and Angular.

## Prerequisites

### Software Requirements

Before proceeding with the installation, ensure you have the following software installed. Different versions may work, but these are the configurations used for development:

- [Node.js v8.20.3](https://nodejs.org/en/download/prebuilt-installer)
- [Python v3.10.0](https://www.python.org/downloads/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Visual Studio Code](https://code.visualstudio.com/)

**Note:** When installing Python, make sure to click the checkbox "Add Python 3.10 to PATH". This enables running pip modules by name without typing "pip -m".

### Python Virtual Environment

**Note:** This only applies for developers. if you are just checking out the project, you do not need to create a virtual environment.

It is recommended that you setup a virtual environment to isolate global and local modules:

1. Open a terminal on the same directory as this file
2. Run the following commands:
    ```bash
    python -m venv ./venv
    ```

The virtual environment will be generated based on your operating system. To activate it in windows:

1. Open a terminal on the same directory as this file
2. Run one of the following commands depending on your shell (.bat is for command prompt while .ps1 is for powershell):
    ```bash
    ./venv/Scripts/activate.bat
    ./venv/Scripts/Activate.ps1
    ```
3. You will see if it worked if you see **(venv)** in the terminal.
4. Install python black, the code formatter:
    ```bash
    pip install black
    ```

**Note:** If you are using powershell and run into this error, "\venv\Scripts\Activate.ps1 cannot be loaded because running scripts is disabled on this system,"
please refer to [this solution](https://stackoverflow.com/questions/64633727/how-to-fix-running-scripts-is-disabled-on-this-system) 

### Python Environment File

The Python service of this project requires an environment file, which is not included and must be created manually:

1. Open your file explorer and navigate to the `./api/` folder.
2. Create a copy of `.env.template` and rename it to `.env`.

### Tenor's API Key

This project utilizes the Tenor API v2 to render GIFs present on the website. You must acquire an API key from Tenor to utilize it:

1. Navigate to [Tenor's API Quickstart Guide](https://developers.google.com/tenor/guides/quickstart).
2. Sign up for or log in to the Google Cloud Console.
3. Obtain a Tenor API Key.
4. Copy the key and paste it into the `.env` file for `TENOR_API_V2`.

## Installation

To install the project, follow these steps:

1. Open a terminal on the same directory as this file
2. Run the following commands:
    ```bash
    npm install
    npm run build
    npm run start
    ```

## Create Admin Users

User authentication is handled by Django. To create a superuser, follow these steps:

1. Navigate to the `api` directory.
2. Run the following command:
    ```bash
    python3 manage.py createsuperuser
    ```

**Note:** Ensure you have completed the installation before creating a superuser.
