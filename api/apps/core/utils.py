import os
import re

from . import settings


def get_angular_file_names(build_dir: str):
    base_url = os.path.join(settings.STATIC_URL, build_dir)
    base_dir = os.path.join(settings.STATIC_DIR, build_dir)

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
        for filename in os.listdir(base_dir):
            for key, pattern in patterns.items():
                if pattern.match(filename):
                    files[key] = os.path.join(base_url, filename)
    except FileNotFoundError:
        pass

    return files
