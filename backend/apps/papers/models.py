from django.db import models
from django.conf import settings

class QuestionPaper(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='question_papers/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='uploaded')

    def __str__(self):
        return self.title

class Question(models.Model):
    question_paper = models.ForeignKey(QuestionPaper, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    marks = models.IntegerField(null=True, blank=True)
    question_number = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question_text