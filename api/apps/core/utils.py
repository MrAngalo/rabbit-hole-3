import os
import re

from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives

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


def send_verification_email(user_email, username, code):
    subject = "Verify Your Email"
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user_email]
    verification_link = (
        f"https://rabbit.guisilva.com/pwreset?email={user_email}&token={code}"
    )

    context = {
        "username": username,
        "verification_code": code,
        "verification_link": verification_link,
    }

    html_content = render_to_string("emails/verify_email.html", context)
    text_content = f"Hello {username}, use this code to verify your email: {code}\nOr click this link: {verification_link}"

    email = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
    email.attach_alternative(html_content, "text/html")
    email.send()

    print(f"Successfully sent email to {username} ({user_email})")
