from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import QuestionPaper
from .serializers import QuestionPaperSerializer
from .services.process_paper import process_question_paper


class UploadPaperView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = QuestionPaperSerializer(data=request.data)

        if serializer.is_valid():
            paper = serializer.save(user=request.user)
            process_question_paper(paper)
            return Response(QuestionPaperSerializer(paper).data, status=201)

        return Response(serializer.errors)


class PaperListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        papers = QuestionPaper.objects.filter(user=request.user).order_by('-uploaded_at')
        serializer = QuestionPaperSerializer(papers, many=True)
        return Response(serializer.data)


class PaperDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            paper = QuestionPaper.objects.get(pk=pk, user=request.user)
        except QuestionPaper.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        return Response(QuestionPaperSerializer(paper).data)

    def delete(self, request, pk):
        try:
            paper = QuestionPaper.objects.get(pk=pk, user=request.user)
        except QuestionPaper.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        paper.delete()
        return Response(status=204)