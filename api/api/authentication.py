from datetime import datetime, timezone
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from rest_framework.authtoken.models import Token


class ExpiringTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        try:
            token = Token.objects.get(key=key)
        except Token.DoesNotExist:
            raise AuthenticationFailed("Invalid token.")

        if not token.user.is_active:
            raise AuthenticationFailed("User is inactive or deleted.")

        utc_now = datetime.now(timezone.utc)

        if token.created < utc_now - settings.TOKEN_EXPIRE_TIME:
            raise AuthenticationFailed("Token has expired.")

        return token.user, token
