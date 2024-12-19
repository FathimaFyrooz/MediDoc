"""
URL configuration for medi_doc_server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from api.views import save_medical_details,list_patients,view_pdf,ask_ai,delete_patient
from django.conf import settings
from django.conf.urls.static import static




urlpatterns = [
    path('admin/', admin.site.urls),
    path('save/',save_medical_details,name='save_medical_details'),
    path('list_patients/',list_patients, name='list_patients'),
    # path('view/', view_document, name='view_document'),
    path('view_pdf/<int:patient_id>/', view_pdf),
    path('ai_analysis/',ask_ai,name='ask_ai'),
    path('delete_patient/<int:patient_id>/',delete_patient,name='delete_patient')
    # path('get_diagnosis/',get_diagnosis),
    # path('get_prescription/',get_prescription)

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)