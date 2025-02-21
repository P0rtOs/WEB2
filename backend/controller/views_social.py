# controller/views_social.py
import jwt
from rest_framework.response import Response
from rest_framework import status
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.serializers import JWTSerializer
from allauth.socialaccount.models import SocialLogin, SocialAccount
from dj_rest_auth.registration.serializers import SocialLoginSerializer

class CustomGoogleOAuth2Adapter(GoogleOAuth2Adapter):
    def complete_login(self, request, app, token, **kwargs):
        """
        Instead of making an HTTP call to fetch user info,
        decode the id_token locally.
        WARNING: For production, verify the token signature using Google's public keys.
        """
        id_token = token.token
        # For simplicity, signature verification is disabled.
        user_data = jwt.decode(id_token, options={"verify_signature": False})
        return self.get_provider().sociallogin_from_response(request, user_data)

class GoogleLogin(SocialLoginView):
    adapter_class = CustomGoogleOAuth2Adapter
    serializer_class = SocialLoginSerializer

    def post(self, request, *args, **kwargs):
        # Create and validate the serializer.
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        print("validated_data:", serializer.validated_data)
        
        # Assign serializer to self so that self.login() can use it.
        self.serializer = serializer

        # Attempt to retrieve sociallogin; if missing, build it manually.
        sociallogin = serializer.validated_data.get("sociallogin")
        if not sociallogin:
            user = serializer.validated_data.get("user")
            # Create a minimal SocialLogin instance from the user.
            sociallogin = SocialLogin(account=SocialAccount(user=user))
        self.sociallogin = sociallogin

        # Proceed with the login flow.
        self.login()
        response_data = self.get_response_data(self.user)
        return Response(response_data, status=status.HTTP_200_OK)

    def get_response_data(self, user):
        jwt_serializer = JWTSerializer(instance=user, context={'request': self.request})
        return jwt_serializer.data
