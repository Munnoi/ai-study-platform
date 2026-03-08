from django.urls import path
from .views import UploadPaperView, PaperListView, PaperDetailView

urlpatterns = [
    path("upload/", UploadPaperView.as_view()),
    path("", PaperListView.as_view()),
    path("<int:pk>/", PaperDetailView.as_view()),
]