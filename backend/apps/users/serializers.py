from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8) # Ensure password is at least 8 characters long and is write-only (not returned in API responses)

    class Meta:
        model = User # Use Django's built-in User model
        email = serializers.EmailField(required=False, allow_blank=True) # Make email an optional field
        fields = ['username', 'email', 'password']  # Only include these fields in the serializer

    def validate_username(self, value):
        # Check if the provided username already exists in the database
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already exists')
        return value
    
    def create(self, validated_data):
        # Create a new user using the validated data. The create_user method will handle password hashing and other necessary steps.
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ""),
            password=validated_data['password']
        )

class LoginSerializer(serializers.Serializer):
    # Define the fields for the login serializer, which will be used to validate login credentials
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password) # Use Django's built-in authentication system to verify the provided credentials
            if not user:
                raise serializers.ValidationError('Invalid credentials')
        else:
            raise serializers.ValidationError('Both username and password are required')

        refresh = RefreshToken.for_user(user) # Generate a JWT refresh token for the authenticated user
        # Return the access token, refresh token, and user information in the response
        # The access token is used for authenticating subsequent requests, while the refresh token can be used to obtain new access tokens when the current one expires.
        # That returned dict becomes serializer.validated_data and is typically sent directly in the API response
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            },
        }