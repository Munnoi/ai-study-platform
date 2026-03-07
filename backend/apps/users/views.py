from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all() # Define the queryset for this view, which is all User objects. This is necessary for the CreateAPIView to know where to create new users.
    serializer_class = RegisterSerializer # Use the RegisterSerializer to handle user registration data and validation
    permission_classes = [AllowAny] # Allow anyone to access this view, even if they are not authenticated. This is important for registration endpoints.

class LoginView(APIView):
    permission_classes = [AllowAny] # Allow anyone to access this view, even if they are not authenticated. This is important for login endpoints.

    def post(self, request):
        # Passes input to serializer for validation/auth logic 
        serializer = LoginSerializer(data=request.data) # request.data contains JSON body (username, password)
        # Validate the incoming data and raise an exception if it's invalid. This will automatically return a 400 Bad Request response with error details if validation fails.
        # If invalid, DRF automatically returns 400 with error details
        # If valid, serializer.validated_data now contains tokens + user info 
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK) # If validation is successful, return the validated data (which includes the access token, refresh token, and user information) in the response with a 200 OK status.