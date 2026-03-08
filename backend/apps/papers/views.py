from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import QuestionPaper
from .serializers import QuestionPaperSerializer
from .services.process_paper import process_question_paper

class UploadPaperView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = QuestionPaperSerializer(data=request.data) # Loads incoming JSON/form data into the serializer.

        if serializer.is_valid(): # Checks if request data follows the model rules.
            paper = serializer.save(user=request.user)
            process_question_paper(paper) # Runs logic for parsing questions.
            return Response(QuestionPaperSerializer(paper).data, status=201) # Returns created object data with HTTP 201 Created.

        return Response(serializer.errors)