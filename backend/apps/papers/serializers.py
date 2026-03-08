from rest_framework import serializers
from .models import QuestionPaper, Question, Flashcard

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = '__all__'

class QuestionPaperSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True) # questions field on QuestionPaperSerializer should be represented using QuestionSerializer, as a list, and only for output.
    class Meta:
        model = QuestionPaper
        fields = '__all__'
        read_only_fields = ['user']