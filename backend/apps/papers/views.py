from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import QuestionPaper, Flashcard
from .serializers import QuestionPaperSerializer, FlashcardSerializer
from .services.process_paper import process_question_paper
from .services.ai.generate_flashcards import generate_flashcards


class UploadPaperView(APIView):
    permission_classes = [IsAuthenticated]

    # POST /papers/upload/
    def post(self, request):
        # Validates the data.
        # Converts to Django model.
        serializer = QuestionPaperSerializer(data=request.data)

        if serializer.is_valid(): # Checks if the uploaded data is valid.
            paper = serializer.save(user=request.user) # Saves the paper to the db with the user info.
            process_question_paper(paper)
            return Response(QuestionPaperSerializer(paper).data, status=201) # Returns the created paper with 201 created sc.

        return Response(serializer.errors)


class PaperListView(APIView):
    permission_classes = [IsAuthenticated]

    # GET /papers/
    def get(self, request):
        papers = QuestionPaper.objects.filter(user=request.user).order_by('-uploaded_at') # Gets papers of the logged in user ordered by uploaded_at.
        serializer = QuestionPaperSerializer(papers, many=True) # Converts Django objects into JSON.
        return Response(serializer.data)


class PaperDetailView(APIView):
    permission_classes = [IsAuthenticated]

    # GET /papers/3/
    def get(self, request, pk):
        try:
            paper = QuestionPaper.objects.get(pk=pk, user=request.user) # Gets the specific paper (by id) of the user.
        except QuestionPaper.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        return Response(QuestionPaperSerializer(paper).data)

    # DELETE /papers/3/
    def delete(self, request, pk):
        try:
            paper = QuestionPaper.objects.get(pk=pk, user=request.user) # Gets the specific paper (by id) of the user.
        except QuestionPaper.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        paper.delete() # Deletes that particular paper.
        return Response(status=204) # Status no content


class FlashcardsView(APIView):
    permission_classes = [IsAuthenticated]

    # GET /papers/3/flashcards/
    def get(self, request, pk): # To fetch the flashcards
        try:
            # This does two things:
            # 1. Finds the paper with id pk
            # 2. Ensures it belongs to the current user
            paper = QuestionPaper.objects.get(pk=pk, user=request.user)
        except QuestionPaper.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        # Get all flashcards linked to this paper.
        flashcards = paper.flashcards.all().order_by('id')
        return Response(FlashcardSerializer(flashcards, many=True).data) # Converts Django models into JSON.

    # POST /papers/3/flashcards/
    def post(self, request, pk): # If the user again regenerates flashcards
        try:
            paper = QuestionPaper.objects.get(pk=pk, user=request.user) # Gets the paper
        except QuestionPaper.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        questions = paper.questions.all() # Gets all questions from that paper.
        if not questions.exists():
            return Response({'error': 'No questions found'}, status=400)

        # Delete existing flashcards and regenerate
        paper.flashcards.all().delete()

        cards_data = generate_flashcards(list(questions))
        flashcards = []
        for card in cards_data:
            flashcards.append(Flashcard(
                question_paper=paper,
                front=card.get('front', ''),
                back=card.get('back', ''),
            ))
        Flashcard.objects.bulk_create(flashcards) # Inserts all flashcards in one database query.

        return Response(FlashcardSerializer(flashcards, many=True).data, status=201) # Converts Django models into JSON and returns a status of 201 created.