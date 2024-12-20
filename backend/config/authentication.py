# config/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError, TokenBackendError
from rest_framework_simplejwt.backends import TokenBackend
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get('PLAST_DEV_ACCESS_TOKEN')
        if not token:
            logger.debug("No token found in cookies.")
            return None
        
        try:
            token_backend = TokenBackend(
                algorithm=settings.SIMPLE_JWT['ALGORITHM'],
                signing_key=settings.SIMPLE_JWT['SIGNING_KEY'],
                verifying_key=settings.SIMPLE_JWT.get('VERIFYING_KEY')
            )
            validated_token = token_backend.decode(token, verify=True)
            logger.debug("Token is valid.")
        except (TokenError, TokenBackendError) as e:
            logger.error(f"Token validation error: {e}")
            return None

        try:
            user = self.get_user(validated_token)
            logger.debug(f"Authenticated user: {user.username}")
        except Exception as e:
            logger.error(f"Error retrieving user: {e}")
            return None

        if not user.is_active:
            logger.error("User account is inactive.")
            return None

        return (user, validated_token)
