from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class NitJWTAuthentication(JWTAuthentication):
    def authenticate_credentials(self, payload):
        user_model = UserModel._default_manager.get(nit=payload['user_id'])
        user = self.authenticate_user(user_model, payload)
        return user