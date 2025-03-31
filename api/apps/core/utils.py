import os
import re


def get_angular_file_names(build_dir: str):
    files = {
        "main_js": "",
        "polyfills_js": "",
        "styles_css": "",
    }

    # Define regex patterns to match filenames
    patterns = {
        "main_js": re.compile(r"^main\-?[a-zA-Z0-9]*\.js$"),
        "polyfills_js": re.compile(r"^polyfills\-?[a-zA-Z0-9]*\.js$"),
        "styles_css": re.compile(r"^styles\-?[a-zA-Z0-9]*\.css$"),
    }

    # List files in the build directory and match with patterns
    try:
        for filename in os.listdir(build_dir):
            for key, pattern in patterns.items():
                if pattern.match(filename):
                    files[key] = f"static/dist/app/browser/{filename}"
    except FileNotFoundError:
        pass

    return files
