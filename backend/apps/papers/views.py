from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import QuestionPaper
from .serializers import QuestionPaperSerializer


class UploadPaperView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        serializer = QuestionPaperSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)

        return Response(serializer.errors)