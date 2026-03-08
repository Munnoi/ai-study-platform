from django.urls import path
from .views import UploadPaperView

urlpatterns = [
    path("upload/", UploadPaperView.as_view()),
]